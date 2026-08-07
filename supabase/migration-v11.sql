-- =============================================================
-- Bessoni & Fortes — Migração v11 (excluir usuário não pode travar)
--
-- Cole no SQL Editor e clique em "Run".
--
-- processos.responsavel_id, determinacoes.responsavel_id,
-- documentos.enviado_por e auditoria.perfil_id referenciam perfis(id) sem
-- nenhuma ação de exclusão configurada (bloqueiam por padrão — "restrict").
-- Isso fazia a exclusão de um usuário (Edge Function excluir-usuario)
-- falhar com "Database error deleting user" sempre que esse usuário
-- estivesse atribuído como responsável em algum processo/determinação,
-- tivesse enviado algum documento, ou aparecesse no histórico de
-- auditoria — ou seja, praticamente qualquer usuário que já tivesse usado
-- o sistema.
--
-- Esta migração troca essas 4 ligações para "on delete set null": excluir
-- o login do advogado não apaga nem trava o processo/determinação/
-- documento/registro de auditoria, só desfaz a atribuição (fica "não
-- atribuído" / sem responsável).
-- =============================================================

do $$
declare conname text;
begin
  for conname in
    select con.conname
    from pg_constraint con
    join pg_attribute att on att.attrelid = con.conrelid and att.attnum = any(con.conkey)
    where con.conrelid = 'processos'::regclass
      and con.contype = 'f'
      and att.attname = 'responsavel_id'
  loop
    execute format('alter table processos drop constraint %I', conname);
  end loop;
end $$;

alter table processos add constraint processos_responsavel_id_fkey
  foreign key (responsavel_id) references perfis(id) on delete set null;

do $$
declare conname text;
begin
  for conname in
    select con.conname
    from pg_constraint con
    join pg_attribute att on att.attrelid = con.conrelid and att.attnum = any(con.conkey)
    where con.conrelid = 'determinacoes'::regclass
      and con.contype = 'f'
      and att.attname = 'responsavel_id'
  loop
    execute format('alter table determinacoes drop constraint %I', conname);
  end loop;
end $$;

alter table determinacoes add constraint determinacoes_responsavel_id_fkey
  foreign key (responsavel_id) references perfis(id) on delete set null;

do $$
declare conname text;
begin
  for conname in
    select con.conname
    from pg_constraint con
    join pg_attribute att on att.attrelid = con.conrelid and att.attnum = any(con.conkey)
    where con.conrelid = 'documentos'::regclass
      and con.contype = 'f'
      and att.attname = 'enviado_por'
  loop
    execute format('alter table documentos drop constraint %I', conname);
  end loop;
end $$;

alter table documentos add constraint documentos_enviado_por_fkey
  foreign key (enviado_por) references perfis(id) on delete set null;

do $$
declare conname text;
begin
  for conname in
    select con.conname
    from pg_constraint con
    join pg_attribute att on att.attrelid = con.conrelid and att.attnum = any(con.conkey)
    where con.conrelid = 'auditoria'::regclass
      and con.contype = 'f'
      and att.attname = 'perfil_id'
  loop
    execute format('alter table auditoria drop constraint %I', conname);
  end loop;
end $$;

alter table auditoria add constraint auditoria_perfil_id_fkey
  foreign key (perfil_id) references perfis(id) on delete set null;

-- =============================================================
-- Depois de rodar, lembre de recarregar o cache do PostgREST:
--   NOTIFY pgrst, 'reload schema';
--
-- Pronto.
-- =============================================================
