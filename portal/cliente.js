(function () {
  "use strict";

  var LABELS = {
    tipo_cliente: {
      diretorio_nacional: "Diretório Nacional",
      diretorio_estadual: "Diretório Estadual",
      diretorio_municipal: "Diretório Municipal",
      candidato: "Candidato",
      pessoa_fisica: "Pessoa física",
      pessoa_juridica: "Pessoa jurídica",
    },
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
  var DIRETORIOS = ["diretorio_nacional", "diretorio_estadual", "diretorio_municipal"];

  function linkProcesso(p) {
    return p.numero_processo ? "processo.html?numero=" + encodeURIComponent(p.numero_processo) : "processo.html?id=" + p.id;
  }

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
    document.querySelectorAll("[data-campo-contas]").forEach(function (el) {
      el.hidden = !isContas;
    });
  }
  function boolVal(id) {
    var v = document.getElementById(id).value;
    return v === "" ? null : v === "true";
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
    var tipoLabel = LABELS.tipo_cliente[data.tipo_cliente] || data.tipo_cliente;
    if (data.tipo_cliente === "candidato") {
      partes.push(tipoLabel + (data.cargo_disputado ? " a " + data.cargo_disputado : "") + (data.ano_eleicao ? " · " + data.ano_eleicao : ""));
    } else {
      partes.push(tipoLabel);
    }
    if (data.partidos) partes.push(data.partidos.sigla ? data.partidos.sigla + " — " + data.partidos.nome : data.partidos.nome);
    if ([data.uf, data.municipio].filter(Boolean).length) partes.push([data.uf, data.municipio].filter(Boolean).join(" / "));
    document.querySelector("[data-cliente-info]").textContent = partes.length ? partes.join(" · ") : "Cliente sem categoria definida";

    await preencherFormularioEdicao(data);
  }

  var partidoPickerEdicao = null;

  function partidoSelecionadoEdicao() {
    var id = val("edit-partido-id");
    return partidosCache.filter(function (p) { return p.id === id; })[0] || null;
  }

  async function atualizarNomeGeradoEHierarquiaEdicao() {
    var tipo = document.getElementById("edit-tipo-cliente").value;
    var hint = document.querySelector("[data-hierarquia-hint-edit]");
    if (DIRETORIOS.indexOf(tipo) === -1) { hint.textContent = ""; return; }

    var partido = partidoSelecionadoEdicao();
    var uf = val("edit-uf");
    var municipio = val("edit-municipio");
    document.getElementById("edit-nome-gerado").value = partido ? BF.gerarNomeCliente(partido.nome, tipo, uf, municipio) : "";
    document.getElementById("edit-partido-cnpj").value = partido && partido.cnpj ? partido.cnpj : "";

    hint.textContent = "";
    if (!partido || tipo === "diretorio_nacional") return;
    if (tipo === "diretorio_municipal" && !uf) return;
    hint.textContent = "Verificando instância superior…";
    var superior = await BF.encontrarSuperior(tipo, partido.id, uf);
    hint.textContent = superior
      ? "Vinculado automaticamente a: " + superior.nome
      : "Instância superior ainda não cadastrada — a alteração é salva normalmente.";
  }

  function atualizarCamposClienteEdicao() {
    var tipo = document.getElementById("edit-tipo-cliente").value;
    var ehDiretorio = DIRETORIOS.indexOf(tipo) !== -1;
    var ehCandidato = tipo === "candidato";
    var ehPF = tipo === "pessoa_fisica";
    var ehPJ = tipo === "pessoa_juridica";
    var escopo = ehCandidato ? BF.escopoCargo(document.getElementById("edit-cargo").value) : null;

    document.querySelectorAll("[data-campo-nome]").forEach(function (el) { el.hidden = ehDiretorio; });
    document.querySelectorAll("[data-campo-documento]").forEach(function (el) { el.hidden = ehDiretorio; });
    document.querySelectorAll("[data-campo-cnpj-campanha]").forEach(function (el) { el.hidden = !ehCandidato; });
    document.querySelectorAll("[data-campo-partido]").forEach(function (el) { el.hidden = !(ehDiretorio || ehCandidato); });
    document.querySelectorAll("[data-campo-nome-gerado]").forEach(function (el) { el.hidden = !ehDiretorio; });
    document.querySelectorAll("[data-campo-partido-cnpj]").forEach(function (el) { el.hidden = !ehDiretorio; });
    document.querySelectorAll("[data-campo-cargo]").forEach(function (el) { el.hidden = !ehCandidato; });
    document.querySelectorAll("[data-campo-cargo-outro]").forEach(function (el) {
      el.hidden = !(ehCandidato && document.getElementById("edit-cargo").value === "outro");
    });
    document.querySelectorAll("[data-campo-ano]").forEach(function (el) { el.hidden = !ehCandidato; });

    var precisaUf = (ehDiretorio && tipo !== "diretorio_nacional")
      || (ehCandidato && (escopo === "uf" || escopo === "municipio" || escopo === "livre"))
      || ehPF || ehPJ;
    var precisaMunicipio = tipo === "diretorio_municipal"
      || (ehCandidato && (escopo === "municipio" || escopo === "livre"))
      || ehPF || ehPJ;
    document.querySelectorAll("[data-campo-uf]").forEach(function (el) { el.hidden = !precisaUf; });
    document.querySelectorAll("[data-campo-municipio]").forEach(function (el) { el.hidden = !precisaMunicipio; });

    document.getElementById("edit-nome").required = !ehDiretorio;

    atualizarNomeGeradoEHierarquiaEdicao();
  }

  async function carregarAdvogados() {
    var { data, error } = await bfSupabase
      .from("perfis")
      .select("id, nome")
      .eq("role", "escritorio")
      .order("nome");
    if (error) { console.error(error); return; }
    var options = (data || []).map(function (a) { return '<option value="' + a.id + '">' + a.nome + "</option>"; }).join("");
    document.getElementById("proc-responsavel").innerHTML = '<option value="">— não atribuído —</option>' + options;
  }

  var partidosCache = [];

  async function carregarPartidosParaEdicao() {
    var { data, error } = await bfSupabase.from("partidos").select("*").order("sigla");
    if (error) { console.error(error); return; }
    partidosCache = data || [];
  }

  async function preencherFormularioEdicao(data) {
    document.getElementById("edit-nome").value = data.nome || "";
    document.getElementById("edit-documento").value = data.documento || "";
    document.getElementById("edit-cnpj-campanha").value = data.cnpj_campanha || "";
    document.getElementById("edit-tipo-cliente").value = data.tipo_cliente;
    var partido = data.partido_id ? partidosCache.filter(function (p) { return p.id === data.partido_id; })[0] : null;
    if (partidoPickerEdicao) partidoPickerEdicao.setValue(partido);
    document.getElementById("edit-uf").value = data.uf || "";
    await BF.carregarMunicipiosNoSelect("edit-municipio", data.uf, data.municipio);
    var cargoValor = BF.valorPorLabelCargo(data.cargo_disputado);
    document.getElementById("edit-cargo").value = cargoValor || (data.cargo_disputado ? "outro" : "");
    document.getElementById("edit-cargo-outro").value = cargoValor ? "" : (data.cargo_disputado || "");
    document.getElementById("edit-ano-eleicao").value = data.ano_eleicao || "";
    atualizarCamposClienteEdicao();
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
      chips.push('<span class="chip">' + (p.perfis ? p.perfis.nome : "Sem advogado") + "</span>");
      return '<a class="case-row" href="' + linkProcesso(p) + '">' +
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
      .select("*, perfis(nome)")
      .eq("cliente_id", clienteId)
      .order("ano", { ascending: false });
    if (error) {
      console.error(error);
      document.querySelector('[data-list="processos"]').innerHTML =
        '<span class="empty-note">Não foi possível carregar os processos: ' + error.message + "</span>";
      return;
    }
    processosCache = data || [];
    aplicarFiltroProcessos();
  }

  function iniciarFormularios() {
    document.getElementById("proc-categoria").addEventListener("change", atualizarCampoResultado);
    atualizarCampoResultado();

    document.getElementById("edit-uf").innerHTML = BF.opcoesUF();
    document.getElementById("edit-cargo").innerHTML = BF.opcoesCargo();

    document.getElementById("edit-documento").addEventListener("input", function (e) {
      e.target.value = BF.mascararDocumento(e.target.value);
    });
    document.getElementById("edit-partido-cnpj").addEventListener("input", function (e) {
      e.target.value = BF.mascararDocumento(e.target.value);
    });
    document.getElementById("edit-cnpj-campanha").addEventListener("input", function (e) {
      e.target.value = BF.mascararDocumento(e.target.value);
    });

    partidoPickerEdicao = BF.criarPartidoPicker({
      inputEl: document.getElementById("edit-partido-busca"),
      hiddenEl: document.getElementById("edit-partido-id"),
      listEl: document.getElementById("edit-partido-lista"),
      getPartidos: function () { return partidosCache; },
      onChange: atualizarNomeGeradoEHierarquiaEdicao,
    });

    document.querySelector("[data-abrir-novo-partido-edit]").addEventListener("click", async function () {
      var partido = await BF.abrirModalNovoPartido();
      if (!partido) return;
      partidosCache.push(partido);
      partidoPickerEdicao.setValue(partido);
      atualizarNomeGeradoEHierarquiaEdicao();
    });

    document.getElementById("edit-tipo-cliente").addEventListener("change", atualizarCamposClienteEdicao);
    document.getElementById("edit-uf").addEventListener("change", async function () {
      await BF.carregarMunicipiosNoSelect("edit-municipio", val("edit-uf"), null);
      atualizarNomeGeradoEHierarquiaEdicao();
    });
    document.getElementById("edit-municipio").addEventListener("change", atualizarNomeGeradoEHierarquiaEdicao);
    document.getElementById("edit-cargo").addEventListener("change", atualizarCamposClienteEdicao);

    document.querySelector("[data-toggle-novo-processo]").addEventListener("click", function () {
      var box = document.querySelector("[data-novo-processo-box]");
      box.hidden = !box.hidden;
    });

    document.querySelector("[data-toggle-editar-cliente]").addEventListener("click", function () {
      var box = document.querySelector("[data-editar-cliente-box]");
      box.hidden = !box.hidden;
    });

    document.querySelector("[data-excluir-cliente]").addEventListener("click", async function () {
      var ok = await BF.confirmar(
        "Isso exclui o cliente e todos os processos, determinações e documentos vinculados a ele. Não é possível desfazer.",
        { titulo: "Excluir cliente?", textoConfirmar: "Excluir cliente" }
      );
      if (!ok) return;
      setMsg("excluir-cliente", "Excluindo…", false);
      var { error } = await bfSupabase.from("clientes").delete().eq("id", clienteId);
      if (error) {
        console.error(error);
        var msg = "Erro ao excluir: " + error.message;
        if (error.code === "23503") {
          if (error.message.indexOf("parent_id") !== -1) {
            msg = "Este cliente ainda tem diretórios vinculados abaixo dele na hierarquia — exclua ou reatribua esses clientes primeiro.";
          } else if (error.message.indexOf("perfis") !== -1) {
            msg = "Este cliente ainda tem login(s) de acesso ativos — remova os acessos antes de excluir.";
          } else {
            msg = "Não é possível excluir: existem outros registros vinculados a este cliente.";
          }
        }
        setMsg("excluir-cliente", msg, true);
        return;
      }
      window.location.href = "clientes.html";
    });

    bindForm("cliente-editar", async function () {
      var tipo = document.getElementById("edit-tipo-cliente").value;
      var ehDiretorio = DIRETORIOS.indexOf(tipo) !== -1;
      var ehCandidato = tipo === "candidato";
      var partido = (ehDiretorio || ehCandidato) ? partidoSelecionadoEdicao() : null;

      var payload = {
        nome: null, documento: null, tipo_cliente: tipo,
        partido_id: partido ? partido.id : null,
        uf: null, municipio: null, parent_id: null,
        cargo_disputado: null, ano_eleicao: null, cnpj_campanha: null,
      };

      if (ehDiretorio) {
        if (!partido) throw new Error("selecione o partido");
        var uf = tipo !== "diretorio_nacional" ? val("edit-uf") : null;
        var municipio = tipo === "diretorio_municipal" ? val("edit-municipio") : null;
        if (tipo !== "diretorio_nacional" && !uf) throw new Error("informe a UF");
        if (tipo === "diretorio_municipal" && !municipio) throw new Error("informe o município");
        var nome = BF.gerarNomeCliente(partido.nome, tipo, uf, municipio);
        if (!nome) throw new Error("não foi possível gerar o nome do cliente");
        var superior = await BF.encontrarSuperior(tipo, partido.id, uf);
        payload.uf = uf;
        payload.municipio = municipio;
        payload.nome = nome;
        payload.parent_id = superior ? superior.id : null;

        var cnpjPartido = val("edit-partido-cnpj");
        if (cnpjPartido && cnpjPartido !== partido.cnpj) {
          var { error: cnpjError } = await bfSupabase.from("partidos").update({ cnpj: cnpjPartido }).eq("id", partido.id);
          if (cnpjError) throw cnpjError;
        }
      } else if (ehCandidato) {
        var cargoValor = document.getElementById("edit-cargo").value;
        payload.nome = val("edit-nome");
        payload.documento = val("edit-documento");
        payload.cnpj_campanha = val("edit-cnpj-campanha");
        payload.cargo_disputado = cargoValor === "outro" ? val("edit-cargo-outro") : BF.labelCargo(cargoValor);
        payload.ano_eleicao = val("edit-ano-eleicao") ? Number(val("edit-ano-eleicao")) : null;
        payload.uf = val("edit-uf");
        payload.municipio = val("edit-municipio");
        if (!payload.nome) throw new Error("preencha o nome do candidato");
      } else {
        payload.nome = val("edit-nome");
        payload.documento = val("edit-documento");
        payload.uf = val("edit-uf");
        payload.municipio = val("edit-municipio");
        if (!payload.nome) throw new Error("preencha o nome");
      }

      var { error } = await bfSupabase.from("clientes").update(payload).eq("id", clienteId);
      if (error) throw error;
      await carregarCliente();
      document.querySelector("[data-editar-cliente-box]").hidden = true;
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
        data_protocolo: val("proc-data-protocolo"),
        responsavel_id: val("proc-responsavel"),
        houve_recurso: categoria === "prestacao_contas" ? boolVal("proc-houve-recurso") : null,
        transito_julgado: categoria === "prestacao_contas" ? boolVal("proc-transito-julgado") : null,
        data_transito: categoria === "prestacao_contas" ? val("proc-data-transito") : null,
      };
      if (!payload.categoria) throw new Error("selecione a categoria");
      if (!payload.numero_processo) throw new Error("preencha o número do processo");
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

    await carregarAdvogados();
    await carregarPartidosParaEdicao();
    iniciarFormularios();
    await carregarCliente();
    await carregarProcessos();
  }

  init();
})();
