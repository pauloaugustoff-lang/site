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
    tipoDeterminacao: {
      recolhimento_uniao: "Recolhimento à União",
      aplicacao_politica_mulher: "Aplicação em política da mulher",
      aplicacao_minorias: "Aplicação em ações afirmativas / minorias",
      multa: "Multa",
      outra: "Outra",
    },
    statusDeterminacao: { pendente: "Pendente", cumprida: "Cumprida" },
  };

  function fmtMoeda(v) {
    if (v === null || v === undefined) return "—";
    return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace(new RegExp(String.fromCharCode(160), "g"), " ");
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
    var label = key === "vencida" ? "Vencida" : LABELS.statusDeterminacao[row.status] || row.status;
    return '<span class="status-badge ' + key + '">' + label + "</span>";
  }

  var linhasDeterminacoes = [];
  var processosCache = [];

  function achatarDeterminacoes(determinacoes) {
    return determinacoes.map(function (d) {
      var pr = d.processos || {};
      var cliente = pr.clientes || {};
      return {
        id: d.id,
        clienteNome: cliente.nome || "—",
        categoria: pr.categoria || null,
        ano: pr.ano || null,
        tipo: d.tipo,
        descricao: d.descricao,
        valor: d.valor,
        prazo: d.prazo,
        status: d.status,
      };
    });
  }

  function popularFiltros() {
    var clientesNomes = Array.from(new Set(linhasDeterminacoes.map(function (l) { return l.clienteNome; }))).sort();
    var exercicios = Array.from(new Set(linhasDeterminacoes.map(function (l) { return l.ano; }).filter(Boolean))).sort(function (a, b) { return b - a; });

    document.getElementById("filtro-cliente").innerHTML =
      '<option value="">Todos</option>' + clientesNomes.map(function (c) { return '<option value="' + c + '">' + c + "</option>"; }).join("");
    document.getElementById("filtro-exercicio").innerHTML =
      '<option value="">Todos</option>' + exercicios.map(function (e) { return '<option value="' + e + '">' + e + "</option>"; }).join("");
  }

  function setStat(key, valor, rotuloComPct) {
    var el = document.querySelector('[data-stat="' + key + '"]');
    if (!el) return;
    el.textContent = valor;
    if (rotuloComPct !== undefined) {
      var labelEl = el.parentElement.querySelector(".label");
      if (labelEl) labelEl.textContent = rotuloComPct;
    }
  }

  function renderDashboardStats() {
    var contas = processosCache.filter(function (p) { return p.categoria === "prestacao_contas"; });
    var aprovadas = contas.filter(function (p) { return p.resultado === "aprovadas"; });
    var ressalvas = contas.filter(function (p) { return p.resultado === "aprovadas_com_ressalvas"; });
    var desaprovadas = contas.filter(function (p) { return p.resultado === "desaprovadas"; });
    var naoPrestadas = contas.filter(function (p) { return p.resultado === "nao_prestadas"; });
    // "julgadas" = tem resultado definido — não conta as que ainda aguardam julgamento
    var julgadas = aprovadas.length + ressalvas.length + desaprovadas.length + naoPrestadas.length;
    var aguardando = contas.length - julgadas;
    function rotuloPct(base, n) {
      return julgadas ? base + " · " + Math.round((n / julgadas) * 100) + "%" : base;
    }
    var andamento = processosCache.filter(function (p) { return p.status === "em_andamento"; });

    var pendentes = linhasDeterminacoes.filter(function (d) { return d.status === "pendente"; });
    var recolhimentos = pendentes.filter(function (d) { return d.tipo === "recolhimento_uniao"; });
    var politicaMulher = pendentes.filter(function (d) { return d.tipo === "aplicacao_politica_mulher"; });
    var somaValor = function (lista) { return lista.reduce(function (acc, d) { return acc + (Number(d.valor) || 0); }, 0); };

    setStat("pc-total", contas.length);
    setStat("pc-aguardando", aguardando,
      contas.length ? "Aguardando julgamento · " + Math.round((aguardando / contas.length) * 100) + "%" : "Aguardando julgamento");
    setStat("pc-aprovadas", aprovadas.length, rotuloPct("Aprovadas", aprovadas.length));
    setStat("pc-ressalvas", ressalvas.length, rotuloPct("Aprovadas com ressalvas", ressalvas.length));
    setStat("pc-desaprovadas", desaprovadas.length, rotuloPct("Desaprovadas", desaprovadas.length));
    setStat("pc-nao-prestadas", naoPrestadas.length, rotuloPct("Não prestadas", naoPrestadas.length));
    setStat("processos-andamento", andamento.length);
    setStat("determinacoes-pendentes", pendentes.length);
    setStat("recolhimentos-pendentes", recolhimentos.length);
    setStat("politica-mulher-pendentes", politicaMulher.length);
    setStat("valor-recolher", fmtMoeda(somaValor(recolhimentos)));
    setStat("valor-politica-mulher", fmtMoeda(somaValor(politicaMulher)));
  }

  function renderProximosVencimentos() {
    var el = document.querySelector("[data-proximos-vencimentos]");
    var proximos = linhasDeterminacoes
      .filter(function (d) { return d.status === "pendente" && d.prazo; })
      .slice(0, 6);

    el.innerHTML = proximos.length
      ? '<div class="sidebar-list">' + proximos.map(function (d) {
          return '<div class="sidebar-item">' +
            '<div class="t">' + d.clienteNome + " " + statusBadge(d) + "</div>" +
            '<div class="d">' + (LABELS.tipoDeterminacao[d.tipo] || d.tipo) + " — " + d.descricao + "</div>" +
            '<div class="d">Prazo ' + fmtData(d.prazo) + "</div>" +
          "</div>";
        }).join("") + "</div>"
      : '<span class="empty-note">Nenhum vencimento pendente.</span>';
  }

  function renderDeterminacoesTabela(lista) {
    var tbody = document.querySelector('[data-list="determinacoes"]');
    if (!lista.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Nenhuma determinação encontrada para esse filtro.</td></tr>';
      return;
    }
    tbody.innerHTML = lista.map(function (l) {
      return "<tr>" +
        "<td>" + l.clienteNome + "</td>" +
        "<td>" + (LABELS.categoria[l.categoria] || "—") + "</td>" +
        "<td>" + (LABELS.tipoDeterminacao[l.tipo] || l.tipo) + " — " + l.descricao + "</td>" +
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

    var filtradas = linhasDeterminacoes.filter(function (l) {
      if (cliente && l.clienteNome !== cliente) return false;
      if (exercicio && String(l.ano) !== exercicio) return false;
      if (status && statusKey(l) !== status) return false;
      return true;
    });

    renderDeterminacoesTabela(filtradas);
  }

  async function carregarProcessos() {
    var { data, error } = await bfSupabase
      .from("processos")
      .select("*, clientes(nome), perfis(nome)")
      .order("ano", { ascending: false });

    var tbody = document.querySelector('[data-list="processos"]');
    if (error) {
      console.error(error);
      tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Não foi possível carregar os processos agora.</td></tr>';
      return;
    }

    var processos = data || [];
    processosCache = processos;
    tbody.innerHTML = processos.length
      ? processos.map(function (p) {
          return "<tr>" +
            "<td>" + (p.clientes ? p.clientes.nome : "—") + "</td>" +
            "<td>" + (LABELS.categoria[p.categoria] || p.categoria) + "</td>" +
            "<td>" + (p.ano || "—") + "</td>" +
            "<td>" + (LABELS.status[p.status] || p.status) + "</td>" +
            "<td>" + resultadoLabel(p.categoria, p.resultado) + "</td>" +
            "<td>" + (p.perfis ? p.perfis.nome : "—") + "</td>" +
          "</tr>";
        }).join("")
      : '<tr class="empty-row"><td colspan="6">Nenhum processo encontrado.</td></tr>';
    renderDashboardStats();
  }

  async function carregarDeterminacoes() {
    var { data, error } = await bfSupabase
      .from("determinacoes")
      .select("*, processos(categoria, ano, clientes(nome))")
      .order("prazo", { ascending: true, nullsFirst: false });

    if (error) {
      console.error(error);
      document.querySelector('[data-list="determinacoes"]').innerHTML =
        '<tr class="empty-row"><td colspan="6">Não foi possível carregar os dados agora.</td></tr>';
      return;
    }

    linhasDeterminacoes = achatarDeterminacoes(data || []);
    popularFiltros();
    aplicarFiltros();
    renderDashboardStats();
    renderProximosVencimentos();
  }

  function iniciarFiltros() {
    ["filtro-cliente", "filtro-exercicio", "filtro-status"].forEach(function (id) {
      document.getElementById(id).addEventListener("change", aplicarFiltros);
    });
  }

  async function init() {
    var session = await bfRequireSession("../login.html");
    if (!session) return;

    var perfil = await bfGetPerfil(session.user.id);
    if (!perfil) {
      window.location.href = "../login.html";
      return;
    }

    document.querySelector("[data-user-nome]").textContent = perfil.nome;
    var clienteLabel = perfil.role === "escritorio"
      ? "Escritório"
      : (perfil.clientes ? perfil.clientes.nome : "—");
    document.querySelector("[data-user-orgao]").textContent = clienteLabel;


    document.querySelector("[data-logout]").addEventListener("click", function () {
      bfLogout("../login.html");
    });

    iniciarFiltros();
    await carregarProcessos();
    await carregarDeterminacoes();
  }

  init();
})();
