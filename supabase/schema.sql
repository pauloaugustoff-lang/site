-- =============================================================
-- Bessoni & Fortes — Sistema de Gestão Jurídica Eleitoral (v3)
-- Schema: clientes (hierarquia + tipo), processos, determinações,
-- perfis + perfil_escopos (permissão escalável), auditoria
--
-- Este arquivo é a referência do schema "do zero" (ex: um banco novo).
-- Se você já tem um projeto Supabase rodando com dados reais, NÃO rode
-- este arquivo — rode supabase/migration-v3.sql, que só faz ALTER/CREATE
-- aditivos em cima do que já existe, sem apagar nada.
-- =============================================================

drop policy if exists "documentos_storage_select" on storage.objects;
drop policy if exists "documentos_storage_write" on storage.objects;
drop policy if exists "documentos_storage_delete" on storage.objects;
drop table if exists auditoria cascade;
drop table if exists documentos cascade;
drop table if exists perfil_escopos cascade;
drop table if exists determinacoes cascade;
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
drop function if exists tenho_acesso(uuid, text);
drop function if exists set_orgao_path();
drop function if exists set_cliente_path();
drop function if exists fn_auditoria();

create extension if not exists pgcrypto;

-- -------------------------------------------------------------
-- 1. PARTIDOS
-- -------------------------------------------------------------
create table partidos (
  id uuid primary key default gen_random_uuid(),
  sigla text, -- opcional (pode não vir em importações de planilha)
  nome text not null,
  cnpj text, -- opcional
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------
-- 2. CLIENTES (hierarquia: nacional → estadual → municipal)
-- -------------------------------------------------------------
create table clientes (
  id uuid primary key default gen_random_uuid(),
  -- opcional: nem todo cliente é um órgão partidário
  partido_id uuid references partidos(id),
  nome text not null,
  documento text, -- CPF ou CNPJ, opcional
  tipo_cliente text not null check (
    tipo_cliente in (
      'diretorio_nacional', 'diretorio_estadual', 'diretorio_municipal',
      'candidato', 'pessoa_fisica', 'pessoa_juridica'
    )
  ),
  uf text,
  municipio text,
  parent_id uuid references clientes(id),
  cargo_disputado text,
  ano_eleicao int,
  -- caminho materializado dos ancestrais (ex: "id_nacional.id_estadual.id_municipal")
  -- mantido automaticamente pelo trigger abaixo — usado para consultas
  -- rápidas de "este cliente e tudo abaixo dele" sem precisar de CTE recursiva
  path text,
  created_at timestamptz not null default now()
);

create index idx_clientes_path on clientes using btree (path text_pattern_ops);
create index idx_clientes_parent on clientes (parent_id);
create index idx_clientes_partido on clientes (partido_id);
create index idx_clientes_tipo on clientes (tipo_cliente);

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
  -- cascade: excluir um cliente leva junto seus processos (e, por tabela,
  -- as determinações/documentos de cada um)
  cliente_id uuid not null references clientes(id) on delete cascade,
  categoria text not null check (
    categoria in ('prestacao_contas', 'aije', 'representacao', 'registro_candidatura', 'drap', 'outro')
  ),
  subcategoria text, -- texto livre, ex: "Anual" / "Eleitoral" quando categoria = prestacao_contas
  titulo text,
  -- todo processo tem número, e ele agora também identifica a URL da
  -- tela do processo — precisa ser único, senão duas URLs colidiriam
  numero_processo text not null unique,
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
  data_protocolo date,
  -- fluxo de prestação de contas (relevantes quando categoria = prestacao_contas,
  -- mas ficam disponíveis pra qualquer processo)
  houve_recurso boolean,
  transito_julgado boolean,
  data_transito date,
  -- responsavel_id (advogado responsável) é adicionado via alter table mais
  -- abaixo, depois que a tabela perfis existir — processos é criada antes
  -- de perfis nesta ordem de script
  observacoes text,
  created_at timestamptz not null default now()
);

create index idx_processos_cliente on processos (cliente_id, ano);
create index idx_processos_categoria on processos (categoria);

-- -------------------------------------------------------------
-- 4. DETERMINAÇÕES (o que precisa ser cumprido em razão de um processo —
--    recolhimentos, aplicações mínimas, diligências, documentos etc.)
-- -------------------------------------------------------------
create table determinacoes (
  id uuid primary key default gen_random_uuid(),
  -- cascade: excluir um processo leva junto suas determinações
  processo_id uuid not null references processos(id) on delete cascade,
  tipo text not null check (
    tipo in ('recolhimento_uniao', 'aplicacao_politica_mulher', 'aplicacao_minorias', 'multa', 'outra')
  ),
  descricao text not null,
  valor numeric(14, 2),
  exercicio_cumprimento int,
  prazo date,
  status text not null default 'pendente' check (status in ('pendente', 'cumprida')),
  data_cumprimento date,
  -- responsavel_id (quem cuida do cumprimento desta determinação — pode
  -- ser diferente do advogado responsável pelo processo) é adicionado via
  -- alter table mais abaixo, depois que perfis existir
  data_transito_julgado date,
  observacoes text,
  created_at timestamptz not null default now()
);

create index idx_determinacoes_processo on determinacoes (processo_id);
create index idx_determinacoes_status on determinacoes (status);

-- -------------------------------------------------------------
-- 5. PERFIS (liga cada login a um cliente / papel / escopo primário)
-- -------------------------------------------------------------
create table perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  cliente_id uuid references clientes(id), -- null se for da equipe do escritório
  nome text not null,
  email text, -- cópia do e-mail de auth.users, só para exibição nas telas
  role text not null check (role in ('cliente', 'escritorio')),
  -- escopo primário: o que aquele login vê a partir do cliente_id acima
  escopo text not null default 'total' check (escopo in ('total', 'prestacao_contas')),
  created_at timestamptz not null default now()
);

-- só agora que perfis existe: advogado responsável pelo processo, e quem
-- cuida do cumprimento de cada determinação (papéis independentes)
-- set null: excluir o login do advogado não pode travar nem apagar o
-- processo/determinação, só some a atribuição (fica "não atribuído")
alter table processos add column responsavel_id uuid references perfis(id) on delete set null;
alter table determinacoes add column responsavel_id uuid references perfis(id) on delete set null;
create index idx_processos_responsavel on processos (responsavel_id);
create index idx_determinacoes_responsavel on determinacoes (responsavel_id);

-- -------------------------------------------------------------
-- 6. PERFIL_ESCOPOS (escopos adicionais por login — permite um mesmo
--    login enxergar mais de um cliente/hierarquia, com nível de acesso
--    próprio por escopo. Também usado para restringir um login do
--    escritório a só parte da base, quando necessário.)
-- -------------------------------------------------------------
create table perfil_escopos (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null references perfis(id) on delete cascade,
  -- cascade: excluir um cliente limpa qualquer escopo extra apontando pra ele
  cliente_id uuid not null references clientes(id) on delete cascade,
  nivel_acesso text not null default 'total' check (
    nivel_acesso in ('total', 'prestacao_contas', 'leitura')
  ),
  created_at timestamptz not null default now()
);

create index idx_perfil_escopos_perfil on perfil_escopos (perfil_id);
create index idx_perfil_escopos_cliente on perfil_escopos (cliente_id);

-- -------------------------------------------------------------
-- 7. DOCUMENTOS (metadados dos arquivos anexados a um processo,
--    opcionalmente vinculados a uma determinação específica —
--    o arquivo em si fica no Storage, bucket "documentos")
-- -------------------------------------------------------------
create table documentos (
  id uuid primary key default gen_random_uuid(),
  processo_id uuid not null references processos(id) on delete cascade,
  determinacao_id uuid references determinacoes(id) on delete set null,
  nome_arquivo text not null,
  storage_path text not null, -- caminho dentro do bucket, começa com processo_id/
  tamanho bigint,
  tipo_mime text,
  enviado_por uuid references perfis(id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_documentos_processo on documentos (processo_id);
create index idx_documentos_determinacao on documentos (determinacao_id);

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

-- Verifica se o usuário logado tem acesso a um cliente-alvo (direto ou por
-- estar acima dele na hierarquia), considerando os 3 tipos de escopo:
-- 1) escritório sem nenhum perfil_escopos = irrestrito (vê tudo)
-- 2) escopo primário (perfis.cliente_id + perfis.escopo)
-- 3) escopos adicionais (perfil_escopos), inclusive escritório restrito
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

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================
alter table partidos enable row level security;
alter table clientes enable row level security;
alter table processos enable row level security;
alter table determinacoes enable row level security;
alter table perfis enable row level security;
alter table perfil_escopos enable row level security;
alter table documentos enable row level security;

-- só usuários autenticados têm qualquer acesso (defesa extra, além da RLS)
revoke all on all tables in schema public from anon;
grant usage on schema public to authenticated;
grant select, insert, update, delete on
  partidos, clientes, processos, determinacoes, perfis, perfil_escopos, documentos
  to authenticated;

-- --- partidos: qualquer logado lê; só escritório escreve ---
create policy "partidos_select" on partidos for select
  using (auth.uid() is not null);
create policy "partidos_write" on partidos for all
  using (is_escritorio()) with check (is_escritorio());

-- --- clientes: respeita hierarquia + escopos (via tenho_acesso) ---
create policy "clientes_select" on clientes for select
  using (tenho_acesso(id));
create policy "clientes_write" on clientes for all
  using (is_escritorio()) with check (is_escritorio());

-- --- processos: respeita hierarquia + escopo (com filtro por categoria) ---
create policy "processos_select" on processos for select
  using (tenho_acesso(cliente_id, categoria));
create policy "processos_write" on processos for all
  using (is_escritorio()) with check (is_escritorio());

-- --- determinacoes: herda a visibilidade do processo ---
create policy "determinacoes_select" on determinacoes for select
  using (
    exists (
      select 1 from processos pr
      where pr.id = determinacoes.processo_id
        and tenho_acesso(pr.cliente_id, pr.categoria)
    )
  );
create policy "determinacoes_write" on determinacoes for all
  using (is_escritorio()) with check (is_escritorio());

-- --- perfis: cada um vê o próprio; escritório vê/gerencia todos ---
create policy "perfis_select" on perfis for select
  using (id = auth.uid() or is_escritorio());
-- qualquer logado pode ver perfis de escritório (nome do advogado
-- responsável precisa aparecer no painel do cliente); perfis de outros
-- clientes continuam invisíveis, cobertos só pela política acima
create policy "perfis_select_escritorio_publico" on perfis for select
  using (role = 'escritorio');
create policy "perfis_write" on perfis for all
  using (is_escritorio()) with check (is_escritorio());

-- --- perfil_escopos: cada um vê os próprios escopos extras; só escritório escreve ---
create policy "perfil_escopos_select" on perfil_escopos for select
  using (perfil_id = auth.uid() or is_escritorio());
create policy "perfil_escopos_write" on perfil_escopos for all
  using (is_escritorio()) with check (is_escritorio());

-- --- documentos: mesma visibilidade do processo; só escritório escreve ---
create policy "documentos_select" on documentos for select
  using (
    exists (
      select 1 from processos pr
      where pr.id = documentos.processo_id
        and tenho_acesso(pr.cliente_id, pr.categoria)
    )
  );
create policy "documentos_write" on documentos for all
  using (is_escritorio()) with check (is_escritorio());

-- =============================================================
-- BUCKET DE ARMAZENAMENTO (arquivos anexados aos processos)
-- =============================================================
insert into storage.buckets (id, name, public)
values ('documentos', 'documentos', false)
on conflict (id) do nothing;

-- o caminho do arquivo começa com o id do processo (ex:
-- "3f2a.../2024-peticao.pdf"), então a mesma regra de acesso
-- (tenho_acesso) vale para leitura; só escritório escreve/apaga
create policy "documentos_storage_select" on storage.objects for select
  using (
    bucket_id = 'documentos'
    and exists (
      select 1 from processos pr
      where pr.id::text = (storage.foldername(name))[1]
        and tenho_acesso(pr.cliente_id, pr.categoria)
    )
  );
create policy "documentos_storage_write" on storage.objects for insert
  with check (bucket_id = 'documentos' and is_escritorio());
create policy "documentos_storage_delete" on storage.objects for delete
  using (bucket_id = 'documentos' and is_escritorio());

-- =============================================================
-- 8. AUDITORIA (histórico de alterações — quem, quando, o que mudou)
-- =============================================================
create table auditoria (
  id uuid primary key default gen_random_uuid(),
  tabela text not null,
  registro_id uuid not null,
  perfil_id uuid references perfis(id) on delete set null,
  campo text not null,
  valor_anterior text,
  valor_novo text,
  criado_em timestamptz not null default now()
);

create index idx_auditoria_registro on auditoria (tabela, registro_id);

alter table auditoria enable row level security;
grant select on auditoria to authenticated;

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

create trigger trg_auditoria_clientes after update on clientes
for each row execute function fn_auditoria();
create trigger trg_auditoria_processos after update on processos
for each row execute function fn_auditoria();
create trigger trg_auditoria_determinacoes after update on determinacoes
for each row execute function fn_auditoria();

-- =============================================================
-- PRÓXIMO PASSO OBRIGATÓRIO: recrie o vínculo do seu usuário de
-- escritório (troque o UID pelo do seu usuário, o mesmo de antes):
--
-- insert into perfis (id, nome, role)
-- values ('SEU-UID-AQUI', 'Paulo Fortes', 'escritorio');
-- =============================================================
