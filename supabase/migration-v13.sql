-- v13: CNPJ de campanha do candidato (distinto do CNPJ do partido, que já
-- existe em partidos.cnpj desde a v12).
alter table clientes add column if not exists cnpj_campanha text;
