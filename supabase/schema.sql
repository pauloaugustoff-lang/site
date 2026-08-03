-- =============================================================
-- Bessoni & Fortes — Portal do Cliente (v2)
-- Schema: clientes, processos (genérico), obrigações, perfis com escopo
--
-- Como usar: cole este arquivo inteiro no SQL Editor do Supabase
-- (Project → SQL Editor → New query) e clique em "Run".
--
-- ATENÇÃO: este script começa apagando as tabelas da versão anterior
-- (só havia dados de teste). Depois de rodar, é preciso recriar a linha
-- em `perfis` do seu usuário de escritório (o INSERT que você já rodou
-- antes é apagado pelo cascade).
-- =============================================================

drop table if exists obrigacoes cascade;
drop table if exists julgamentos cascade;
drop table if exists prestacoes_contas cascade;
drop table if exists processos cascade;
drop table if exists perfis cascade;
drop table if exists orgaos_partidarios cascade;
drop table if exists clientes cascade;
drop table if exists partidos cascade;
drop function if exists is_escritorio();
drop function if exists meu_org_path();
drop function if exists meu_cliente_path();
drop function if exists meu_escopo();
drop function if exists set_orgao_path();
drop function if exists set_cliente_path();

create extension if not exists pgcrypto;

-- -------------------------------------------------------------
-- 1. PARTIDOS
-- -------------------------------------------------------------
create table partidos (
  id uuid primary key default gen_random_uuid(),
  sigla text not null,
  nome text not null,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------
-- 2. CLIENTES (hierarquia: nacional → estadual → municipal)
-- -------------------------------------------------------------
create table clientes (
  id uuid primary key default gen_random_uuid(),
  -- opcional: nem todo cliente é um órgão partidário (pode ser candidato,
  -- comitê financeiro, coligação etc.)
  partido_id uuid references partidos(id),
  nome text not null,
  documento text, -- CPF ou CNPJ, opcional
  nivel text check (nivel in ('nacional', 'estadual', 'municipal')),
  uf text,
  municipio text,
  parent_id uuid references clientes(id),
  -- um cliente é OU órgão partidário OU candidato, nunca os dois (reforçado
  -- também na tela via radio button, mas o check abaixo garante no banco)
  eh_candidato boolean not null default false,
  cargo_disputado text,
  ano_eleicao int,
  constraint chk_nao_orgao_e_candidato check (not (nivel is not null and eh_candidato)),
  -- caminho materializado dos ancestrais (ex: "id_nacional.id_estadual.id_municipal")
  -- mantido automaticamente pelo trigger abaixo — usado para consultas
  -- rápidas de "este cliente e tudo abaixo dele" sem precisar de CTE recursiva
  path text,
  created_at timestamptz not null default now()
);

create index idx_clientes_path on clientes using btree (path text_pattern_ops);
create index idx_clientes_parent on clientes (parent_id);
create index idx_clientes_partido on clientes (partido_id);

create or replace function set_cliente_path() returns trigger as $$
declare
  parent_path text;
begin
  if new.parent_id is null then
    new.path := new.id::text;
  else
    select path into parent_path from clientes where id = new.parent_id;
    if parent_path is null then
      raise exception 'parent_id % não encontrado em clientes', new.parent_id;
    end if;
    new.path := parent_path || '.' || new.id::text;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_set_cliente_path
before insert or update of parent_id on clientes
for each row execute function set_cliente_path();

-- Nota: se um cliente já existente for "reparentado" (mudar de parent_id)
-- depois de já ter filhos cadastrados, os paths dos filhos NÃO são
-- recalculados automaticamente por este trigger simples. Isso é raro na
-- prática (hierarquia partidária muda pouco); se acontecer, avise que a
-- gente roda um ajuste manual.

-- -------------------------------------------------------------
-- 3. PROCESSOS (genérico: prestação de contas, AIJE, representação,
--    registro de candidatura, DRAP etc. — um por processo/caso)
-- -------------------------------------------------------------
create table processos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id),
  categoria text not null check (
    categoria in ('prestacao_contas', 'aije', 'representacao', 'registro_candidatura', 'drap', 'outro')
  ),
  subcategoria text, -- texto livre, ex: "Anual" / "Eleitoral" quando categoria = prestacao_contas
  titulo text,
  numero_processo text,
  ano int,
  orgao_julgador text, -- ex: "TSE" ou "TRE-BA"
  foro text,
  status text not null default 'em_andamento' check (
    status in ('em_andamento', 'concluido', 'aguardando_diligencia')
  ),
  -- texto livre de propósito: o vocabulário de resultado muda por categoria
  -- (aprovadas/desaprovadas para contas, deferido/indeferido para
  -- candidatura, procedente/improcedente para AIJE...). A tela de cadastro
  -- sugere as opções certas conforme a categoria escolhida.
  resultado text,
  data_decisao date,
  data_protocolo date,
  observacoes text,
  created_at timestamptz not null default now()
);

create index idx_processos_cliente on processos (cliente_id, ano);
create index idx_processos_categoria on processos (categoria);

-- -------------------------------------------------------------
-- 4. OBRIGAÇÕES (o que precisa ser cumprido em razão de um processo)
-- -------------------------------------------------------------
create table obrigacoes (
  id uuid primary key default gen_random_uuid(),
  processo_id uuid not null references processos(id),
  tipo text not null check (
    tipo in ('recolhimento_uniao', 'aplicacao_politica_mulher', 'aplicacao_minorias', 'multa', 'outra')
  ),
  descricao text not null,
  valor numeric(14, 2),
  exercicio_cumprimento int,
  prazo date,
  status text not null default 'pendente' check (status in ('pendente', 'cumprida')),
  data_cumprimento date,
  observacoes text,
  created_at timestamptz not null default now()
);

create index idx_obrigacoes_processo on obrigacoes (processo_id);
create index idx_obrigacoes_status on obrigacoes (status);

-- -------------------------------------------------------------
-- 5. PERFIS (liga cada login a um cliente / papel / escopo de acesso)
-- -------------------------------------------------------------
create table perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  cliente_id uuid references clientes(id), -- null se for da equipe do escritório
  nome text not null,
  role text not null check (role in ('cliente', 'escritorio')),
  -- um mesmo cliente pode ter vários logins (várias linhas de perfis com
  -- o mesmo cliente_id); cada um pode ver todos os processos do cliente
  -- ou só os de prestação de contas
  escopo text not null default 'total' check (escopo in ('total', 'prestacao_contas')),
  created_at timestamptz not null default now()
);

-- =============================================================
-- FUNÇÕES AUXILIARES DE ACESSO (security definer: leem sem
-- ficar presas na própria RLS que vão ajudar a aplicar)
-- =============================================================
create or replace function is_escritorio() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from perfis where id = auth.uid() and role = 'escritorio'
  );
$$;

create or replace function meu_cliente_path() returns text
language sql stable security definer set search_path = public as $$
  select c.path
  from perfis p
  join clientes c on c.id = p.cliente_id
  where p.id = auth.uid();
$$;

create or replace function meu_escopo() returns text
language sql stable security definer set search_path = public as $$
  select escopo from perfis where id = auth.uid();
$$;

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================
alter table partidos enable row level security;
alter table clientes enable row level security;
alter table processos enable row level security;
alter table obrigacoes enable row level security;
alter table perfis enable row level security;

-- só usuários autenticados têm qualquer acesso (defesa extra, além da RLS)
revoke all on all tables in schema public from anon;
grant usage on schema public to authenticated;
grant select, insert, update, delete on
  partidos, clientes, processos, obrigacoes, perfis
  to authenticated;

-- --- partidos: qualquer logado lê; só escritório escreve ---
create policy "partidos_select" on partidos for select
  using (auth.uid() is not null);
create policy "partidos_write" on partidos for all
  using (is_escritorio()) with check (is_escritorio());

-- --- clientes: cliente vê a si + abaixo; escritório vê tudo ---
create policy "clientes_select" on clientes for select
  using (is_escritorio() or path like (meu_cliente_path() || '%'));
create policy "clientes_write" on clientes for all
  using (is_escritorio()) with check (is_escritorio());

-- --- processos: respeita hierarquia E escopo de acesso do login ---
create policy "processos_select" on processos for select
  using (
    is_escritorio() or (
      exists (
        select 1 from clientes c
        where c.id = processos.cliente_id
          and c.path like (meu_cliente_path() || '%')
      )
      and (meu_escopo() = 'total' or processos.categoria = 'prestacao_contas')
    )
  );
create policy "processos_write" on processos for all
  using (is_escritorio()) with check (is_escritorio());

-- --- obrigacoes: herda a visibilidade do processo ---
create policy "obrigacoes_select" on obrigacoes for select
  using (
    is_escritorio() or exists (
      select 1 from processos pr
      join clientes c on c.id = pr.cliente_id
      where pr.id = obrigacoes.processo_id
        and c.path like (meu_cliente_path() || '%')
        and (meu_escopo() = 'total' or pr.categoria = 'prestacao_contas')
    )
  );
create policy "obrigacoes_write" on obrigacoes for all
  using (is_escritorio()) with check (is_escritorio());

-- --- perfis: cada um vê o próprio; escritório vê/gerencia todos ---
create policy "perfis_select" on perfis for select
  using (id = auth.uid() or is_escritorio());
create policy "perfis_write" on perfis for all
  using (is_escritorio()) with check (is_escritorio());

-- =============================================================
-- PRÓXIMO PASSO OBRIGATÓRIO: recrie o vínculo do seu usuário de
-- escritório (troque o UID pelo do seu usuário, o mesmo de antes):
--
-- insert into perfis (id, nome, role)
-- values ('SEU-UID-AQUI', 'Paulo Fortes', 'escritorio');
-- =============================================================

-- =============================================================
-- EXEMPLO DE USO (opcional — descomente e rode se quiser semear
-- dados de teste com o próprio exemplo que motivou o sistema)
-- =============================================================
-- insert into partidos (id, sigla, nome) values
--   ('00000000-0000-0000-0000-000000000001', 'XX', 'Partido Exemplo');
--
-- insert into clientes (id, partido_id, nome, nivel) values
--   ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'Diretório Nacional', 'nacional');
--
-- insert into clientes (id, partido_id, nome, nivel, uf, parent_id) values
--   ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Diretório Estadual da Bahia', 'estadual', 'BA', '00000000-0000-0000-0000-000000000010');
--
-- insert into processos (id, cliente_id, categoria, subcategoria, ano, status, resultado, data_decisao, orgao_julgador) values
--   ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000010', 'prestacao_contas', 'anual', 2020, 'concluido', 'nao_prestadas', '2021-06-15', 'TSE');
--
-- insert into obrigacoes (processo_id, tipo, descricao, valor, exercicio_cumprimento, status) values
--   ('00000000-0000-0000-0000-000000000020', 'aplicacao_politica_mulher', 'Aplicar em políticas de fomento à participação feminina', 2000000.00, 2021, 'pendente'),
--   ('00000000-0000-0000-0000-000000000020', 'recolhimento_uniao', 'Recolher à conta única do Tesouro Nacional', 10000.00, 2021, 'pendente');
