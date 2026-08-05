(function () {
  "use strict";

  var LABELS = {
    tabela: { clientes: "Clientes", processos: "Processos", determinacoes: "Determinações" },
    campo: {
      nome: "Nome", tipo_cliente: "Tipo de cliente", uf: "UF", municipio: "Município",
      partido_id: "Partido", parent_id: "Cliente superior", documento: "CPF/CNPJ",
      categoria: "Categoria", subcategoria: "Subcategoria", titulo: "Título",
      status: "Status", resultado: "Resultado", ano: "Ano", numero_processo: "Nº do processo",
      orgao_julgador: "Órgão julgador", foro: "Foro",
      data_protocolo: "Data de protocolo", responsavel: "Responsável", responsavel_id: "Responsável",
      houve_recurso: "Houve recurso", transito_julgado: "Trânsito em julgado",
      data_transito: "Data do trânsito", observacoes: "Observações",
      tipo: "Tipo", descricao: "Descrição", valor: "Valor", exercicio_cumprimento: "Exercício de cumprimento",
      prazo: "Prazo", data_cumprimento: "Data do cumprimento", data_transito_julgado: "Data do trânsito em julgado",
    },
  };

  function fmtDataHora(v) {
    if (!v) return "—";
    return new Date(v).toLocaleString("pt-BR");
  }
  function campoLabel(c) {
    return LABELS.campo[c] || c;
  }

  var CAMPOS_COM_ID = { responsavel_id: null, parent_id: null, partido_id: null };
  var mapasResolucao = { responsavel_id: new Map(), parent_id: new Map(), partido_id: new Map() };

  function valorLabel(v, campo) {
    if (v === null || v === undefined || v === "") return "—";
    if (campo in CAMPOS_COM_ID) {
      var mapa = mapasResolucao[campo];
      return (mapa && mapa.get(v)) || v;
    }
    return v;
  }

  async function carregarMapasResolucao() {
    var [perfisResp, clientesResp, partidosResp] = await Promise.all([
      bfSupabase.from("perfis").select("id, nome"),
      bfSupabase.from("clientes").select("id, nome"),
      bfSupabase.from("partidos").select("id, nome"),
    ]);
    (perfisResp.data || []).forEach(function (p) { mapasResolucao.responsavel_id.set(p.id, p.nome); });
    (clientesResp.data || []).forEach(function (c) { mapasResolucao.parent_id.set(c.id, c.nome); });
    (partidosResp.data || []).forEach(function (p) { mapasResolucao.partido_id.set(p.id, p.nome); });
  }

  var linhasCache = [];

  function popularFiltroUsuario() {
    var nomes = Array.from(new Set(linhasCache.map(function (l) { return l.usuarioNome; }).filter(Boolean)))
      .sort();
    document.getElementById("filtro-usuario").innerHTML =
      '<option value="">Todos</option>' + nomes.map(function (n) { return '<option value="' + n + '">' + n + "</option>"; }).join("");
  }

  function renderTabela(lista) {
    var tbody = document.querySelector('[data-list="auditoria"]');
    if (!lista.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Nenhuma alteração encontrada para esse filtro.</td></tr>';
      return;
    }
    tbody.innerHTML = lista.map(function (l) {
      return "<tr>" +
        "<td>" + fmtDataHora(l.criado_em) + "</td>" +
        "<td>" + (l.usuarioNome || "—") + "</td>" +
        "<td>" + (LABELS.tabela[l.tabela] || l.tabela) + "</td>" +
        "<td>" + campoLabel(l.campo) + "</td>" +
        "<td>" + valorLabel(l.valor_anterior, l.campo) + "</td>" +
        "<td>" + valorLabel(l.valor_novo, l.campo) + "</td>" +
      "</tr>";
    }).join("");
  }

  function aplicarFiltros() {
    var tabela = document.getElementById("filtro-tabela").value;
    var usuario = document.getElementById("filtro-usuario").value;
    var busca = document.getElementById("busca-campo").value.trim().toLowerCase();

    var filtradas = linhasCache.filter(function (l) {
      if (tabela && l.tabela !== tabela) return false;
      if (usuario && l.usuarioNome !== usuario) return false;
      if (busca && campoLabel(l.campo).toLowerCase().indexOf(busca) === -1) return false;
      return true;
    });
    renderTabela(filtradas);
  }

  async function carregarAuditoria() {
    var { data, error } = await bfSupabase
      .from("auditoria")
      .select("*, perfis(nome)")
      .order("criado_em", { ascending: false })
      .limit(200);

    if (error) {
      console.error(error);
      document.querySelector('[data-list="auditoria"]').innerHTML =
        '<tr class="empty-row"><td colspan="6">Não foi possível carregar a auditoria agora.</td></tr>';
      return;
    }

    linhasCache = (data || []).map(function (l) {
      return {
        criado_em: l.criado_em,
        usuarioNome: l.perfis ? l.perfis.nome : null,
        tabela: l.tabela,
        campo: l.campo,
        valor_anterior: l.valor_anterior,
        valor_novo: l.valor_novo,
      };
    });
    popularFiltroUsuario();
    aplicarFiltros();
  }

  async function init() {
    var session = await bfRequireSession("../login.html");
    if (!session) return;

    var perfil = await bfGetPerfil(session.user.id);
    if (!perfil || perfil.role !== "escritorio") {
      window.location.href = "painel.html";
      return;
    }

    document.querySelector("[data-user-nome]").textContent = perfil.nome;
    document.querySelector("[data-logout]").addEventListener("click", function () {
      bfLogout("../login.html");
    });

    ["filtro-tabela", "filtro-usuario", "busca-campo"].forEach(function (id) {
      document.getElementById(id).addEventListener(id === "busca-campo" ? "input" : "change", aplicarFiltros);
    });

    await carregarMapasResolucao();
    await carregarAuditoria();
  }

  init();
})();
