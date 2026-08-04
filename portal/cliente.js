(function () {
  "use strict";

  var LABELS = {
    nivel: { nacional: "Nacional", estadual: "Estadual", municipal: "Municipal" },
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

  var clienteId = new URLSearchParams(location.search).get("id");

  function resultadoLabel(categoria, resultado) {
    if (!resultado) return "—";
    if (categoria === "prestacao_contas") return LABELS.resultadoContas[resultado] || resultado;
    return resultado;
  }
  function setMsg(key, text, isError) {
    var el = document.querySelector('[data-msg="' + key + '"]');
    if (!el) return;
    el.textContent = text;
    el.classList.toggle("is-error", !!isError);
  }
  function val(id) {
    var el = document.getElementById(id);
    return el.value.trim() === "" ? null : el.value.trim();
  }

  function bindForm(key, handler) {
    var form = document.querySelector('[data-form="' + key + '"]');
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      setMsg(key, "Salvando…", false);
      try {
        await handler();
        setMsg(key, "Salvo com sucesso.", false);
        form.reset();
        atualizarCampoResultado();
      } catch (err) {
        console.error(err);
        setMsg(key, "Erro ao salvar: " + (err.message || "tente novamente."), true);
      }
    });
  }

  function atualizarCampoResultado() {
    var categoria = document.getElementById("proc-categoria").value;
    var isContas = categoria === "prestacao_contas";
    document.querySelector("[data-resultado-select-wrap]").hidden = !isContas;
    document.querySelector("[data-resultado-texto-wrap]").hidden = isContas;
  }

  async function carregarCliente() {
    var { data, error } = await bfSupabase
      .from("clientes")
      .select("*, partidos(sigla, nome)")
      .eq("id", clienteId)
      .single();
    if (error || !data) {
      document.querySelector("[data-cliente-nome]").textContent = "Cliente não encontrado";
      return;
    }
    document.querySelector("[data-cliente-nome]").textContent = data.nome;

    var partes = [];
    if (data.nivel) partes.push("Órgão " + (LABELS.nivel[data.nivel] || data.nivel));
    if (data.eh_candidato) partes.push("Candidato" + (data.cargo_disputado ? " a " + data.cargo_disputado : "") + (data.ano_eleicao ? " · " + data.ano_eleicao : ""));
    if (data.partidos) partes.push(data.partidos.sigla ? data.partidos.sigla + " — " + data.partidos.nome : data.partidos.nome);
    if ([data.uf, data.municipio].filter(Boolean).length) partes.push([data.uf, data.municipio].filter(Boolean).join(" / "));
    document.querySelector("[data-cliente-info]").textContent = partes.length ? partes.join(" · ") : "Cliente sem categoria definida";
  }

  var processosCache = [];

  function renderProcessos(lista) {
    var wrap = document.querySelector('[data-list="processos"]');
    if (!lista.length) {
      wrap.innerHTML = '<span class="empty-note">Nenhum processo encontrado.</span>';
      return;
    }
    wrap.innerHTML = lista.map(function (p) {
      var titulo = p.titulo || (LABELS.categoria[p.categoria] + (p.ano ? " · " + p.ano : ""));
      var chips = ['<span class="chip is-navy">' + LABELS.categoria[p.categoria] + "</span>"];
      chips.push('<span class="chip">' + LABELS.status[p.status] + "</span>");
      var resultado = resultadoLabel(p.categoria, p.resultado);
      if (resultado !== "—") chips.push('<span class="chip is-slate">' + resultado + "</span>");
      return '<a class="case-row" href="processo.html?id=' + p.id + '">' +
        '<div class="case-row-top">' +
          '<span class="case-row-title">' + titulo + "</span>" +
          '<span class="case-row-date">' + (p.numero_processo || "") + "</span>" +
        "</div>" +
        (p.numero_processo ? '<div class="case-row-sub">' + p.numero_processo + "</div>" : "") +
        '<div class="case-row-chips">' + chips.join("") + "</div>" +
      "</a>";
    }).join("");
  }

  function aplicarFiltroProcessos() {
    var termo = document.getElementById("busca-processo").value.trim().toLowerCase();
    var status = document.getElementById("filtro-processo-status").value;

    var filtrados = processosCache.filter(function (p) {
      if (status && p.status !== status) return false;
      if (termo) {
        var alvo = [
          LABELS.categoria[p.categoria],
          p.titulo,
          p.numero_processo,
          p.subcategoria,
        ].filter(Boolean).join(" ").toLowerCase();
        if (alvo.indexOf(termo) === -1) return false;
      }
      return true;
    });
    renderProcessos(filtrados);
  }

  async function carregarProcessos() {
    var { data, error } = await bfSupabase
      .from("processos")
      .select("*")
      .eq("cliente_id", clienteId)
      .order("ano", { ascending: false });
    if (error) { console.error(error); return; }
    processosCache = data || [];
    aplicarFiltroProcessos();
  }

  function iniciarFormularios() {
    document.getElementById("proc-categoria").addEventListener("change", atualizarCampoResultado);
    atualizarCampoResultado();

    document.querySelector("[data-toggle-novo-processo]").addEventListener("click", function () {
      var box = document.querySelector("[data-novo-processo-box]");
      box.hidden = !box.hidden;
    });

    document.getElementById("busca-processo").addEventListener("input", aplicarFiltroProcessos);
    document.getElementById("filtro-processo-status").addEventListener("change", aplicarFiltroProcessos);

    bindForm("processo", async function () {
      var categoria = val("proc-categoria");
      var resultado = categoria === "prestacao_contas" ? val("proc-resultado-select") : val("proc-resultado-texto");
      var payload = {
        cliente_id: clienteId,
        categoria: categoria,
        subcategoria: val("proc-subcategoria"),
        titulo: val("proc-titulo"),
        ano: val("proc-ano") ? Number(val("proc-ano")) : null,
        numero_processo: val("proc-numero"),
        orgao_julgador: val("proc-orgaojulgador"),
        foro: val("proc-foro"),
        status: val("proc-status") || "em_andamento",
        resultado: resultado,
        data_decisao: val("proc-data-decisao"),
        data_protocolo: val("proc-data-protocolo"),
      };
      if (!payload.categoria) throw new Error("selecione a categoria");
      var { error } = await bfSupabase.from("processos").insert(payload);
      if (error) throw error;
      await carregarProcessos();
      document.querySelector("[data-novo-processo-box]").hidden = true;
    });

    bindForm("acesso", async function () {
      var nome = val("acesso-nome");
      var email = val("acesso-email");
      var escopo = val("acesso-escopo") || "total";
      if (!nome || !email) throw new Error("preencha nome e e-mail");

      var { data: { session } } = await bfSupabase.auth.getSession();
      var resp = await fetch(SUPABASE_URL + "/functions/v1/criar-cliente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + session.access_token,
          "apikey": SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ nome: nome, email: email, cliente_id: clienteId, escopo: escopo }),
      });
      var result = await resp.json();
      if (!resp.ok) throw new Error(result.error || "não foi possível criar o acesso");

      document.querySelector("[data-cred-email]").textContent = result.email;
      document.querySelector("[data-cred-senha]").textContent = result.senha;
      document.querySelector("[data-credential-box]").classList.add("is-visible");
    });

    document.querySelector("[data-copy-senha]").addEventListener("click", function () {
      var senha = document.querySelector("[data-cred-senha]").textContent;
      navigator.clipboard.writeText(senha).then(function () {
        var btn = document.querySelector("[data-copy-senha]");
        var original = btn.textContent;
        btn.textContent = "Copiado!";
        setTimeout(function () { btn.textContent = original; }, 1500);
      });
    });
  }

  async function init() {
    if (!clienteId) {
      document.querySelector("[data-cliente-nome]").textContent = "Nenhum cliente selecionado";
      return;
    }

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

    await carregarCliente();
    await carregarProcessos();
    iniciarFormularios();
  }

  init();
})();
