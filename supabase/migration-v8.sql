-- =============================================================
-- Bessoni & Fortes — Migração v8 (remove "Data da decisão")
--
-- Cole no SQL Editor e clique em "Run". O que importa pro escritório é a
-- data do trânsito em julgado (já existe em processos.data_transito), não
-- a data da decisão em si — então o campo saiu do formulário e da
-- importação, e a coluna correspondente é removida do banco.
-- =============================================================

alter table processos drop column if exists data_decisao;

-- =============================================================
-- Pronto.
-- =============================================================
