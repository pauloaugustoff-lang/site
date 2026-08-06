-- =============================================================
-- Bessoni & Fortes — Migração v10 (corrige nomes de constraint da v9)
--
-- Cole no SQL Editor e clique em "Run".
--
-- A migração v9 tentou trocar 3 ligações para "on delete cascade", mas
-- presumiu o nome padrão de constraint do Postgres para cada uma. A
-- tabela "determinacoes" nasceu com o nome "obrigacoes" e foi renomeada
-- depois (ALTER TABLE ... RENAME TO não renomeia as constraints junto)
-- — então a constraint de chave estrangeira dela continuava se chamando
-- "obrigacoes_processo_id_fkey", não "determinacoes_processo_id_fkey".
-- Resultado: o "drop constraint if exists" da v9 não achou nada (nome
-- errado) e só criou uma constraint nova com cascade ao lado da antiga
-- — as duas juntas continuaram bloqueando a exclusão, daí o erro
-- "violates foreign key constraint obrigacoes_processo_id_fkey".
--
-- Esta migração acha a(s) constraint(s) de FK que já existir em cada
-- uma das 3 colunas pelo nome real (não pelo nome esperado), remove
-- todas elas e recria uma só, com "on delete cascade" — resolve esse
-- caso e qualquer outro nome inesperado, em qualquer uma das 3 tabelas.
-- =============================================================

do $$
declare conname text;
begin
  for conname in
    select con.conname
    from pg_constraint con
    join pg_attribute att on att.attrelid = con.conrelid and att.attnum = any(con.conkey)
    where con.conrelid = 'determinacoes'::regclass
      and con.contype = 'f'
      and att.attname = 'processo_id'
  loop
    execute format('alter table determinacoes drop constraint %I', conname);
  end loop;
end $$;

alter table determinacoes add constraint determinacoes_processo_id_fkey
  foreign key (processo_id) references processos(id) on delete cascade;

do $$
declare conname text;
begin
  for conname in
    select con.conname
    from pg_constraint con
    join pg_attribute att on att.attrelid = con.conrelid and att.attnum = any(con.conkey)
    where con.conrelid = 'processos'::regclass
      and con.contype = 'f'
      and att.attname = 'cliente_id'
  loop
    execute format('alter table processos drop constraint %I', conname);
  end loop;
end $$;

alter table processos add constraint processos_cliente_id_fkey
  foreign key (cliente_id) references clientes(id) on delete cascade;

do $$
declare conname text;
begin
  for conname in
    select con.conname
    from pg_constraint con
    join pg_attribute att on att.attrelid = con.conrelid and att.attnum = any(con.conkey)
    where con.conrelid = 'perfil_escopos'::regclass
      and con.contype = 'f'
      and att.attname = 'cliente_id'
  loop
    execute format('alter table perfil_escopos drop constraint %I', conname);
  end loop;
end $$;

alter table perfil_escopos add constraint perfil_escopos_cliente_id_fkey
  foreign key (cliente_id) references clientes(id) on delete cascade;

-- =============================================================
-- Pronto. Pra conferir que ficou só uma constraint em cada:
--
--   select conrelid::regclass, conname
--   from pg_constraint
--   where conrelid in ('determinacoes'::regclass, 'processos'::regclass, 'perfil_escopos'::regclass)
--     and contype = 'f';
-- =============================================================
