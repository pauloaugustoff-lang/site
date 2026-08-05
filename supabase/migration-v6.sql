-- =============================================================
-- Bessoni & Fortes — Migração v6 (advogado responsável como usuário)
--
-- Aditivo, seguro de rodar em cima do banco em uso. Cole no SQL Editor
-- do Supabase e clique em "Run".
--
-- O que muda: "responsável" deixa de ser texto livre em processos e em
-- determinações — passa a ser uma referência a um usuário do escritório
-- (tabela perfis). São dois papéis DIFERENTES e independentes:
--   - processos.responsavel_id      → advogado responsável pelo processo
--   - determinacoes.responsavel_id  → quem cuida do cumprimento daquela
--                                      determinação específica (pode ser
--                                      outra pessoa da equipe)
-- O backfill tenta casar o texto já cadastrado com o nome de um usuário
-- do escritório; o que não casar fica em branco (dá para corrigir depois
-- pela tela, que agora é uma lista suspensa).
-- =============================================================

-- -------------------------------------------------------------
-- 1. processos.responsavel_id
-- -------------------------------------------------------------
alter table processos add column if not exists responsavel_id uuid references perfis(id);

update processos p
set responsavel_id = pf.id
from perfis pf
where pf.role = 'escritorio'
  and lower(pf.nome) = lower(p.responsavel)
  and p.responsavel_id is null
  and p.responsavel is not null;

alter table processos drop column if exists responsavel;
create index if not exists idx_processos_responsavel on processos (responsavel_id);

-- -------------------------------------------------------------
-- 2. determinacoes.responsavel_id
-- -------------------------------------------------------------
alter table determinacoes add column if not exists responsavel_id uuid references perfis(id);

update determinacoes d
set responsavel_id = pf.id
from perfis pf
where pf.role = 'escritorio'
  and lower(pf.nome) = lower(d.responsavel)
  and d.responsavel_id is null
  and d.responsavel is not null;

alter table determinacoes drop column if exists responsavel;
create index if not exists idx_determinacoes_responsavel on determinacoes (responsavel_id);

-- -------------------------------------------------------------
-- 3. Permissão: cliente precisa conseguir ver o NOME do advogado
--    responsável no painel dele (hoje só via SQL/escritório dava pra
--    ler perfis). Sem isso, o join processos->perfis fica em branco
--    pra quem loga como cliente. Escopo limitado: só perfis de
--    escritório ficam visíveis a qualquer logado, perfis de outros
--    clientes continuam invisíveis.
-- -------------------------------------------------------------
drop policy if exists "perfis_select_escritorio_publico" on perfis;
create policy "perfis_select_escritorio_publico" on perfis for select
  using (role = 'escritorio');

-- =============================================================
-- Pronto. Confira quem ficou sem responsável casado automaticamente:
--
-- select id, titulo, categoria from processos where responsavel_id is null;
-- select id, descricao from determinacoes where responsavel_id is null;
--
-- Se aparecer algo, é só abrir o processo/determinação na tela e
-- selecionar o responsável certo no dropdown novo.
-- =============================================================
