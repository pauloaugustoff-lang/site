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
        // a determinação não tem mais responsável próprio — reflete o
        // responsável do processo, que é quem responde por ela na prática
        responsavelId: pr.responsavel_id,
        responsavelNome: pr.perfis ? pr.perfis.nome : null,
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

  async function carregarAdvogados() {
    var { data, error } = await bfSupabase.from("perfis").select("id, nome").eq("role", "escritorio").order("nome");
    if (error) { console.error(error); return; }
    document.getElementById("filtro-responsavel").innerHTML = '<option value="">Todos</option>' +
      (data || []).map(function (a) { return '<option value="' + a.id + '">' + a.nome + "</option>"; }).join("");
  }

  function renderStats(lista) {
    var todosPendentes = lista.filter(function (l) { return l.status === "pendente"; });
    var pendentes = todosPendentes.filter(function (l) { return !isVencida(l); }).length;
    var vencidas = lista.filter(isVencida).length;
    var cumpridas = lista.filter(function (l) { return l.status === "cumprida"; }).length;
    var somaValor = function (tipo) {
      return todosPendentes
        .filter(function (l) { return l.tipo === tipo; })
        .reduce(function (acc, l) { return acc + (Number(l.valor) || 0); }, 0);
    };
    document.querySelector('[data-stat="total"]').textContent = lista.length;
    document.querySelector('[data-stat="pendentes"]').textContent = pendentes;
    document.querySelector('[data-stat="vencidas"]').textContent = vencidas;
    document.querySelector('[data-stat="cumpridas"]').textContent = cumpridas;
    document.querySelector('[data-stat="valor-recolher"]').textContent = fmtMoeda(somaValor("recolhimento_uniao"));
    document.querySelector('[data-stat="valor-politica-mulher"]').textContent = fmtMoeda(somaValor("aplicacao_politica_mulher"));
  }

  function renderDeterminacoesTabela(lista) {
    var tbody = document.querySelector('[data-list="determinacoes"]');
    if (!lista.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="7">Nenhuma determinação encontrada para esse filtro.</td></tr>';
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
        "<td>" + (l.responsavelNome || "—") + "</td>" +
      "</tr>";
    }).join("");
  }

  function aplicarFiltros() {
    var cliente = document.getElementById("filtro-cliente").value;
    var exercicio = document.getElementById("filtro-exercicio").value;
    var status = document.getElementById("filtro-status").value;
    var responsavel = document.getElementById("filtro-responsavel").value;

    var filtradas = linhasDeterminacoes.filter(function (l) {
      if (cliente && l.clienteNome !== cliente) return false;
      if (exercicio && String(l.ano) !== exercicio) return false;
      if (status && statusKey(l) !== status) return false;
      if (responsavel && l.responsavelId !== responsavel) return false;
      return true;
    });

    renderStats(filtradas);
    renderDeterminacoesTabela(filtradas);
  }

  async function carregarDeterminacoes() {
    var { data, error } = await bfSupabase
      .from("determinacoes")
      .select("*, processos(categoria, ano, responsavel_id, clientes(nome), perfis(nome))")
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
    renderProximosPrazos();
    renderClientesPendencias();
  }

  function setStatComRotulo(key, valor, rotulo) {
    var el = document.querySelector('[data-stat="' + key + '"]');
    if (!el) return;
    el.textContent = valor;
    var labelEl = el.parentElement.querySelector(".label");
    if (labelEl) labelEl.textContent = rotulo;
  }

  var contasDashboard = [];

  function achatarContas(lista) {
    return lista
      .filter(function (p) { return p.categoria === "prestacao_contas"; })
      .map(function (p) {
        var cliente = p.clientes || {};
        return {
          resultado: p.resultado,
          ano: p.ano,
          subcategoria: (p.subcategoria || "").trim(),
          uf: cliente.uf || null,
          municipio: cliente.municipio || null,
          // prestação de contas só existe pra candidato ou diretório na
          // prática — qualquer tipo_cliente que não seja "candidato" cai
          // no balde "diretorio" (nacional/estadual/municipal)
          tipoPrestador: cliente.tipo_cliente === "candidato" ? "candidato" : "diretorio",
        };
      });
  }

  function popularFiltrosPrestacaoContas() {
    var subtipos = Array.from(new Set(
      contasDashboard.filter(function (c) { return c.tipoPrestador === "diretorio" && c.subcategoria; })
        .map(function (c) { return c.subcategoria; })
    )).sort();
    var anos = Array.from(new Set(contasDashboard.map(function (c) { return c.ano; }).filter(Boolean)))
      .sort(function (a, b) { return b - a; });
    var ufs = Array.from(new Set(contasDashboard.map(function (c) { return c.uf; }).filter(Boolean))).sort();

    document.getElementById("pc-filtro-subtipo").innerHTML = '<option value="">Todos</option>' +
      subtipos.map(function (s) { return '<option value="' + s + '">' + s + "</option>"; }).join("");
    document.getElementById("pc-filtro-ano").innerHTML = '<option value="">Todos</option>' +
      anos.map(function (a) { return '<option value="' + a + '">' + a + "</option>"; }).join("");
    document.getElementById("pc-filtro-uf").innerHTML = '<option value="">Todos</option>' +
      ufs.map(function (u) { return '<option value="' + u + '">' + u + "</option>"; }).join("");
  }

  function renderPrestacaoContasStats(contas) {
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
    document.querySelector('[data-stat="pc-total"]').textContent = contas.length;
    setStatComRotulo("pc-aguardando", aguardando,
      contas.length ? "Aguardando julgamento · " + Math.round((aguardando / contas.length) * 100) + "%" : "Aguardando julgamento");
    setStatComRotulo("pc-aprovadas", aprovadas.length, rotuloPct("Aprovadas", aprovadas.length));
    setStatComRotulo("pc-ressalvas", ressalvas.length, rotuloPct("Aprovadas com ressalvas", ressalvas.length));
    setStatComRotulo("pc-desaprovadas", desaprovadas.length, rotuloPct("Desaprovadas", desaprovadas.length));
    setStatComRotulo("pc-nao-prestadas", naoPrestadas.length, rotuloPct("Não prestadas", naoPrestadas.length));
  }

  // Anual/Eleitoral só faz sentido pra diretório (candidato é sempre
  // eleitoral) — o campo aparece/some conforme o Tipo escolhido.
  // Cidade só aparece quando existe pelo menos um resultado com município
  // no recorte atual (diretório municipal ou candidato de eleição
  // municipal) — em vez de travar isso num cargo específico.
  function aplicarFiltrosPrestacaoContas() {
    var tipo = document.getElementById("pc-filtro-tipo").value;
    var subtipo = document.getElementById("pc-filtro-subtipo").value;
    var ano = document.getElementById("pc-filtro-ano").value;
    var uf = document.getElementById("pc-filtro-uf").value;

    document.querySelector("[data-pc-campo-subtipo]").hidden = tipo !== "diretorio";
    if (tipo !== "diretorio" && subtipo) {
      subtipo = "";
      document.getElementById("pc-filtro-subtipo").value = "";
    }

    var semMunicipio = contasDashboard.filter(function (c) {
      if (tipo && c.tipoPrestador !== tipo) return false;
      if (subtipo && c.subcategoria !== subtipo) return false;
      if (ano && String(c.ano) !== ano) return false;
      if (uf && c.uf !== uf) return false;
      return true;
    });

    var municipios = Array.from(new Set(semMunicipio.map(function (c) { return c.municipio; }).filter(Boolean)))
      .sort(function (a, b) { return a.localeCompare(b, "pt-BR"); });
    var campoMunicipio = document.querySelector("[data-pc-campo-municipio]");
    var selectMunicipio = document.getElementById("pc-filtro-municipio");
    campoMunicipio.hidden = municipios.length === 0;
    var municipioAtual = selectMunicipio.value;
    selectMunicipio.innerHTML = '<option value="">Todas</option>' +
      municipios.map(function (m) { return '<option value="' + m + '">' + m + "</option>"; }).join("");
    var municipio = municipios.indexOf(municipioAtual) !== -1 ? municipioAtual : "";
    selectMunicipio.value = municipio;

    var filtradas = municipio ? semMunicipio.filter(function (c) { return c.municipio === municipio; }) : semMunicipio;
    renderPrestacaoContasStats(filtradas);
  }

  function iniciarFiltrosPrestacaoContas() {
    ["pc-filtro-tipo", "pc-filtro-subtipo", "pc-filtro-ano", "pc-filtro-uf", "pc-filtro-municipio"].forEach(function (id) {
      document.getElementById(id).addEventListener("change", aplicarFiltrosPrestacaoContas);
    });
  }

  function contagemPor(lista, chaveFn) {
    var mapa = new Map();
    lista.forEach(function (item) {
      var chave = chaveFn(item);
      if (!chave) return;
      mapa.set(chave, (mapa.get(chave) || 0) + 1);
    });
    return Array.from(mapa.entries()).sort(function (a, b) { return b[1] - a[1]; });
  }

  function renderStatRows(selector, pares, vazio) {
    var el = document.querySelector(selector);
    el.innerHTML = pares.length
      ? pares.map(function (p) {
          return '<div class="stat-row"><span class="label">' + p[0] + '</span><span class="value">' + p[1] + "</span></div>";
        }).join("")
      : '<span class="empty-note">' + vazio + "</span>";
  }

  function renderProximosPrazos() {
    var proximos = linhasDeterminacoes
      .filter(function (l) { return l.status === "pendente" && l.prazo; })
      .slice(0, 6);

    var el = document.querySelector("[data-proximos-prazos]");
    el.innerHTML = proximos.length
      ? '<div class="sidebar-list">' + proximos.map(function (l) {
          return '<div class="sidebar-item">' +
            '<div class="t">' + l.clienteNome + " " + statusBadge(l) + "</div>" +
            '<div class="d">' + (LABELS.tipoDeterminacao[l.tipo] || l.tipo) + " — " + l.descricao + "</div>" +
            '<div class="d">Prazo ' + fmtData(l.prazo) + "</div>" +
          "</div>";
        }).join("") + "</div>"
      : '<span class="empty-note">Nenhum prazo pendente.</span>';
  }

  function renderClientesPendencias() {
    var pendentes = linhasDeterminacoes.filter(function (l) { return l.status === "pendente"; });
    var pares = contagemPor(pendentes, function (l) { return l.clienteNome; }).slice(0, 5);
    renderStatRows("[data-clientes-pendencias]", pares, "Nenhuma pendência.");
  }

  var processosDashboard = [];

  async function carregarDashboardProcessos() {
    var { data, error } = await bfSupabase
      .from("processos")
      .select("categoria, status, resultado, ano, subcategoria, perfis(nome), clientes(uf, municipio, tipo_cliente, partido_id, partidos(sigla, nome))");

    if (error) {
      console.error(error);
      ["[data-por-categoria]", "[data-por-advogado]", "[data-por-partido]", "[data-por-estado]"].forEach(function (sel) {
        document.querySelector(sel).innerHTML = '<span class="empty-note">Não foi possível carregar: ' + error.message + "</span>";
      });
      return;
    }
    processosDashboard = data || [];

    contasDashboard = achatarContas(processosDashboard);
    popularFiltrosPrestacaoContas();
    aplicarFiltrosPrestacaoContas();

    renderStatRows(
      "[data-por-categoria]",
      contagemPor(processosDashboard, function (p) { return LABELS.categoria[p.categoria] || p.categoria; }),
      "Nenhum processo cadastrado."
    );
    renderStatRows(
      "[data-por-advogado]",
      contagemPor(processosDashboard, function (p) { return p.perfis ? p.perfis.nome : "Não atribuído"; }),
      "Nenhum processo cadastrado."
    );
    renderStatRows(
      "[data-por-partido]",
      contagemPor(processosDashboard, function (p) {
        var partido = p.clientes && p.clientes.partidos;
        return partido ? (partido.sigla || partido.nome) : "Sem partido";
      }),
      "Nenhum processo cadastrado."
    );
    renderStatRows(
      "[data-por-estado]",
      contagemPor(processosDashboard, function (p) { return p.clientes ? p.clientes.uf : null; }),
      "Nenhum processo com UF cadastrada."
    );
  }

  function iniciarFiltros() {
    ["filtro-cliente", "filtro-exercicio", "filtro-status", "filtro-responsavel"].forEach(function (id) {
      document.getElementById(id).addEventListener("change", aplicarFiltros);
    });
  }

  async function carregarMeusNumeros(meuId) {
    var [processosResp, determinacoesResp] = await Promise.all([
      bfSupabase.from("processos").select("id", { count: "exact", head: true }).eq("responsavel_id", meuId).eq("status", "em_andamento"),
      bfSupabase.from("determinacoes").select("id, processos!inner(responsavel_id)", { count: "exact", head: true }).eq("processos.responsavel_id", meuId).eq("status", "pendente"),
    ]);
    document.querySelector('[data-stat="meus-processos"]').textContent = processosResp.count === null ? "—" : processosResp.count;
    document.querySelector('[data-stat="minhas-determinacoes"]').textContent = determinacoesResp.count === null ? "—" : determinacoesResp.count;
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
    iniciarFiltrosPrestacaoContas();
    await carregarAdvogados();
    await carregarMeusNumeros(session.user.id);
    await carregarDeterminacoes();
    await carregarDashboardProcessos();
  }

  init();
})();
