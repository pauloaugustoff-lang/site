-- =============================================================
-- Bessoni & Fortes — Migração v12 (CNPJ do partido)
--
-- Cole no SQL Editor e clique em "Run".
--
-- Adiciona a coluna opcional "cnpj" em partidos, pra guardar o CNPJ do
-- diretório nacional do partido (quando o escritório tiver essa
-- informação).
-- =============================================================

alter table partidos add column if not exists cnpj text;

-- =============================================================
-- Pronto.
-- =============================================================
