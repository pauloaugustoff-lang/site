(function () {
  "use strict";

  var LABELS = {
    categoria: {
      prestacao_contas: "Prestação de contas",
      aije: "AIJE",
      representacao: "Representação",
      registro_candidatura: "Registro de candidatura",
      drap: "DRAP",
      outro: "Outro",
    },
    status: { em_andamento: "Em andamento", aguardando_diligencia: "Aguardando diligência", concluido: "Concluído" },
    resultadoContas: {
      aprovadas: "Aprovadas",
      aprovadas_com_ressalvas: "Aprovadas com ressalvas",
      desaprovadas: "Desaprovadas",
      nao_prestadas: "Não prestadas",
    },
    tipoObrigacao: {
      recolhimento_uniao: "Recolhimento à União",
      aplicacao_politica_mulher: "Aplicação em política da mulher",
      aplicacao_minorias: "Aplicação em ações afirmativas / minorias",
      multa: "Multa",
      outra: "Outra",
    },
    statusObrigacao: { pendente: "Pendente", cumprida: "Cumprida" },
  };

  function fmtMoeda(v) {
    if (v === null || v === undefined) return "—";
    return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  function fmtData(v) {
    if (!v) return "—";
    return new Date(v + "T00:00:00").toLocaleDateString("pt-BR");
  }
  function resultadoLabel(categoria, resultado) {
    if (!resultado) return "—";
    if (categoria === "prestacao_contas") return LABELS.resultadoContas[resultado] || resultado;
    return resultado;
  }
  function isVencida(row) {
    return row.status === "pendente" && row.prazo && new Date(row.prazo + "T00:00:00") < new Date();
  }
  function statusKey(row) {
    if (isVencida(row)) return "vencida";
    return row.status;
  }
  function statusBadge(row) {
    var key = statusKey(row);
    var label = key === "vencida" ? "Vencida" : LABELS.statusObrigacao[row.status] || row.status;
    return '<span class="status-badge ' + key + '">' + label + "</span>";
  }

  var linhasObrigacoes = [];

  function achatarObrigacoes(obrigacoes) {
    return obrigacoes.map(function (o) {
      var pr = o.processos || {};
      var cliente = pr.clientes || {};
      return {
        id: o.id,
        clienteNome: cliente.nome || "—",
        categoria: pr.categoria || null,
        ano: pr.ano || null,
        tipo: o.tipo,
        descricao: o.descricao,
        valor: o.valor,
        prazo: o.prazo,
        status: o.status,
      };
    });
  }

  function popularFiltros() {
    var clientesNomes = Array.from(new Set(linhasObrigacoes.map(function (l) { return l.clienteNome; }))).sort();
    var exercicios = Array.from(new Set(linhasObrigacoes.map(function (l) { return l.ano; }).filter(Boolean))).sort(function (a, b) { return b - a; });

    document.getElementById("filtro-cliente").innerHTML =
      '<option value="">Todos</option>' + clientesNomes.map(function (c) { return '<option value="' + c + '">' + c + "</option>"; }).join("");
    document.getElementById("filtro-exercicio").innerHTML =
      '<option value="">Todos</option>' + exercicios.map(function (e) { return '<option value="' + e + '">' + e + "</option>"; }).join("");
  }

  function renderStats(lista) {
    var pendentes = lista.filter(function (l) { return l.status === "pendente" && !isVencida(l); }).length;
    var vencidas = lista.filter(isVencida).length;
    var cumpridas = lista.filter(function (l) { return l.status === "cumprida"; }).length;
    document.querySelector('[data-stat="total"]').textContent = lista.length;
    document.querySelector('[data-stat="pendentes"]').textContent = pendentes;
    document.querySelector('[data-stat="vencidas"]').textContent = vencidas;
    document.querySelector('[data-stat="cumpridas"]').textContent = cumpridas;
  }

  function renderObrigacoesTabela(lista) {
    var tbody = document.querySelector('[data-list="obrigacoes"]');
    if (!lista.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Nenhuma obrigação encontrada para esse filtro.</td></tr>';
      return;
    }
    tbody.innerHTML = lista.map(function (l) {
      return "<tr>" +
        "<td>" + l.clienteNome + "</td>" +
        "<td>" + (LABELS.categoria[l.categoria] || "—") + "</td>" +
        "<td>" + (LABELS.tipoObrigacao[l.tipo] || l.tipo) + " — " + l.descricao + "</td>" +
        "<td>" + fmtMoeda(l.valor) + "</td>" +
        "<td>" + fmtData(l.prazo) + "</td>" +
        "<td>" + statusBadge(l) + "</td>" +
      "</tr>";
    }).join("");
  }

  function aplicarFiltros() {
    var cliente = document.getElementById("filtro-cliente").value;
    var exercicio = document.getElementById("filtro-exercicio").value;
    var status = document.getElementById("filtro-status").value;

    var filtradas = linhasObrigacoes.filter(function (l) {
      if (cliente && l.clienteNome !== cliente) return false;
      if (exercicio && String(l.ano) !== exercicio) return false;
      if (status && statusKey(l) !== status) return false;
      return true;
    });

    renderStats(filtradas);
    renderObrigacoesTabela(filtradas);
  }

  async function carregarProcessos() {
    var { data, error } = await bfSupabase
      .from("processos")
      .select("*, clientes(nome)")
      .order("created_at", { ascending: false })
      .limit(15);

    var tbody = document.querySelector('[data-list="processos"]');
    if (error) {
      console.error(error);
      tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Não foi possível carregar os processos agora.</td></tr>';
      return;
    }

    var processos = data || [];
    tbody.innerHTML = processos.length
      ? processos.map(function (p) {
          return "<tr>" +
            "<td>" + (p.clientes ? p.clientes.nome : "—") + "</td>" +
            "<td>" + (LABELS.categoria[p.categoria] || p.categoria) + "</td>" +
            "<td>" + (p.ano || "—") + "</td>" +
            "<td>" + (LABELS.status[p.status] || p.status) + "</td>" +
            "<td>" + resultadoLabel(p.categoria, p.resultado) + "</td>" +
          "</tr>";
        }).join("")
      : '<tr class="empty-row"><td colspan="5">Nenhum processo cadastrado ainda.</td></tr>';
  }

  async function carregarObrigacoes() {
    var { data, error } = await bfSupabase
      .from("obrigacoes")
      .select("*, processos(categoria, ano, clientes(nome))")
      .order("prazo", { ascending: true, nullsFirst: false });

    if (error) {
      console.error(error);
      document.querySelector('[data-list="obrigacoes"]').innerHTML =
        '<tr class="empty-row"><td colspan="6">Não foi possível carregar os dados agora.</td></tr>';
      return;
    }

    linhasObrigacoes = achatarObrigacoes(data || []);
    popularFiltros();
    aplicarFiltros();
  }

  function iniciarFiltros() {
    ["filtro-cliente", "filtro-exercicio", "filtro-status"].forEach(function (id) {
      document.getElementById(id).addEventListener("change", aplicarFiltros);
    });
  }

  var buscaTimeout = null;

  async function executarBusca(termo) {
    var painel = document.querySelector("[data-busca-resultados]");
    var elClientes = document.querySelector("[data-busca-clientes]");
    var elProcessos = document.querySelector("[data-busca-processos]");

    if (!termo) {
      painel.hidden = true;
      return;
    }
    painel.hidden = false;
    elClientes.innerHTML = "Buscando…";
    elProcessos.innerHTML = "";

    var [clientesResp, processosResp] = await Promise.all([
      bfSupabase.from("clientes").select("id, nome").ilike("nome", "%" + termo + "%").limit(8),
      bfSupabase
        .from("processos")
        .select("id, titulo, categoria, ano, numero_processo, clientes(nome)")
        .or("titulo.ilike.%" + termo + "%,numero_processo.ilike.%" + termo + "%")
        .limit(8),
    ]);

    var clientes = clientesResp.data || [];
    var processos = processosResp.data || [];

    elClientes.innerHTML =
      '<div class="portal-inline-msg" style="font-weight:600; text-transform:uppercase; letter-spacing:.08em; font-size:.7rem; color:var(--slate);">Clientes</div>' +
      (clientes.length
        ? clientes.map(function (c) {
            return '<div style="padding:.5rem 0; border-bottom:1px solid var(--mist);"><a class="portal-inline-link" href="cliente.html?id=' + c.id + '">' + c.nome + "</a></div>";
          }).join("")
        : '<div class="portal-inline-msg">Nenhum cliente encontrado.</div>');

    elProcessos.innerHTML =
      '<div class="portal-inline-msg" style="font-weight:600; text-transform:uppercase; letter-spacing:.08em; font-size:.7rem; color:var(--slate);">Processos</div>' +
      (processos.length
        ? processos.map(function (p) {
            var label = (p.titulo || LABELS.categoria[p.categoria] || p.categoria) + " — " + (p.clientes ? p.clientes.nome : "?") + (p.ano ? " · " + p.ano : "");
            return '<div style="padding:.5rem 0; border-bottom:1px solid var(--mist);"><a class="portal-inline-link" href="processo.html?id=' + p.id + '">' + label + "</a></div>";
          }).join("")
        : '<div class="portal-inline-msg">Nenhum processo encontrado.</div>');
  }

  function iniciarBusca() {
    document.getElementById("busca-geral").addEventListener("input", function (e) {
      var termo = e.target.value.trim();
      clearTimeout(buscaTimeout);
      buscaTimeout = setTimeout(function () { executarBusca(termo); }, 300);
    });
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

    iniciarFiltros();
    iniciarBusca();
    await carregarProcessos();
    await carregarObrigacoes();
  }

  init();
})();
