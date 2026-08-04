(function () {
  "use strict";

  var LABELS = {
    nivel: { nacional: "Nacional", estadual: "Estadual", municipal: "Municipal" },
  };

  var clientes = [];

  function clienteDepth(path) {
    return path ? path.split(".").length - 1 : 0;
  }
  function tipoChave(c) {
    if (c.nivel) return "orgao";
    if (c.eh_candidato) return "candidato";
    return "nenhum";
  }
  function tipoClienteLabel(c) {
    var partes = [];
    if (c.nivel) partes.push("Órgão " + (LABELS.nivel[c.nivel] || c.nivel));
    if (c.eh_candidato) partes.push("Candidato" + (c.cargo_disputado ? " a " + c.cargo_disputado : ""));
    return partes.length ? partes.join(" · ") : "Sem categoria";
  }

  function renderTabela(lista) {
    var tbody = document.querySelector('[data-list="clientes"]');
    if (!lista.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="4">Nenhum cliente encontrado.</td></tr>';
      return;
    }
    tbody.innerHTML = lista.map(function (c) {
      var indent = "— ".repeat(clienteDepth(c.path));
      return "<tr>" +
        "<td>" + indent + c.nome + "</td>" +
        "<td>" + tipoClienteLabel(c) + "</td>" +
        "<td>" + (c.partidos ? (c.partidos.sigla || c.partidos.nome) : "—") + "</td>" +
        '<td><a class="portal-inline-link" href="cliente.html?id=' + c.id + '">Abrir pasta</a></td>' +
      "</tr>";
    }).join("");
  }

  function aplicarFiltros() {
    var busca = document.getElementById("filtro-busca").value.trim().toLowerCase();
    var tipo = document.getElementById("filtro-tipo").value;

    var filtrados = clientes.filter(function (c) {
      if (busca && c.nome.toLowerCase().indexOf(busca) === -1) return false;
      if (tipo && tipoChave(c) !== tipo) return false;
      return true;
    });
    renderTabela(filtrados);
  }

  async function carregarClientes() {
    var { data, error } = await bfSupabase
      .from("clientes")
      .select("*, partidos(sigla)")
      .order("path");
    if (error) {
      console.error(error);
      document.querySelector('[data-list="clientes"]').innerHTML =
        '<tr class="empty-row"><td colspan="4">Não foi possível carregar os clientes agora.</td></tr>';
      return;
    }
    clientes = data || [];
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

    document.getElementById("filtro-busca").addEventListener("input", aplicarFiltros);
    document.getElementById("filtro-tipo").addEventListener("change", aplicarFiltros);

    await carregarClientes();
  }

  init();
})();
