-- =============================================================
-- Bessoni & Fortes — Migração v9 (excluir processos e clientes)
--
-- Cole no SQL Editor e clique em "Run".
--
-- Hoje as ligações determinacoes -> processos, processos -> clientes e
-- perfil_escopos -> clientes não têm nenhuma ação de exclusão configurada
-- (o Postgres bloqueia por padrão — "restrict"), então excluir um processo
-- com determinações, ou um cliente com processos, falhava com um erro
-- genérico do banco. Esta migração troca essas 3 ligações para
-- "on delete cascade": excluir um processo já leva junto suas
-- determinações e documentos; excluir um cliente já leva junto seus
-- processos (e, por tabela, as determinações/documentos de cada um) e
-- qualquer escopo extra de acesso vinculado a ele.
--
-- Propositalmente NÃO mexemos em clientes.parent_id nem em
-- perfis.cliente_id — excluir um cliente que ainda tem diretórios abaixo
-- dele na hierarquia, ou que ainda tem login de acesso ativo, continua
-- bloqueado. O sistema mostra uma mensagem explicando o que resolver
-- antes de excluir.
-- =============================================================

alter table determinacoes drop constraint if exists determinacoes_processo_id_fkey;
alter table determinacoes add constraint determinacoes_processo_id_fkey
  foreign key (processo_id) references processos(id) on delete cascade;

alter table processos drop constraint if exists processos_cliente_id_fkey;
alter table processos add constraint processos_cliente_id_fkey
  foreign key (cliente_id) references clientes(id) on delete cascade;

alter table perfil_escopos drop constraint if exists perfil_escopos_cliente_id_fkey;
alter table perfil_escopos add constraint perfil_escopos_cliente_id_fkey
  foreign key (cliente_id) references clientes(id) on delete cascade;

-- =============================================================
-- Se algum "drop constraint" acima não encontrar o nome esperado (ex: o
-- banco tinha um nome de constraint diferente do padrão do Postgres),
-- rode antes para descobrir o nome real:
--
--   select conname, conrelid::regclass
--   from pg_constraint
--   where conrelid in ('determinacoes'::regclass, 'processos'::regclass, 'perfil_escopos'::regclass)
--     and contype = 'f';
--
-- Pronto.
-- =============================================================
