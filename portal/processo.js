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

  var processoId = new URLSearchParams(location.search).get("id");
  var clienteId = null; // preenchido depois de carregar o processo

  function fmtMoeda(v) {
    if (v === null || v === undefined) return "—";
    return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  function fmtData(v) {
    if (!v) return "—";
    return new Date(v + "T00:00:00").toLocaleDateString("pt-BR");
  }
  function resultadoLabel(categoria, resultado) {
    if (!resultado) return null;
    if (categoria === "prestacao_contas") return LABELS.resultadoContas[resultado] || resultado;
    return resultado;
  }
  function statusBadge(status, prazo) {
    var vencida = status === "pendente" && prazo && new Date(prazo + "T00:00:00") < new Date();
    var key = vencida ? "vencida" : status;
    var label = vencida ? "Vencida" : LABELS.statusObrigacao[status] || status;
    return '<span class="status-badge ' + key + '">' + label + "</span>";
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

  function preencherFormulario(p) {
    document.getElementById("proc-categoria").value = p.categoria;
    document.getElementById("proc-subcategoria").value = p.subcategoria || "";
    document.getElementById("proc-titulo").value = p.titulo || "";
    document.getElementById("proc-ano").value = p.ano || "";
    document.getElementById("proc-numero").value = p.numero_processo || "";
    document.getElementById("proc-orgaojulgador").value = p.orgao_julgador || "";
    document.getElementById("proc-foro").value = p.foro || "";
    document.getElementById("proc-status").value = p.status;
    document.getElementById("proc-data-decisao").value = p.data_decisao || "";
    document.getElementById("proc-data-protocolo").value = p.data_protocolo || "";
    document.getElementById("proc-observacoes").value = p.observacoes || "";

    atualizarCampoResultado();
    if (p.categoria === "prestacao_contas") {
      document.getElementById("proc-resultado-select").value = p.resultado || "";
    } else {
      document.getElementById("proc-resultado-texto").value = p.resultado || "";
    }
  }

  async function carregarProcesso() {
    var { data, error } = await bfSupabase
      .from("processos")
      .select("*, clientes(id, nome)")
      .eq("id", processoId)
      .single();
    if (error || !data) {
      document.querySelector("[data-processo-titulo]").textContent = "Processo não encontrado";
      return;
    }

    clienteId = data.clientes ? data.clientes.id : null;
    var voltar = document.querySelector("[data-voltar-cliente]");
    if (clienteId) {
      voltar.href = "cliente.html?id=" + clienteId;
      voltar.textContent = "← Voltar a " + data.clientes.nome;
    }

    document.querySelector("[data-processo-titulo]").textContent =
      data.titulo || (LABELS.categoria[data.categoria] + (data.ano ? " · " + data.ano : ""));

    var chips = ['<span class="chip is-navy">' + LABELS.categoria[data.categoria] + "</span>"];
    if (data.subcategoria) chips.push('<span class="chip">' + data.subcategoria + "</span>");
    chips.push('<span class="chip">' + (LABELS.status[data.status] || data.status) + "</span>");
    var resultado = resultadoLabel(data.categoria, data.resultado);
    if (resultado) chips.push('<span class="chip is-slate">' + resultado + "</span>");
    document.querySelector("[data-processo-chips]").innerHTML = chips.join("");

    var meta = [];
    if (data.numero_processo) meta.push("<span><strong>Processo</strong> " + data.numero_processo + "</span>");
    meta.push("<span><strong>Cliente</strong> " + (data.clientes ? data.clientes.nome : "—") + "</span>");
    if (data.ano) meta.push("<span><strong>Ano</strong> " + data.ano + "</span>");
    if (data.orgao_julgador) meta.push("<span><strong>Órgão julgador</strong> " + data.orgao_julgador + "</span>");
    document.querySelector("[data-processo-meta]").innerHTML = meta.join("");

    preencherFormulario(data);
  }

  async function carregarObrigacoes() {
    var { data, error } = await bfSupabase
      .from("obrigacoes")
      .select("*")
      .eq("processo_id", processoId)
      .order("prazo", { ascending: true, nullsFirst: false });

    var el = document.querySelector("[data-obrigacoes-resumo]");
    if (error) { console.error(error); el.innerHTML = '<span class="empty-note">Não foi possível carregar.</span>'; return; }
    var obrigacoes = data || [];

    el.innerHTML = obrigacoes.length
      ? '<div class="sidebar-list">' + obrigacoes.map(function (o) {
          return '<div class="sidebar-item">' +
            '<div class="t">' + LABELS.tipoObrigacao[o.tipo] + " " + statusBadge(o.status, o.prazo) + "</div>" +
            '<div class="d">' + o.descricao + "</div>" +
            '<div class="d">' + fmtMoeda(o.valor) + " · prazo " + fmtData(o.prazo) + "</div>" +
          "</div>";
        }).join("") + "</div>"
      : '<span class="empty-note">Nenhuma obrigação cadastrada ainda.</span>';
  }

  function iniciarFormularios() {
    document.getElementById("proc-categoria").addEventListener("change", atualizarCampoResultado);

    bindForm("processo", async function () {
      var categoria = val("proc-categoria");
      var resultado = categoria === "prestacao_contas" ? val("proc-resultado-select") : val("proc-resultado-texto");
      var payload = {
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
        observacoes: val("proc-observacoes"),
      };
      var { error } = await bfSupabase.from("processos").update(payload).eq("id", processoId);
      if (error) throw error;
      await carregarProcesso();
    });

    bindForm("obrigacao", async function () {
      var payload = {
        processo_id: processoId,
        tipo: val("obrigacao-tipo"),
        descricao: val("obrigacao-descricao"),
        valor: val("obrigacao-valor") ? Number(val("obrigacao-valor")) : null,
        exercicio_cumprimento: val("obrigacao-exercicio-cumprimento") ? Number(val("obrigacao-exercicio-cumprimento")) : null,
        prazo: val("obrigacao-prazo"),
        status: val("obrigacao-status") || "pendente",
      };
      if (!payload.tipo || !payload.descricao) throw new Error("preencha tipo e descrição");
      var { error } = await bfSupabase.from("obrigacoes").insert(payload);
      if (error) throw error;
      document.getElementById("form-obrigacao").reset();
      await carregarObrigacoes();
    });
  }

  async function init() {
    if (!processoId) {
      document.querySelector("[data-processo-titulo]").textContent = "Nenhum processo selecionado";
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

    await carregarProcesso();
    await carregarObrigacoes();
    iniciarFormularios();
  }

  init();
})();
