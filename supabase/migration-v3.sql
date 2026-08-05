-- =============================================================
-- Bessoni & Fortes — Migração para v3 (Sistema de Gestão Jurídica Eleitoral)
--
-- Este script é ADITIVO: só usa ALTER TABLE / CREATE TABLE / CREATE OR
-- REPLACE, nunca DROP TABLE em dado real. Seguro de rodar em cima do
-- banco que já está em uso, com clientes/processos já cadastrados.
--
-- Como usar: cole este arquivo inteiro no SQL Editor do Supabase
-- (Project → SQL Editor → New query) e clique em "Run". Pode rodar mais
-- de uma vez sem problema (os comandos são todos "se não existir" /
-- "substitua").
-- =============================================================

-- -------------------------------------------------------------
-- 1. clientes.tipo_cliente — substitui nivel + eh_candidato
-- -------------------------------------------------------------
alter table clientes add column if not exists tipo_cliente text;

update clientes set tipo_cliente = case
  when nivel = 'nacional' then 'diretorio_nacional'
  when nivel = 'estadual' then 'diretorio_estadual'
  when nivel = 'municipal' then 'diretorio_municipal'
  when eh_candidato then 'candidato'
  when documento is not null and length(regexp_replace(documento, '\D', '', 'g')) = 14 then 'pessoa_juridica'
  else 'pessoa_fisica'
end
where tipo_cliente is null;

alter table clientes alter column tipo_cliente set not null;

alter table clientes drop constraint if exists clientes_tipo_cliente_check;
alter table clientes add constraint clientes_tipo_cliente_check check (
  tipo_cliente in (
    'diretorio_nacional', 'diretorio_estadual', 'diretorio_municipal',
    'candidato', 'pessoa_fisica', 'pessoa_juridica'
  )
);

create index if not exists idx_clientes_tipo on clientes (tipo_cliente);

alter table clientes drop constraint if exists chk_nao_orgao_e_candidato;
alter table clientes drop column if exists nivel;
alter table clientes drop column if exists eh_candidato;

-- -------------------------------------------------------------
-- 2. processos — campos de fluxo de prestação de contas
-- -------------------------------------------------------------
alter table processos add column if not exists houve_recurso boolean;
alter table processos add column if not exists transito_julgado boolean;
alter table processos add column if not exists data_transito date;
alter table processos add column if not exists responsavel text;

-- -------------------------------------------------------------
-- 3. obrigacoes → determinacoes (rename preserva os dados)
-- -------------------------------------------------------------
alter table if exists obrigacoes rename to determinacoes;
alter table determinacoes add column if not exists responsavel text;
alter table determinacoes add column if not exists data_transito_julgado date;
alter table determinacoes add column if not exists observacoes text;

alter index if exists idx_obrigacoes_processo rename to idx_determinacoes_processo;
alter index if exists idx_obrigacoes_status rename to idx_determinacoes_status;

-- -------------------------------------------------------------
-- 4. perfil_escopos — escopos adicionais por login
-- -------------------------------------------------------------
create table if not exists perfil_escopos (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null references perfis(id) on delete cascade,
  cliente_id uuid not null references clientes(id),
  nivel_acesso text not null default 'total' check (
    nivel_acesso in ('total', 'prestacao_contas', 'leitura')
  ),
  created_at timestamptz not null default now()
);

create index if not exists idx_perfil_escopos_perfil on perfil_escopos (perfil_id);
create index if not exists idx_perfil_escopos_cliente on perfil_escopos (cliente_id);

alter table perfil_escopos enable row level security;
grant select, insert, update, delete on perfil_escopos to authenticated;

drop policy if exists "perfil_escopos_select" on perfil_escopos;
create policy "perfil_escopos_select" on perfil_escopos for select
  using (perfil_id = auth.uid() or is_escritorio());
drop policy if exists "perfil_escopos_write" on perfil_escopos;
create policy "perfil_escopos_write" on perfil_escopos for all
  using (is_escritorio()) with check (is_escritorio());

-- -------------------------------------------------------------
-- 5. tenho_acesso() — centraliza a lógica de acesso (substitui
--    meu_cliente_path()/meu_escopo() espalhados em cada política)
-- -------------------------------------------------------------
create or replace function tenho_acesso(alvo_cliente_id uuid, categoria_processo text default null)
returns boolean
language sql stable security definer set search_path = public as $$
  select
    (
      exists (select 1 from perfis where id = auth.uid() and role = 'escritorio')
      and not exists (select 1 from perfil_escopos where perfil_id = auth.uid())
    )
    or exists (
      select 1
      from perfis p
      join clientes meu on meu.id = p.cliente_id
      join clientes alvo on alvo.id = alvo_cliente_id
      where p.id = auth.uid()
        and alvo.path like (meu.path || '%')
        and (p.escopo = 'total' or categoria_processo is null or categoria_processo = 'prestacao_contas')
    )
    or exists (
      select 1
      from perfil_escopos pe
      join clientes meu on meu.id = pe.cliente_id
      join clientes alvo on alvo.id = alvo_cliente_id
      where pe.perfil_id = auth.uid()
        and alvo.path like (meu.path || '%')
        and (pe.nivel_acesso = 'total' or categoria_processo is null or categoria_processo = 'prestacao_contas')
    );
$$;

-- -------------------------------------------------------------
-- 6. Políticas de clientes/processos/determinacoes reescritas
--    para usar tenho_acesso()
-- -------------------------------------------------------------
drop policy if exists "clientes_select" on clientes;
create policy "clientes_select" on clientes for select
  using (tenho_acesso(id));

drop policy if exists "processos_select" on processos;
create policy "processos_select" on processos for select
  using (tenho_acesso(cliente_id, categoria));

drop policy if exists "obrigacoes_select" on determinacoes;
drop policy if exists "determinacoes_select" on determinacoes;
create policy "determinacoes_select" on determinacoes for select
  using (
    exists (
      select 1 from processos pr
      where pr.id = determinacoes.processo_id
        and tenho_acesso(pr.cliente_id, pr.categoria)
    )
  );

drop policy if exists "obrigacoes_write" on determinacoes;
drop policy if exists "determinacoes_write" on determinacoes;
create policy "determinacoes_write" on determinacoes for all
  using (is_escritorio()) with check (is_escritorio());

-- -------------------------------------------------------------
-- 7. auditoria — histórico de alterações (quem, quando, o que mudou)
-- -------------------------------------------------------------
create table if not exists auditoria (
  id uuid primary key default gen_random_uuid(),
  tabela text not null,
  registro_id uuid not null,
  perfil_id uuid references perfis(id),
  campo text not null,
  valor_anterior text,
  valor_novo text,
  criado_em timestamptz not null default now()
);

create index if not exists idx_auditoria_registro on auditoria (tabela, registro_id);

alter table auditoria enable row level security;
grant select on auditoria to authenticated;

drop policy if exists "auditoria_select" on auditoria;
create policy "auditoria_select" on auditoria for select
  using (is_escritorio());

create or replace function fn_auditoria() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  campo text;
  antes jsonb := to_jsonb(OLD);
  depois jsonb := to_jsonb(NEW);
begin
  for campo in select jsonb_object_keys(depois) loop
    if campo in ('created_at', 'path') then continue; end if;
    if antes -> campo is distinct from depois -> campo then
      insert into auditoria (tabela, registro_id, perfil_id, campo, valor_anterior, valor_novo)
      values (TG_TABLE_NAME, NEW.id, auth.uid(), campo, antes ->> campo, depois ->> campo);
    end if;
  end loop;
  return NEW;
end;
$$;

drop trigger if exists trg_auditoria_clientes on clientes;
create trigger trg_auditoria_clientes after update on clientes
for each row execute function fn_auditoria();

drop trigger if exists trg_auditoria_processos on processos;
create trigger trg_auditoria_processos after update on processos
for each row execute function fn_auditoria();

drop trigger if exists trg_auditoria_determinacoes on determinacoes;
create trigger trg_auditoria_determinacoes after update on determinacoes
for each row execute function fn_auditoria();

-- =============================================================
-- Pronto. Confira o resultado do backfill antes de seguir:
--
-- select tipo_cliente, count(*) from clientes group by 1;
-- =============================================================
