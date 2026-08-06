// Helpers compartilhados pelo fluxo de cadastro/edição de cliente
// (cadastro-de-cliente.js e cliente.js): lista de UF, geração automática do
// nome de diretórios partidários, busca automática da instância superior,
// máscara de CPF/CNPJ e o combobox pesquisável de partido (com modal de
// criação rápida). Depende de bfSupabase já estar disponível (auth.js).
(function () {
  "use strict";

  window.BF = window.BF || {};

  BF.UF_LISTA = [
    { sigla: "AC", nome: "Acre" }, { sigla: "AL", nome: "Alagoas" }, { sigla: "AP", nome: "Amapá" },
    { sigla: "AM", nome: "Amazonas" }, { sigla: "BA", nome: "Bahia" }, { sigla: "CE", nome: "Ceará" },
    { sigla: "DF", nome: "Distrito Federal" }, { sigla: "ES", nome: "Espírito Santo" }, { sigla: "GO", nome: "Goiás" },
    { sigla: "MA", nome: "Maranhão" }, { sigla: "MT", nome: "Mato Grosso" }, { sigla: "MS", nome: "Mato Grosso do Sul" },
    { sigla: "MG", nome: "Minas Gerais" }, { sigla: "PA", nome: "Pará" }, { sigla: "PB", nome: "Paraíba" },
    { sigla: "PR", nome: "Paraná" }, { sigla: "PE", nome: "Pernambuco" }, { sigla: "PI", nome: "Piauí" },
    { sigla: "RJ", nome: "Rio de Janeiro" }, { sigla: "RN", nome: "Rio Grande do Norte" }, { sigla: "RS", nome: "Rio Grande do Sul" },
    { sigla: "RO", nome: "Rondônia" }, { sigla: "RR", nome: "Roraima" }, { sigla: "SC", nome: "Santa Catarina" },
    { sigla: "SP", nome: "São Paulo" }, { sigla: "SE", nome: "Sergipe" }, { sigla: "TO", nome: "Tocantins" },
  ];

  BF.nomeUF = function (sigla) {
    var u = BF.UF_LISTA.filter(function (x) { return x.sigla === sigla; })[0];
    return u ? u.nome : (sigla || "");
  };

  BF.opcoesUF = function (placeholder) {
    return '<option value="">' + (placeholder || "— selecione —") + '</option>' +
      BF.UF_LISTA.map(function (u) { return '<option value="' + u.sigla + '">' + u.sigla + " — " + u.nome + "</option>"; }).join("");
  };

  // Cargos eletivos: "escopo" define quais campos de localização fazem
  // sentido (nacional = nenhum, uf = só UF, municipio = UF+Município,
  // livre = "Outro", mostra os dois mas sem obrigar).
  BF.CARGOS = [
    { valor: "presidente", label: "Presidente", escopo: "nacional" },
    { valor: "vice_presidente", label: "Vice-Presidente", escopo: "nacional" },
    { valor: "governador", label: "Governador", escopo: "uf" },
    { valor: "vice_governador", label: "Vice-Governador", escopo: "uf" },
    { valor: "senador", label: "Senador", escopo: "uf" },
    { valor: "deputado_federal", label: "Deputado Federal", escopo: "uf" },
    { valor: "deputado_estadual", label: "Deputado Estadual", escopo: "uf" },
    { valor: "deputado_distrital", label: "Deputado Distrital", escopo: "uf" },
    { valor: "prefeito", label: "Prefeito", escopo: "municipio" },
    { valor: "vice_prefeito", label: "Vice-Prefeito", escopo: "municipio" },
    { valor: "vereador", label: "Vereador", escopo: "municipio" },
    { valor: "outro", label: "Outro", escopo: "livre" },
  ];

  BF.opcoesCargo = function () {
    return '<option value="">— selecione —</option>' +
      BF.CARGOS.map(function (c) { return '<option value="' + c.valor + '">' + c.label + "</option>"; }).join("");
  };
  BF.escopoCargo = function (valor) {
    var c = BF.CARGOS.filter(function (x) { return x.valor === valor; })[0];
    return c ? c.escopo : null;
  };
  BF.labelCargo = function (valor) {
    var c = BF.CARGOS.filter(function (x) { return x.valor === valor; })[0];
    return c ? c.label : null;
  };
  // Para telas de edição, que guardam o texto livre já salvo em vez do
  // código do select — acha o "valor" (código) a partir do texto salvo.
  BF.valorPorLabelCargo = function (label) {
    var c = BF.CARGOS.filter(function (x) { return x.label === label; })[0];
    return c ? c.valor : null;
  };

  // Padrão exigido: "Partido - Diretório Nacional" / "Partido - Estadual -
  // Minas Gerais" / "Partido - Municipal - Belo Horizonte - MG". A palavra
  // "Diretório" só aparece na instância nacional.
  BF.gerarNomeCliente = function (partidoNome, instancia, uf, municipio) {
    if (!partidoNome || !instancia) return "";
    if (instancia === "diretorio_nacional") return partidoNome + " - Diretório Nacional";
    if (instancia === "diretorio_estadual") return uf ? partidoNome + " - Estadual - " + BF.nomeUF(uf) : "";
    if (instancia === "diretorio_municipal") return (municipio && uf) ? partidoNome + " - Municipal - " + municipio + " - " + uf : "";
    return "";
  };

  // Localiza automaticamente a instância imediatamente superior do mesmo
  // partido (nacional p/ estadual; estadual da mesma UF p/ municipal).
  // Retorna null (sem lançar erro) quando ainda não existe — o cadastro
  // não deve ser bloqueado por isso.
  BF.encontrarSuperior = async function (instancia, partidoId, uf) {
    if (!partidoId) return null;
    if (instancia === "diretorio_estadual") {
      var r = await bfSupabase.from("clientes").select("id, nome")
        .eq("tipo_cliente", "diretorio_nacional").eq("partido_id", partidoId).limit(1).maybeSingle();
      return r.data || null;
    }
    if (instancia === "diretorio_municipal") {
      if (!uf) return null;
      var r2 = await bfSupabase.from("clientes").select("id, nome")
        .eq("tipo_cliente", "diretorio_estadual").eq("partido_id", partidoId).ilike("uf", uf).limit(1).maybeSingle();
      return r2.data || null;
    }
    return null;
  };

  BF.mascararDocumento = function (valor) {
    var digitos = valor.replace(/\D/g, "").slice(0, 14);
    if (digitos.length <= 11) {
      return digitos
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return digitos
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  };

  BF.criarPartido = async function (sigla, nome) {
    var { data, error } = await bfSupabase.from("partidos").insert({ sigla: sigla, nome: nome }).select().single();
    if (error) throw error;
    return data;
  };

  // ---------------------------------------------------------------
  // Combobox pesquisável de partido.
  // cfg: { inputEl, hiddenEl, listEl, getPartidos(), onChange(partido|null) }
  // Retorna { setValue(partido), clear() }.
  // ---------------------------------------------------------------
  BF.criarPartidoPicker = function (cfg) {
    function normalizar(s) {
      return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    }
    function rotulo(p) {
      return p.sigla ? p.sigla + " — " + p.nome : p.nome;
    }
    function fechar() {
      cfg.listEl.hidden = true;
      cfg.listEl.innerHTML = "";
    }
    function renderLista(filtro) {
      var termo = normalizar(filtro);
      var partidos = cfg.getPartidos();
      var filtrados = termo
        ? partidos.filter(function (p) { return normalizar(rotulo(p)).indexOf(termo) !== -1; })
        : partidos;
      cfg.listEl.innerHTML = filtrados.length
        ? filtrados.slice(0, 40).map(function (p) {
            return '<div class="combo-option" data-id="' + p.id + '">' + rotulo(p) + "</div>";
          }).join("")
        : '<div class="combo-empty">Nenhum partido encontrado.</div>';
      cfg.listEl.hidden = false;
    }

    cfg.inputEl.addEventListener("focus", function () { renderLista(cfg.inputEl.value); });
    cfg.inputEl.addEventListener("input", function () {
      cfg.hiddenEl.value = "";
      if (cfg.onChange) cfg.onChange(null);
      renderLista(cfg.inputEl.value);
    });
    cfg.inputEl.addEventListener("blur", function () { setTimeout(fechar, 150); });
    cfg.inputEl.addEventListener("keydown", function (e) { if (e.key === "Escape") fechar(); });

    cfg.listEl.addEventListener("mousedown", function (e) {
      var opt = e.target.closest("[data-id]");
      if (!opt) return;
      e.preventDefault();
      var partido = cfg.getPartidos().filter(function (p) { return p.id === opt.getAttribute("data-id"); })[0];
      if (!partido) return;
      cfg.hiddenEl.value = partido.id;
      cfg.inputEl.value = rotulo(partido);
      fechar();
      if (cfg.onChange) cfg.onChange(partido);
    });

    return {
      setValue: function (partido) {
        if (!partido) { cfg.hiddenEl.value = ""; cfg.inputEl.value = ""; return; }
        cfg.hiddenEl.value = partido.id;
        cfg.inputEl.value = rotulo(partido);
      },
      clear: function () { cfg.hiddenEl.value = ""; cfg.inputEl.value = ""; fechar(); },
    };
  };

  // ---------------------------------------------------------------
  // Modal "novo partido" — criado uma única vez e reaproveitado por
  // quantas telas precisarem dele.
  // ---------------------------------------------------------------
  var modalEl = null;
  function garantirModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement("div");
    modalEl.className = "portal-modal-backdrop";
    modalEl.hidden = true;
    modalEl.innerHTML =
      '<div class="portal-modal">' +
        "<h3>Novo partido</h3>" +
        '<div class="field" style="margin-top:0;">' +
          '<label for="bf-modal-partido-sigla">Sigla</label>' +
          '<input type="text" id="bf-modal-partido-sigla" placeholder="Ex: XX">' +
        "</div>" +
        '<div class="field">' +
          '<label for="bf-modal-partido-nome">Nome do partido</label>' +
          '<input type="text" id="bf-modal-partido-nome" placeholder="Nome completo">' +
        "</div>" +
        '<div class="portal-modal-actions">' +
          '<span class="portal-inline-msg" data-msg="bf-modal-partido"></span>' +
          '<button type="button" class="btn btn-ghost-light" data-bf-modal-cancelar>Cancelar</button>' +
          '<button type="button" class="btn btn-primary" data-bf-modal-salvar>Salvar</button>' +
        "</div>" +
      "</div>";
    document.body.appendChild(modalEl);
    return modalEl;
  }

  // Retorna uma Promise que resolve com o partido criado, ou null se
  // cancelado.
  BF.abrirModalNovoPartido = function () {
    var modal = garantirModal();
    var siglaEl = modal.querySelector("#bf-modal-partido-sigla");
    var nomeEl = modal.querySelector("#bf-modal-partido-nome");
    var msgEl = modal.querySelector('[data-msg="bf-modal-partido"]');
    var salvarBtn = modal.querySelector("[data-bf-modal-salvar]");
    var cancelarBtn = modal.querySelector("[data-bf-modal-cancelar]");

    siglaEl.value = "";
    nomeEl.value = "";
    msgEl.textContent = "";
    msgEl.classList.remove("is-error");
    modal.hidden = false;
    siglaEl.focus();

    return new Promise(function (resolve) {
      function limpar() {
        salvarBtn.onclick = null;
        cancelarBtn.onclick = null;
        modal.onclick = null;
        modal.hidden = true;
      }
      cancelarBtn.onclick = function () { limpar(); resolve(null); };
      modal.onclick = function (e) { if (e.target === modal) { limpar(); resolve(null); } };
      salvarBtn.onclick = async function () {
        var sigla = siglaEl.value.trim();
        var nome = nomeEl.value.trim();
        if (!sigla || !nome) {
          msgEl.textContent = "Preencha sigla e nome.";
          msgEl.classList.add("is-error");
          return;
        }
        salvarBtn.disabled = true;
        msgEl.textContent = "Salvando…";
        msgEl.classList.remove("is-error");
        try {
          var partido = await BF.criarPartido(sigla, nome);
          limpar();
          salvarBtn.disabled = false;
          resolve(partido);
        } catch (err) {
          salvarBtn.disabled = false;
          msgEl.textContent = "Erro: " + (err.message || "tente novamente.");
          msgEl.classList.add("is-error");
        }
      };
    });
  };

  // ---------------------------------------------------------------
  // Modal genérico de confirmação (usado por exclusões e outras ações
  // irreversíveis). Retorna uma Promise<boolean>.
  // opts: { textoConfirmar, perigoso }
  // ---------------------------------------------------------------
  var confirmModalEl = null;
  function garantirConfirmModal() {
    if (confirmModalEl) return confirmModalEl;
    confirmModalEl = document.createElement("div");
    confirmModalEl.className = "portal-modal-backdrop";
    confirmModalEl.hidden = true;
    confirmModalEl.innerHTML =
      '<div class="portal-modal">' +
        '<h3 data-bf-confirm-titulo>Confirmar</h3>' +
        '<p class="portal-section-desc" data-bf-confirm-mensagem style="margin-top:.6rem;"></p>' +
        '<div class="portal-modal-actions">' +
          '<button type="button" class="btn btn-ghost-light" data-bf-confirm-cancelar>Cancelar</button>' +
          '<button type="button" class="btn" data-bf-confirm-ok>Confirmar</button>' +
        "</div>" +
      "</div>";
    document.body.appendChild(confirmModalEl);
    return confirmModalEl;
  }

  BF.confirmar = function (mensagem, opts) {
    opts = opts || {};
    var modal = garantirConfirmModal();
    var tituloEl = modal.querySelector("[data-bf-confirm-titulo]");
    var msgEl = modal.querySelector("[data-bf-confirm-mensagem]");
    var okBtn = modal.querySelector("[data-bf-confirm-ok]");
    var cancelarBtn = modal.querySelector("[data-bf-confirm-cancelar]");

    tituloEl.textContent = opts.titulo || "Confirmar";
    msgEl.textContent = mensagem;
    okBtn.textContent = opts.textoConfirmar || "Confirmar";
    okBtn.className = "btn " + (opts.perigoso === false ? "btn-primary" : "btn-danger");
    modal.hidden = false;

    return new Promise(function (resolve) {
      function limpar() {
        okBtn.onclick = null;
        cancelarBtn.onclick = null;
        modal.onclick = null;
        modal.hidden = true;
      }
      cancelarBtn.onclick = function () { limpar(); resolve(false); };
      modal.onclick = function (e) { if (e.target === modal) { limpar(); resolve(false); } };
      okBtn.onclick = function () { limpar(); resolve(true); };
    });
  };
})();
