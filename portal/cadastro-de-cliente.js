(function () {
  "use strict";

  var estado = { categoria: null };
  var partidosCache = [];
  var partidoPicker = null;

  function resetMunicipioSelect() {
    var sel = document.getElementById("cad-municipio");
    sel.innerHTML = '<option value="">— selecione a UF primeiro —</option>';
    sel.disabled = true;
  }

  var LABELS_NOME = { candidato: "Nome do candidato", pessoa_fisica: "Nome completo", pessoa_juridica: "Razão social" };
  var LABELS_DOC = { candidato: "CPF", pessoa_fisica: "CPF", pessoa_juridica: "CNPJ" };
  var PLACEHOLDERS_DOC = { candidato: "000.000.000-00", pessoa_fisica: "000.000.000-00", pessoa_juridica: "00.000.000/0000-00" };

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
  function toggle(selector, mostrar) {
    document.querySelectorAll(selector).forEach(function (el) { el.hidden = !mostrar; });
  }

  async function carregarPartidos() {
    var { data, error } = await bfSupabase.from("partidos").select("*").order("sigla");
    if (error) { console.error(error); return; }
    partidosCache = data || [];
  }

  function partidoSelecionado() {
    var id = val("cad-partido-id");
    return partidosCache.filter(function (p) { return p.id === id; })[0] || null;
  }

  function cargoEscopoAtual() {
    return BF.escopoCargo(document.getElementById("cad-cargo").value);
  }

  async function atualizarNomeGeradoEHierarquia() {
    if (estado.categoria !== "partido") return;
    var inst = document.getElementById("cad-instancia").value;
    var partido = partidoSelecionado();
    var uf = val("cad-uf");
    var municipio = val("cad-municipio");
    var nome = partido ? BF.gerarNomeCliente(partido.nome, inst, uf, municipio) : "";
    document.getElementById("cad-nome-gerado").value = nome;
    document.getElementById("cad-partido-cnpj").value = partido && partido.cnpj ? partido.cnpj : "";

    var hint = document.querySelector("[data-hierarquia-hint]");
    hint.classList.remove("is-error");
    if (!partido || (inst !== "diretorio_estadual" && inst !== "diretorio_municipal")) {
      hint.textContent = "";
      return;
    }
    if (inst === "diretorio_municipal" && !uf) {
      hint.textContent = "";
      return;
    }
    hint.textContent = "Verificando instância superior…";
    var superior = await BF.encontrarSuperior(inst, partido.id, uf);
    hint.textContent = superior
      ? "Vinculado automaticamente a: " + superior.nome
      : "Instância superior ainda não cadastrada — o cadastro segue normalmente, você pode vincular depois.";
  }

  function atualizarCampos() {
    var cat = estado.categoria;
    var ehPartido = cat === "partido";
    var ehCandidato = cat === "candidato";
    var ehPF = cat === "pessoa_fisica";
    var ehPJ = cat === "pessoa_juridica";
    var inst = ehPartido ? document.getElementById("cad-instancia").value : null;
    var escopo = ehCandidato ? cargoEscopoAtual() : null;

    toggle("[data-campo-nome]", ehCandidato || ehPF || ehPJ);
    toggle("[data-campo-documento]", ehCandidato || ehPF || ehPJ);
    toggle("[data-campo-partido]", ehPartido || ehCandidato);
    toggle("[data-campo-instancia]", ehPartido);
    toggle("[data-campo-cargo]", ehCandidato);
    toggle("[data-campo-cargo-outro]", ehCandidato && document.getElementById("cad-cargo").value === "outro");
    toggle("[data-campo-ano]", ehCandidato);
    toggle("[data-campo-nome-gerado]", ehPartido);
    toggle("[data-campo-partido-cnpj]", ehPartido);

    var precisaUf = (ehPartido && (inst === "diretorio_estadual" || inst === "diretorio_municipal"))
      || (ehCandidato && (escopo === "uf" || escopo === "municipio" || escopo === "livre"))
      || ehPF || ehPJ;
    var precisaMunicipio = (ehPartido && inst === "diretorio_municipal")
      || (ehCandidato && (escopo === "municipio" || escopo === "livre"))
      || ehPF || ehPJ;
    toggle("[data-campo-uf]", precisaUf);
    toggle("[data-campo-municipio]", precisaMunicipio);

    if (ehCandidato || ehPF || ehPJ) {
      var labelNome = document.querySelector('label[for="cad-nome"]');
      var labelDoc = document.querySelector('label[for="cad-documento"]');
      if (labelNome) labelNome.textContent = LABELS_NOME[cat];
      if (labelDoc) labelDoc.textContent = LABELS_DOC[cat];
      document.getElementById("cad-documento").placeholder = PLACEHOLDERS_DOC[cat];
    }
    document.getElementById("cad-nome").required = ehCandidato || ehPF || ehPJ;

    atualizarNomeGeradoEHierarquia();
  }

  function selecionarCategoria(cat) {
    document.getElementById("form-cliente-cadastro").reset();
    if (partidoPicker) partidoPicker.clear();
    resetMunicipioSelect();
    document.querySelector("[data-hierarquia-hint]").textContent = "";
    estado.categoria = cat;
    document.querySelectorAll("[data-categoria-btn]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-categoria-btn") === cat);
    });
    document.querySelector("[data-secao-form]").hidden = false;
    atualizarCampos();
  }

  function resetFormulario() {
    document.getElementById("form-cliente-cadastro").reset();
    if (partidoPicker) partidoPicker.clear();
    resetMunicipioSelect();
    document.querySelector("[data-hierarquia-hint]").textContent = "";
    document.querySelectorAll("[data-categoria-btn]").forEach(function (btn) { btn.classList.remove("is-active"); });
    document.querySelector("[data-secao-form]").hidden = true;
    estado.categoria = null;
  }

  async function salvarCliente() {
    var cat = estado.categoria;
    if (!cat) throw new Error("selecione o que deseja cadastrar");

    var payload = {
      nome: null, documento: null, tipo_cliente: null, partido_id: null,
      uf: null, municipio: null, parent_id: null, cargo_disputado: null, ano_eleicao: null,
    };

    if (cat === "partido") {
      var inst = document.getElementById("cad-instancia").value;
      if (!inst) throw new Error("selecione a instância do partido");
      var partido = partidoSelecionado();
      if (!partido) throw new Error("selecione o partido");
      var uf = (inst === "diretorio_estadual" || inst === "diretorio_municipal") ? val("cad-uf") : null;
      var municipio = inst === "diretorio_municipal" ? val("cad-municipio") : null;
      if ((inst === "diretorio_estadual" || inst === "diretorio_municipal") && !uf) throw new Error("informe a UF");
      if (inst === "diretorio_municipal" && !municipio) throw new Error("informe o município");

      var nome = BF.gerarNomeCliente(partido.nome, inst, uf, municipio);
      if (!nome) throw new Error("não foi possível gerar o nome do cliente");

      var superior = await BF.encontrarSuperior(inst, partido.id, uf);

      payload.tipo_cliente = inst;
      payload.partido_id = partido.id;
      payload.uf = uf;
      payload.municipio = municipio;
      payload.nome = nome;
      payload.parent_id = superior ? superior.id : null;

      var cnpjPartido = val("cad-partido-cnpj");
      if (cnpjPartido && cnpjPartido !== partido.cnpj) {
        var { error: cnpjError } = await bfSupabase.from("partidos").update({ cnpj: cnpjPartido }).eq("id", partido.id);
        if (cnpjError) throw cnpjError;
      }
    } else if (cat === "candidato") {
      var cargoValor = document.getElementById("cad-cargo").value;
      payload.tipo_cliente = "candidato";
      payload.nome = val("cad-nome");
      payload.documento = val("cad-documento");
      var partidoCand = partidoSelecionado();
      payload.partido_id = partidoCand ? partidoCand.id : null;
      payload.cargo_disputado = cargoValor === "outro" ? val("cad-cargo-outro") : BF.labelCargo(cargoValor);
      payload.ano_eleicao = val("cad-ano-eleicao") ? Number(val("cad-ano-eleicao")) : null;
      payload.uf = val("cad-uf");
      payload.municipio = val("cad-municipio");
      if (!payload.nome) throw new Error("preencha o nome do candidato");
    } else {
      payload.tipo_cliente = cat;
      payload.nome = val("cad-nome");
      payload.documento = val("cad-documento");
      payload.uf = val("cad-uf");
      payload.municipio = val("cad-municipio");
      if (!payload.nome) throw new Error("preencha o nome");
    }

    var { error } = await bfSupabase.from("clientes").insert(payload);
    if (error) throw error;
  }

  function iniciarFormularios() {
    document.getElementById("cad-uf").innerHTML = BF.opcoesUF();
    document.getElementById("cad-cargo").innerHTML = BF.opcoesCargo();

    document.querySelectorAll("[data-categoria-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () { selecionarCategoria(btn.getAttribute("data-categoria-btn")); });
    });

    document.getElementById("cad-documento").addEventListener("input", function (e) {
      e.target.value = BF.mascararDocumento(e.target.value);
    });
    document.getElementById("cad-partido-cnpj").addEventListener("input", function (e) {
      e.target.value = BF.mascararDocumento(e.target.value);
    });

    partidoPicker = BF.criarPartidoPicker({
      inputEl: document.getElementById("cad-partido-busca"),
      hiddenEl: document.getElementById("cad-partido-id"),
      listEl: document.getElementById("cad-partido-lista"),
      getPartidos: function () { return partidosCache; },
      onChange: atualizarNomeGeradoEHierarquia,
    });

    document.querySelector("[data-abrir-novo-partido]").addEventListener("click", async function () {
      var partido = await BF.abrirModalNovoPartido();
      if (!partido) return;
      partidosCache.push(partido);
      partidoPicker.setValue(partido);
      atualizarNomeGeradoEHierarquia();
    });

    document.getElementById("cad-instancia").addEventListener("change", atualizarCampos);
    document.getElementById("cad-uf").addEventListener("change", async function () {
      await BF.carregarMunicipiosNoSelect("cad-municipio", val("cad-uf"), null);
      atualizarNomeGeradoEHierarquia();
    });
    document.getElementById("cad-municipio").addEventListener("change", atualizarNomeGeradoEHierarquia);
    document.getElementById("cad-cargo").addEventListener("change", atualizarCampos);

    document.querySelector('[data-form="cliente-cadastro"]').addEventListener("submit", async function (e) {
      e.preventDefault();
      setMsg("cliente-cadastro", "Salvando…", false);
      try {
        await salvarCliente();
        setMsg("cliente-cadastro", "Salvo com sucesso.", false);
        resetFormulario();
      } catch (err) {
        console.error(err);
        setMsg("cliente-cadastro", "Erro ao salvar: " + (err.message || "tente novamente."), true);
      }
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

    await carregarPartidos();
    iniciarFormularios();
  }

  init();
})();
