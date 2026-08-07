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

  var processosCache = [];

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

  function aplicarFiltros() {
    var termo = document.getElementById("busca-processo").value.trim().toLowerCase();
    var categoria = document.getElementById("filtro-categoria").value;
    var status = document.getElementById("filtro-status").value;
    var responsavel = document.getElementById("filtro-responsavel").value;

    var filtrados = processosCache.filter(function (p) {
      if (categoria && p.categoria !== categoria) return false;
      if (status && p.status !== status) return false;
      if (responsavel && p.responsavel_id !== responsavel) return false;
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
    renderTabela(filtrados);
  }

  async function carregarAdvogados() {
    var { data, error } = await bfSupabase.from("perfis").select("id, nome").eq("role", "escritorio").order("nome");
    if (error) { console.error(error); return; }
    document.getElementById("filtro-responsavel").innerHTML =
      '<option value="">Todos</option>' + (data || []).map(function (a) { return '<option value="' + a.id + '">' + a.nome + "</option>"; }).join("");
  }

  async function carregarProcessos() {
    var { data, error } = await bfSupabase
      .from("processos")
      .select("*, clientes(nome), perfis(nome)")
      .order("created_at", { ascending: false });

    var tbody = document.querySelector('[data-list="processos"]');
    if (error) {
      console.error(error);
      tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Não foi possível carregar os processos agora: ' + error.message + "</td></tr>";
      return;
    }
    processosCache = data || [];
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
    ["filtro-categoria", "filtro-status", "filtro-responsavel"].forEach(function (id) {
      document.getElementById(id).addEventListener("change", aplicarFiltros);
    });

    await carregarAdvogados();
    await carregarProcessos();
  }

  init();
})();
