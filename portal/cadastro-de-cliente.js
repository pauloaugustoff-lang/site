(function () {
  "use strict";

  function clienteDepth(path) {
    return path ? path.split(".").length - 1 : 0;
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
  function tipoSelecionado() {
    var el = document.querySelector('input[name="cad-tipo"]:checked');
    return el ? el.value : "nenhum";
  }

  function mascararDocumento(valor) {
    var digitos = valor.replace(/\D/g, "").slice(0, 14);
    if (digitos.length <= 11) {
      // CPF: 000.000.000-00
      return digitos
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    // CNPJ: 00.000.000/0000-00
    return digitos
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }
  async function carregarPartidos() {
    var { data, error } = await bfSupabase.from("partidos").select("*").order("sigla");
    if (error) { console.error(error); return; }

    var options = (data || []).map(function (p) { return '<option value="' + p.id + '">' + p.sigla + " — " + p.nome + "</option>"; }).join("");
    document.getElementById("cad-partido").innerHTML =
      '<option value="">— não vinculado a partido —</option>' + options;
  }

  async function carregarClientes() {
    var { data, error } = await bfSupabase
      .from("clientes")
      .select("id, nome, path")
      .order("path");
    if (error) { console.error(error); return; }

    var options = (data || []).map(function (c) {
      var indent = "— ".repeat(clienteDepth(c.path));
      return '<option value="' + c.id + '">' + indent + c.nome + "</option>";
    }).join("");

    document.getElementById("cad-pai").innerHTML =
      '<option value="">— nenhum (é o órgão nacional) —</option>' + options;
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
        atualizarCamposCliente();
      } catch (err) {
        console.error(err);
        setMsg(key, "Erro ao salvar: " + (err.message || "tente novamente."), true);
      }
    });
  }

  function atualizarCamposCliente() {
    var tipo = tipoSelecionado();
    var ehPartido = tipo === "orgao";
    var ehCandidato = tipo === "candidato";
    var precisaPartido = ehPartido || ehCandidato;

    document.querySelectorAll("[data-campo-partido]").forEach(function (el) {
      el.hidden = !precisaPartido;
    });
    document.querySelectorAll("[data-campo-orgao]").forEach(function (el) {
      el.hidden = !ehPartido;
    });
    document.querySelectorAll("[data-campo-candidato]").forEach(function (el) {
      el.hidden = !ehCandidato;
    });
    if (!precisaPartido) {
      document.querySelector("[data-novo-partido-box]").hidden = true;
    }
  }

  async function salvarNovoPartido(sigla, nome) {
    var { data, error } = await bfSupabase.from("partidos").insert({ sigla: sigla, nome: nome }).select().single();
    if (error) throw error;
    return data;
  }

  function iniciarFormularios() {
    // Força "nenhum" no carregamento — alguns navegadores restauram a
    // seleção de radio de uma visita anterior ao recarregar a página.
    document.querySelector('input[name="cad-tipo"][value="nenhum"]').checked = true;

    document.querySelectorAll('input[name="cad-tipo"]').forEach(function (radio) {
      radio.addEventListener("change", atualizarCamposCliente);
    });
    atualizarCamposCliente();

    document.getElementById("cad-documento").addEventListener("input", function (e) {
      e.target.value = mascararDocumento(e.target.value);
    });

    document.querySelector("[data-toggle-novo-partido]").addEventListener("click", function () {
      var box = document.querySelector("[data-novo-partido-box]");
      box.hidden = !box.hidden;
    });

    document.querySelector("[data-salvar-novo-partido]").addEventListener("click", async function () {
      var sigla = val("novo-partido-sigla");
      var nome = val("novo-partido-nome");
      if (!sigla || !nome) {
        setMsg("novo-partido", "preencha sigla e nome", true);
        return;
      }
      try {
        setMsg("novo-partido", "Salvando…", false);
        var novo = await salvarNovoPartido(sigla, nome);
        await carregarPartidos();
        document.getElementById("cad-partido").value = novo.id;
        document.getElementById("novo-partido-sigla").value = "";
        document.getElementById("novo-partido-nome").value = "";
        document.querySelector("[data-novo-partido-box]").hidden = true;
        setMsg("novo-partido", "", false);
      } catch (err) {
        setMsg("novo-partido", "Erro: " + (err.message || "tente novamente."), true);
      }
    });

    bindForm("cliente-cadastro", async function () {
      var tipo = tipoSelecionado();
      var ehPartido = tipo === "orgao";
      var ehCandidato = tipo === "candidato";
      var payload = {
        nome: val("cad-nome"),
        documento: val("cad-documento"),
        partido_id: (ehPartido || ehCandidato) ? val("cad-partido") : null,
        nivel: ehPartido ? val("cad-nivel") : null,
        uf: ehPartido ? val("cad-uf") : null,
        municipio: ehPartido ? val("cad-municipio") : null,
        parent_id: ehPartido ? val("cad-pai") : null,
        eh_candidato: ehCandidato,
        cargo_disputado: ehCandidato ? val("cad-cargo") : null,
        ano_eleicao: ehCandidato && val("cad-ano-eleicao") ? Number(val("cad-ano-eleicao")) : null,
      };
      if (!payload.nome) throw new Error("preencha o nome do cliente");
      var { error } = await bfSupabase.from("clientes").insert(payload);
      if (error) throw error;
      await carregarClientes();
      document.querySelector('input[name="cad-tipo"][value="nenhum"]').checked = true;
      atualizarCamposCliente();
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
    await carregarClientes();
    iniciarFormularios();
  }

  init();
})();
