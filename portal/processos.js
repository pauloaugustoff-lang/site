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
  };

  function resultadoLabel(categoria, resultado) {
    if (!resultado) return "—";
    if (categoria === "prestacao_contas") return LABELS.resultadoContas[resultado] || resultado;
    return resultado;
  }
  function linkProcesso(p) {
    return p.numero_processo ? "processo.html?numero=" + encodeURIComponent(p.numero_processo) : "processo.html?id=" + p.id;
  }
  function fmtData(v) {
    if (!v) return "";
    return new Date(v + "T00:00:00").toLocaleDateString("pt-BR");
  }
  function fmtBool(v) {
    if (v === null || v === undefined) return "";
    return v ? "Sim" : "Não";
  }

  var processosCache = [];
  var processosFiltrados = [];

  function renderTabela(lista) {
    var tbody = document.querySelector('[data-list="processos"]');
    if (!lista.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Nenhum processo encontrado para esse filtro.</td></tr>';
      return;
    }
    tbody.innerHTML = lista.map(function (p) {
      var titulo = p.titulo || (LABELS.categoria[p.categoria] + (p.ano ? " · " + p.ano : ""));
      return "<tr>" +
        '<td><a class="portal-inline-link" href="' + linkProcesso(p) + '">' + titulo + "</a></td>" +
        "<td>" + (LABELS.categoria[p.categoria] || p.categoria) + "</td>" +
        "<td>" + (p.ano || "—") + "</td>" +
        "<td>" + (LABELS.status[p.status] || p.status) + "</td>" +
        "<td>" + resultadoLabel(p.categoria, p.resultado) + "</td>" +
        "<td>" + (p.perfis ? p.perfis.nome : "—") + "</td>" +
      "</tr>";
    }).join("");
  }

  function popularFiltrosProcessos() {
    var ufs = Array.from(new Set(processosCache.map(function (p) { return p.clientes ? p.clientes.uf : null; }).filter(Boolean))).sort();
    var resultados = Array.from(new Set(processosCache.map(function (p) { return p.resultado; }).filter(Boolean)))
      .map(function (r) { return { valor: r, label: LABELS.resultadoContas[r] || r }; })
      .sort(function (a, b) { return a.label.localeCompare(b.label, "pt-BR"); });

    document.getElementById("filtro-uf").innerHTML = '<option value="">Todas</option>' +
      ufs.map(function (u) { return '<option value="' + u + '">' + u + "</option>"; }).join("");
    document.getElementById("filtro-resultado").innerHTML = '<option value="">Todos</option>' +
      resultados.map(function (r) { return '<option value="' + r.valor + '">' + r.label + "</option>"; }).join("");
  }

  function aplicarFiltros() {
    var termo = document.getElementById("busca-processo").value.trim().toLowerCase();
    var categoria = document.getElementById("filtro-categoria").value;
    var status = document.getElementById("filtro-status").value;
    var responsavel = document.getElementById("filtro-responsavel").value;
    var resultado = document.getElementById("filtro-resultado").value;
    var uf = document.getElementById("filtro-uf").value;

    var semMunicipio = processosCache.filter(function (p) {
      if (categoria && p.categoria !== categoria) return false;
      if (status && p.status !== status) return false;
      if (responsavel && p.responsavel_id !== responsavel) return false;
      if (resultado && p.resultado !== resultado) return false;
      if (uf && (!p.clientes || p.clientes.uf !== uf)) return false;
      if (termo) {
        var alvo = [
          p.clientes ? p.clientes.nome : "",
          p.titulo,
          p.numero_processo,
        ].filter(Boolean).join(" ").toLowerCase();
        if (alvo.indexOf(termo) === -1) return false;
      }
      return true;
    });

    // Cidade só aparece quando há município no recorte atual (mesma lógica
    // usada nos filtros de prestação de contas do painel do escritório).
    var municipios = Array.from(new Set(semMunicipio.map(function (p) { return p.clientes ? p.clientes.municipio : null; }).filter(Boolean)))
      .sort(function (a, b) { return a.localeCompare(b, "pt-BR"); });
    var campoMunicipio = document.querySelector("[data-campo-municipio-processos]");
    var selectMunicipio = document.getElementById("filtro-municipio");
    campoMunicipio.hidden = municipios.length === 0;
    var municipioAtual = selectMunicipio.value;
    selectMunicipio.innerHTML = '<option value="">Todas</option>' +
      municipios.map(function (m) { return '<option value="' + m + '">' + m + "</option>"; }).join("");
    var municipio = municipios.indexOf(municipioAtual) !== -1 ? municipioAtual : "";
    selectMunicipio.value = municipio;

    var filtrados = municipio
      ? semMunicipio.filter(function (p) { return p.clientes && p.clientes.municipio === municipio; })
      : semMunicipio;

    processosFiltrados = filtrados;
    renderTabela(filtrados);
  }

  function exportarRelatorio() {
    var cabecalho = [
      "Cliente", "Título", "Número do processo", "Categoria", "Subcategoria", "Ano",
      "UF", "Município", "Órgão julgador", "Foro", "Status", "Resultado",
      "Data de distribuição", "Houve recurso", "Trânsito em julgado", "Data do trânsito",
      "Advogado responsável",
    ];
    var linhas = processosFiltrados.map(function (p) {
      var cliente = p.clientes || {};
      return [
        cliente.nome || "",
        p.titulo || "",
        p.numero_processo || "",
        LABELS.categoria[p.categoria] || p.categoria || "",
        p.subcategoria || "",
        p.ano || "",
        cliente.uf || "",
        cliente.municipio || "",
        p.orgao_julgador || "",
        p.foro || "",
        LABELS.status[p.status] || p.status || "",
        resultadoLabel(p.categoria, p.resultado) === "—" ? "" : resultadoLabel(p.categoria, p.resultado),
        fmtData(p.data_protocolo),
        fmtBool(p.houve_recurso),
        fmtBool(p.transito_julgado),
        fmtData(p.data_transito),
        p.perfis ? p.perfis.nome : "",
      ];
    });

    var sheet = XLSX.utils.aoa_to_sheet([cabecalho].concat(linhas));
    sheet["!cols"] = cabecalho.map(function () { return { wch: 20 }; });
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Processos");
    var hoje = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, "relatorio-processos-" + hoje + ".xlsx");
  }

  async function carregarAdvogados() {
    var { data, error } = await bfSupabase.from("perfis").select("id, nome").eq("role", "escritorio").order("nome");
    if (error) { console.error(error); return; }
    var advogados = (data || []).sort(function (a, b) { return a.nome.localeCompare(b.nome, "pt-BR"); });
    document.getElementById("filtro-responsavel").innerHTML =
      '<option value="">Todos</option>' + advogados.map(function (a) { return '<option value="' + a.id + '">' + a.nome + "</option>"; }).join("");
  }

  async function carregarProcessos() {
    var { data, error } = await bfSupabase
      .from("processos")
      .select("*, clientes(nome, uf, municipio), perfis(nome)")
      .order("created_at", { ascending: false });

    var tbody = document.querySelector('[data-list="processos"]');
    if (error) {
      console.error(error);
      tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Não foi possível carregar os processos agora: ' + error.message + "</td></tr>";
      return;
    }
    processosCache = data || [];
    popularFiltrosProcessos();
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

    document.getElementById("busca-processo").addEventListener("input", aplicarFiltros);
    ["filtro-categoria", "filtro-status", "filtro-responsavel", "filtro-resultado", "filtro-uf", "filtro-municipio"].forEach(function (id) {
      document.getElementById(id).addEventListener("change", aplicarFiltros);
    });
    document.querySelector("[data-exportar-relatorio]").addEventListener("click", exportarRelatorio);

    await carregarAdvogados();
    await carregarProcessos();
  }

  init();
})();
