-- =============================================================
-- Bessoni & Fortes — Migração v5 (documentos anexados a processos)
--
-- Aditivo, seguro de rodar em cima do banco em uso. Cole no SQL Editor
-- do Supabase e clique em "Run". Cria também o bucket de armazenamento
-- de arquivos (não precisa mexer em nada pelo painel do Supabase).
-- =============================================================

-- -------------------------------------------------------------
-- 1. Bucket de armazenamento (privado — só acessível via RLS abaixo)
-- -------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('documentos', 'documentos', false)
on conflict (id) do nothing;

-- -------------------------------------------------------------
-- 2. Tabela de metadados dos documentos
-- -------------------------------------------------------------
create table if not exists documentos (
  id uuid primary key default gen_random_uuid(),
  processo_id uuid not null references processos(id) on delete cascade,
  determinacao_id uuid references determinacoes(id) on delete set null,
  nome_arquivo text not null,
  storage_path text not null,
  tamanho bigint,
  tipo_mime text,
  enviado_por uuid references perfis(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_documentos_processo on documentos (processo_id);
create index if not exists idx_documentos_determinacao on documentos (determinacao_id);

alter table documentos enable row level security;
grant select, insert, delete on documentos to authenticated;

drop policy if exists "documentos_select" on documentos;
create policy "documentos_select" on documentos for select
  using (
    exists (
      select 1 from processos pr
      where pr.id = documentos.processo_id
        and tenho_acesso(pr.cliente_id, pr.categoria)
    )
  );

drop policy if exists "documentos_write" on documentos;
create policy "documentos_write" on documentos for all
  using (is_escritorio()) with check (is_escritorio());

-- -------------------------------------------------------------
-- 3. RLS do Storage — o caminho do arquivo começa com o id do
--    processo (ex: "3f2a.../2024-peticao.pdf"), então a mesma regra
--    de acesso (tenho_acesso) vale para leitura; só escritório escreve
-- -------------------------------------------------------------
drop policy if exists "documentos_storage_select" on storage.objects;
create policy "documentos_storage_select" on storage.objects for select
  using (
    bucket_id = 'documentos'
    and exists (
      select 1 from processos pr
      where pr.id::text = (storage.foldername(name))[1]
        and tenho_acesso(pr.cliente_id, pr.categoria)
    )
  );

drop policy if exists "documentos_storage_write" on storage.objects;
create policy "documentos_storage_write" on storage.objects for insert
  with check (bucket_id = 'documentos' and is_escritorio());

drop policy if exists "documentos_storage_delete" on storage.objects;
create policy "documentos_storage_delete" on storage.objects for delete
  using (bucket_id = 'documentos' and is_escritorio());

-- =============================================================
-- Pronto. Nada mais precisa ser feito no painel do Supabase — o
-- bucket "documentos" já existe e está protegido pelas regras acima.
-- =============================================================
