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

  var urlParams = new URLSearchParams(location.search);
  var numeroParam = urlParams.get("numero");
  var idParam = urlParams.get("id");
  var processoId = idParam; // resolvido para o uuid real assim que carregarProcesso() carregar
  var clienteId = null; // preenchido depois de carregar o processo
  var determinacaoEditandoId = null;
  var determinacoesCache = [];
  var advogadosCache = [];

  function fmtMoeda(v) {
    if (v === null || v === undefined) return "—";
    return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace(new RegExp(String.fromCharCode(160), "g"), " ");
  }
  function fmtData(v) {
    if (!v) return "—";
    return new Date(v + "T00:00:00").toLocaleDateString("pt-BR");
  }
  function fmtDataHora(v) {
    if (!v) return "—";
    return new Date(v).toLocaleString("pt-BR");
  }
  function fmtBytes(v) {
    if (!v) return "";
    if (v < 1024) return v + " B";
    if (v < 1024 * 1024) return (v / 1024).toFixed(0) + " KB";
    return (v / (1024 * 1024)).toFixed(1) + " MB";
  }
  function resultadoLabel(categoria, resultado) {
    if (!resultado) return null;
    if (categoria === "prestacao_contas") return LABELS.resultadoContas[resultado] || resultado;
    return resultado;
  }
  function statusBadge(status, prazo) {
    var vencida = status === "pendente" && prazo && new Date(prazo + "T00:00:00") < new Date();
    var key = vencida ? "vencida" : status;
    var label = vencida ? "Vencida" : LABELS.statusDeterminacao[status] || status;
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
  function boolVal(id) {
    var v = document.getElementById(id).value;
    return v === "" ? null : v === "true";
  }
  function setBoolField(id, v) {
    document.getElementById(id).value = v === true ? "true" : v === false ? "false" : "";
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
    document.querySelectorAll("[data-campo-contas]").forEach(function (el) {
      el.hidden = !isContas;
    });
  }

  async function carregarAdvogados() {
    var { data, error } = await bfSupabase
      .from("perfis")
      .select("id, nome")
      .eq("role", "escritorio")
      .order("nome");
    if (error) { console.error(error); return; }
    advogadosCache = data || [];
    var options = '<option value="">— não atribuído —</option>' +
      advogadosCache.map(function (a) { return '<option value="' + a.id + '">' + a.nome + "</option>"; }).join("");
    document.getElementById("proc-responsavel").innerHTML = options;
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
    document.getElementById("proc-data-protocolo").value = p.data_protocolo || "";
    document.getElementById("proc-responsavel").value = p.responsavel_id || "";
    setBoolField("proc-houve-recurso", p.houve_recurso);
    setBoolField("proc-transito-julgado", p.transito_julgado);
    document.getElementById("proc-data-transito").value = p.data_transito || "";
    document.getElementById("proc-observacoes").value = p.observacoes || "";

    atualizarCampoResultado();
    if (p.categoria === "prestacao_contas") {
      document.getElementById("proc-resultado-select").value = p.resultado || "";
    } else {
      document.getElementById("proc-resultado-texto").value = p.resultado || "";
    }
  }

  async function carregarProcesso() {
    var query = bfSupabase.from("processos").select("*, clientes(id, nome), perfis(nome)");
    query = numeroParam ? query.eq("numero_processo", numeroParam) : query.eq("id", idParam);
    var { data, error } = await query.limit(1).maybeSingle();
    if (error || !data) {
      document.querySelector("[data-processo-titulo]").textContent = "Processo não encontrado";
      return;
    }

    processoId = data.id; // uuid real — usado em todo o resto da página, independente de como a URL chegou
    if (data.numero_processo) {
      history.replaceState(null, "", "processo.html?numero=" + encodeURIComponent(data.numero_processo));
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
    chips.push('<span class="chip is-slate">' + (data.perfis ? data.perfis.nome : "Sem advogado atribuído") + "</span>");
    document.querySelector("[data-processo-chips]").innerHTML = chips.join("");

    var meta = [];
    if (data.numero_processo) meta.push("<span><strong>Processo</strong> " + data.numero_processo + "</span>");
    meta.push("<span><strong>Cliente</strong> " + (data.clientes ? data.clientes.nome : "—") + "</span>");
    if (data.ano) meta.push("<span><strong>Ano</strong> " + data.ano + "</span>");
    if (data.orgao_julgador) meta.push("<span><strong>Órgão julgador</strong> " + data.orgao_julgador + "</span>");
    document.querySelector("[data-processo-meta]").innerHTML = meta.join("");

    preencherFormulario(data);
  }

  async function carregarDeterminacoes() {
    var { data, error } = await bfSupabase
      .from("determinacoes")
      .select("*, perfis(nome)")
      .eq("processo_id", processoId)
      .order("prazo", { ascending: true, nullsFirst: false });

    var el = document.querySelector("[data-determinacoes-resumo]");
    if (error) { console.error(error); el.innerHTML = '<span class="empty-note">Não foi possível carregar.</span>'; return; }
    var determinacoes = data || [];

    determinacoesCache = determinacoes;

    el.innerHTML = determinacoes.length
      ? '<div class="sidebar-list">' + determinacoes.map(function (d) {
          return '<div class="sidebar-item">' +
            '<div class="t">' + LABELS.tipoDeterminacao[d.tipo] + " " + statusBadge(d.status, d.prazo) + "</div>" +
            '<div class="d">' + d.descricao + "</div>" +
            '<div class="d">' + fmtMoeda(d.valor) + " · prazo " + fmtData(d.prazo) + "</div>" +
            '<div class="d" style="margin-top:.5rem; display:flex; gap:.9rem;">' +
              '<button type="button" class="portal-inline-link" data-editar-determinacao="' + d.id + '">Editar</button>' +
              (d.status === "pendente"
                ? '<button type="button" class="portal-inline-link" data-marcar-cumprida="' + d.id + '">Marcar como cumprida</button>'
                : "") +
            "</div>" +
          "</div>";
        }).join("") + "</div>"
      : '<span class="empty-note">Nenhuma determinação cadastrada ainda.</span>';

    document.getElementById("documento-determinacao").innerHTML =
      '<option value="">— documento geral do processo —</option>' +
      determinacoes.map(function (d) {
        return '<option value="' + d.id + '">' + LABELS.tipoDeterminacao[d.tipo] + " — " + d.descricao + "</option>";
      }).join("");
  }

  var documentosCache = [];

  function renderDocumentos() {
    var el = document.querySelector("[data-documentos-lista]");
    el.innerHTML = documentosCache.length
      ? '<div class="sidebar-list">' + documentosCache.map(function (doc) {
          var vinculo = doc.determinacoes ? " · " + (LABELS.tipoDeterminacao[doc.determinacoes.tipo] || doc.determinacoes.tipo) : "";
          return '<div class="sidebar-item">' +
            '<div class="t">' + doc.nome_arquivo + "</div>" +
            '<div class="d">' + fmtBytes(doc.tamanho) + vinculo + "</div>" +
            '<div class="d">Enviado por ' + (doc.perfis ? doc.perfis.nome : "—") + " em " + fmtDataHora(doc.created_at) + "</div>" +
            '<div class="d" style="margin-top:.4rem; display:flex; gap:.9rem;">' +
              '<button type="button" class="portal-inline-link" data-abrir-documento="' + doc.storage_path + '">Abrir</button>' +
              '<button type="button" class="portal-inline-link" data-remover-documento="' + doc.id + '" data-storage-path="' + doc.storage_path + '">Remover</button>' +
            "</div>" +
          "</div>";
        }).join("") + "</div>"
      : '<span class="empty-note">Nenhum documento anexado ainda.</span>';
  }

  async function carregarDocumentos() {
    var { data, error } = await bfSupabase
      .from("documentos")
      .select("*, perfis(nome), determinacoes(tipo)")
      .eq("processo_id", processoId)
      .order("created_at", { ascending: false });

    var el = document.querySelector("[data-documentos-lista]");
    if (error) { console.error(error); el.innerHTML = '<span class="empty-note">Não foi possível carregar.</span>'; return; }

    documentosCache = data || [];
    renderDocumentos();
  }

  function atualizarCampoCumprimento() {
    var isCumprida = document.getElementById("determinacao-status").value === "cumprida";
    document.querySelector("[data-campo-cumprimento]").hidden = !isCumprida;
  }

  function preencherFormularioDeterminacao(d) {
    document.getElementById("determinacao-tipo").value = d.tipo;
    document.getElementById("determinacao-descricao").value = d.descricao || "";
    document.getElementById("determinacao-valor").value = d.valor === null ? "" : BF.formatarMoeda(d.valor);
    document.getElementById("determinacao-exercicio-cumprimento").value = d.exercicio_cumprimento || "";
    document.getElementById("determinacao-prazo").value = d.prazo || "";
    document.getElementById("determinacao-status").value = d.status || "pendente";
    document.getElementById("determinacao-data-cumprimento").value = d.data_cumprimento || "";
    document.getElementById("determinacao-observacoes").value = d.observacoes || "";
    atualizarCampoCumprimento();

    determinacaoEditandoId = d.id;
    document.querySelector("[data-determinacao-form-titulo]").textContent = "Editar determinação";
    document.querySelector("[data-determinacao-form-botao]").textContent = "Salvar alterações";
    document.querySelector("[data-cancelar-edicao-determinacao]").hidden = false;
    document.getElementById("form-determinacao").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function resetFormularioDeterminacao() {
    determinacaoEditandoId = null;
    document.getElementById("form-determinacao").reset();
    atualizarCampoCumprimento();
    document.querySelector("[data-determinacao-form-titulo]").textContent = "Nova determinação";
    document.querySelector("[data-determinacao-form-botao]").textContent = "Salvar determinação";
    document.querySelector("[data-cancelar-edicao-determinacao]").hidden = true;
  }

  function iniciarFormularios() {
    document.getElementById("proc-categoria").addEventListener("change", atualizarCampoResultado);
    document.getElementById("determinacao-status").addEventListener("change", atualizarCampoCumprimento);
    atualizarCampoCumprimento();

    document.getElementById("determinacao-valor").addEventListener("input", function (e) {
      e.target.value = BF.mascararMoeda(e.target.value);
    });

    document.querySelector("[data-cancelar-edicao-determinacao]").addEventListener("click", resetFormularioDeterminacao);

    document.querySelector("[data-excluir-processo]").addEventListener("click", async function () {
      var ok = await BF.confirmar(
        "Isso exclui o processo, todas as determinações e documentos vinculados a ele. Não é possível desfazer.",
        { titulo: "Excluir processo?", textoConfirmar: "Excluir processo" }
      );
      if (!ok) return;
      setMsg("excluir-processo", "Excluindo…", false);
      var { error } = await bfSupabase.from("processos").delete().eq("id", processoId);
      if (error) {
        console.error(error);
        setMsg("excluir-processo", "Erro ao excluir: " + error.message, true);
        return;
      }
      window.location.href = clienteId ? "cliente.html?id=" + clienteId : "clientes.html";
    });

    document.querySelector("[data-determinacoes-resumo]").addEventListener("click", async function (e) {
      var editarId = e.target.getAttribute("data-editar-determinacao");
      var cumpridaId = e.target.getAttribute("data-marcar-cumprida");

      if (editarId) {
        var d = determinacoesCache.find(function (item) { return item.id === editarId; });
        if (d) preencherFormularioDeterminacao(d);
        return;
      }

      if (cumpridaId) {
        e.target.disabled = true;
        var hoje = new Date().toISOString().slice(0, 10);
        var { error } = await bfSupabase
          .from("determinacoes")
          .update({ status: "cumprida", data_cumprimento: hoje })
          .eq("id", cumpridaId);
        if (error) {
          console.error(error);
          e.target.disabled = false;
          return;
        }
        if (determinacaoEditandoId === cumpridaId) resetFormularioDeterminacao();
        await carregarDeterminacoes();
      }
    });

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
        data_protocolo: val("proc-data-protocolo"),
        responsavel_id: val("proc-responsavel"),
        houve_recurso: categoria === "prestacao_contas" ? boolVal("proc-houve-recurso") : null,
        transito_julgado: categoria === "prestacao_contas" ? boolVal("proc-transito-julgado") : null,
        data_transito: categoria === "prestacao_contas" ? val("proc-data-transito") : null,
        observacoes: val("proc-observacoes"),
      };
      if (!payload.numero_processo) throw new Error("preencha o número do processo");
      var { error } = await bfSupabase.from("processos").update(payload).eq("id", processoId);
      if (error) throw error;
      await carregarProcesso();
    });

    bindForm("determinacao", async function () {
      var status = val("determinacao-status") || "pendente";
      var payload = {
        processo_id: processoId,
        tipo: val("determinacao-tipo"),
        descricao: val("determinacao-descricao"),
        valor: BF.desmascararMoeda(val("determinacao-valor")),
        exercicio_cumprimento: val("determinacao-exercicio-cumprimento") ? Number(val("determinacao-exercicio-cumprimento")) : null,
        prazo: val("determinacao-prazo"),
        status: status,
        data_cumprimento: status === "cumprida" ? val("determinacao-data-cumprimento") : null,
        observacoes: val("determinacao-observacoes"),
      };
      if (!payload.tipo || !payload.descricao) throw new Error("preencha tipo e descrição");

      var error;
      if (determinacaoEditandoId) {
        ({ error } = await bfSupabase.from("determinacoes").update(payload).eq("id", determinacaoEditandoId));
      } else {
        ({ error } = await bfSupabase.from("determinacoes").insert(payload));
      }
      if (error) throw error;
      resetFormularioDeterminacao();
      await carregarDeterminacoes();
    });

    document.querySelector("[data-documentos-lista]").addEventListener("click", async function (e) {
      var abrirPath = e.target.getAttribute("data-abrir-documento");
      var removerId = e.target.getAttribute("data-remover-documento");

      if (abrirPath) {
        e.target.disabled = true;
        var { data, error } = await bfSupabase.storage.from("documentos").createSignedUrl(abrirPath, 60);
        e.target.disabled = false;
        if (error) { console.error(error); return; }
        window.open(data.signedUrl, "_blank");
        return;
      }

      if (removerId) {
        var storagePath = e.target.getAttribute("data-storage-path");
        e.target.disabled = true;
        await bfSupabase.storage.from("documentos").remove([storagePath]);
        var { error: delError } = await bfSupabase.from("documentos").delete().eq("id", removerId);
        if (delError) { console.error(delError); e.target.disabled = false; return; }
        await carregarDocumentos();
      }
    });

    bindForm("documento", async function () {
      var input = document.getElementById("documento-arquivo");
      var file = input.files[0];
      if (!file) throw new Error("escolha um arquivo");

      var path = processoId + "/" + Date.now() + "-" + file.name;
      var { error: uploadError } = await bfSupabase.storage.from("documentos").upload(path, file);
      if (uploadError) throw uploadError;

      var { data: { session } } = await bfSupabase.auth.getSession();
      var { error } = await bfSupabase.from("documentos").insert({
        processo_id: processoId,
        determinacao_id: val("documento-determinacao"),
        nome_arquivo: file.name,
        storage_path: path,
        tamanho: file.size,
        tipo_mime: file.type,
        enviado_por: session.user.id,
      });
      if (error) throw error;

      document.getElementById("form-documento").reset();
      await carregarDocumentos();
    });
  }

  async function init() {
    if (!numeroParam && !idParam) {
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

    await carregarAdvogados();
    await carregarProcesso();
    await carregarDeterminacoes();
    await carregarDocumentos();
    iniciarFormularios();
  }

  init();
})();
