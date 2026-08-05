-- =============================================================
-- Bessoni & Fortes — Migração v4 (gestão de usuários e escopos)
--
-- Aditivo, seguro de rodar em cima do banco em uso. Cole no SQL Editor
-- do Supabase e clique em "Run".
-- =============================================================

-- perfis.email — cópia do e-mail do login, só para exibição nas telas
-- de gestão de usuários (a fonte de verdade continua sendo auth.users)
alter table perfis add column if not exists email text;

-- preenche o e-mail dos logins que já existem (ex: seu usuário de escritório)
update perfis p
set email = u.email
from auth.users u
where u.id = p.id and p.email is null;

-- =============================================================
-- Pronto. Confira: select nome, email, role, cliente_id, escopo from perfis;
-- =============================================================
