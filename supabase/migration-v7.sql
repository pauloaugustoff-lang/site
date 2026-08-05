-- =============================================================
-- Bessoni & Fortes — Migração v7 (nº do processo obrigatório e único)
--
-- Cole no SQL Editor e clique em "Run". Se algum processo estiver sem
-- número ou com número repetido, o script AVISA exatamente qual é o
-- problema em vez de travar com um erro genérico — corrija e rode de
-- novo.
-- =============================================================

do $$
declare
  faltando int;
begin
  select count(*) into faltando from processos where numero_processo is null;
  if faltando > 0 then
    raise exception 'Existem % processo(s) sem número cadastrado. Rode "select id, titulo, categoria from processos where numero_processo is null;" pra ver quais são, preencha o número de cada um pela tela e rode esta migração de novo.', faltando;
  end if;
end $$;

do $$
declare
  duplicados int;
begin
  select count(*) into duplicados from (
    select numero_processo from processos group by numero_processo having count(*) > 1
  ) x;
  if duplicados > 0 then
    raise exception 'Existem números de processo repetidos em mais de um processo. Rode "select numero_processo, count(*) from processos group by numero_processo having count(*) > 1;" pra ver quais são, corrija e rode esta migração de novo.';
  end if;
end $$;

alter table processos alter column numero_processo set not null;
alter table processos drop constraint if exists processos_numero_processo_unique;
alter table processos add constraint processos_numero_processo_unique unique (numero_processo);

-- =============================================================
-- Pronto. A partir de agora o cadastro/edição de processo exige o
-- número, e a URL da tela do processo sempre usa o número (nunca
-- mais cai no id interno).
-- =============================================================
