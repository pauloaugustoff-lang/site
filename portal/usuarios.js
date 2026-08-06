(function () {
  "use strict";

  var LABELS = {
    role: { cliente: "Cliente", escritorio: "Escritório" },
    escopo: { total: "Total", prestacao_contas: "Só prestação de contas" },
    nivelAcesso: { total: "Total", prestacao_contas: "Só prestação de contas", leitura: "Só leitura" },
  };

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
  function clienteDepth(path) {
    return path ? path.split(".").length - 1 : 0;
  }

  var usuarioSelecionadoId = null;
  var usuariosCache = [];
  var clientesCache = [];
  var meuPerfilId = null;

  function renderUsuarios() {
    var tbody = document.querySelector('[data-list="usuarios"]');
    if (!usuariosCache.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="7">Nenhum usuário encontrado.</td></tr>';
      return;
    }
    tbody.innerHTML = usuariosCache.map(function (u) {
      var souEu = u.id === meuPerfilId;
      return "<tr>" +
        "<td>" + u.nome + "</td>" +
        "<td>" + (u.email || "—") + "</td>" +
        "<td>" + (LABELS.role[u.role] || u.role) + "</td>" +
        "<td>" + (u.clientes ? u.clientes.nome : "—") + "</td>" +
        "<td>" + (LABELS.escopo[u.escopo] || u.escopo) + "</td>" +
        '<td><button type="button" class="portal-inline-link" data-gerenciar-escopos="' + u.id + '">Gerenciar escopos</button></td>' +
        '<td>' + (souEu
          ? '<span class="empty-note">você</span>'
          : '<button type="button" class="portal-inline-link" data-excluir-usuario="' + u.id + '" style="color:#8a3b1f;">Excluir</button>') +
        "</td>" +
      "</tr>";
    }).join("");
  }

  async function carregarUsuarios() {
    var { data, error } = await bfSupabase
      .from("perfis")
      .select("id, nome, email, role, escopo, cliente_id, clientes(nome)")
      .order("nome");
    if (error) {
      console.error(error);
      document.querySelector('[data-list="usuarios"]').innerHTML =
        '<tr class="empty-row"><td colspan="7">Não foi possível carregar os usuários agora.</td></tr>';
      return;
    }
    usuariosCache = data || [];
    renderUsuarios();
  }

  async function carregarClientesParaSelect() {
    var { data, error } = await bfSupabase.from("clientes").select("id, nome, path").order("path");
    if (error) { console.error(error); return; }
    clientesCache = data || [];
    document.getElementById("escopo-cliente").innerHTML =
      '<option value="">— selecione —</option>' + clientesCache.map(function (c) {
        var indent = "— ".repeat(clienteDepth(c.path));
        return '<option value="' + c.id + '">' + indent + c.nome + "</option>";
      }).join("");
  }

  function renderListaEscopos(escopos) {
    var el = document.querySelector("[data-lista-escopos]");
    el.innerHTML = escopos.length
      ? '<div class="sidebar-list">' + escopos.map(function (e) {
          return '<div class="sidebar-item">' +
            '<div class="t">' + (e.clientes ? e.clientes.nome : "—") + "</div>" +
            '<div class="d">' + (LABELS.nivelAcesso[e.nivel_acesso] || e.nivel_acesso) + "</div>" +
            '<div class="d" style="margin-top:.4rem;"><button type="button" class="portal-inline-link" data-remover-escopo="' + e.id + '">Remover</button></div>' +
          "</div>";
        }).join("") + "</div>"
      : '<span class="empty-note">Nenhum escopo adicional — esse login só enxerga o vínculo principal.</span>';
  }

  async function carregarEscoposDoUsuario(perfilId) {
    var { data, error } = await bfSupabase
      .from("perfil_escopos")
      .select("id, nivel_acesso, clientes(nome)")
      .eq("perfil_id", perfilId)
      .order("created_at");
    if (error) { console.error(error); return; }
    renderListaEscopos(data || []);
  }

  function abrirEscopos(usuario) {
    usuarioSelecionadoId = usuario.id;
    document.querySelector("[data-escopos-usuario-nome]").textContent = usuario.nome;
    document.querySelector("[data-secao-escopos]").hidden = false;
    document.querySelector("[data-secao-escopos]").scrollIntoView({ behavior: "smooth", block: "start" });
    carregarEscoposDoUsuario(usuario.id);
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
        setMsg(key, "Erro: " + (err.message || "tente novamente."), true);
      }
    });
  }

  function iniciar() {
    document.querySelector('[data-list="usuarios"]').addEventListener("click", async function (e) {
      var idEscopos = e.target.getAttribute("data-gerenciar-escopos");
      if (idEscopos) {
        var usuario = usuariosCache.find(function (u) { return u.id === idEscopos; });
        if (usuario) abrirEscopos(usuario);
        return;
      }

      var idExcluir = e.target.getAttribute("data-excluir-usuario");
      if (idExcluir) {
        var alvo = usuariosCache.find(function (u) { return u.id === idExcluir; });
        var ok = await BF.confirmar(
          "Isso exclui o login de " + (alvo ? alvo.nome : "este usuário") + " — ele não vai mais conseguir acessar o sistema. Não é possível desfazer.",
          { titulo: "Excluir usuário?", textoConfirmar: "Excluir usuário" }
        );
        if (!ok) return;

        setMsg("excluir-usuario", "Excluindo…", false);
        try {
          var { data: { session } } = await bfSupabase.auth.getSession();
          var resp = await fetch(SUPABASE_URL + "/functions/v1/excluir-usuario", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + session.access_token,
              "apikey": SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({ perfil_id: idExcluir }),
          });
          var result = await resp.json();
          if (!resp.ok) throw new Error(result.error || "não foi possível excluir o usuário");

          if (usuarioSelecionadoId === idExcluir) {
            document.querySelector("[data-secao-escopos]").hidden = true;
            usuarioSelecionadoId = null;
          }
          setMsg("excluir-usuario", "Usuário excluído.", false);
          await carregarUsuarios();
        } catch (err) {
          console.error(err);
          setMsg("excluir-usuario", "Erro ao excluir: " + err.message, true);
        }
      }
    });

    document.querySelector("[data-lista-escopos]").addEventListener("click", async function (e) {
      var id = e.target.getAttribute("data-remover-escopo");
      if (!id) return;
      e.target.disabled = true;
      var { error } = await bfSupabase.from("perfil_escopos").delete().eq("id", id);
      if (error) { console.error(error); e.target.disabled = false; return; }
      await carregarEscoposDoUsuario(usuarioSelecionadoId);
    });

    bindForm("novo-escopo", async function () {
      if (!usuarioSelecionadoId) throw new Error("selecione um usuário primeiro");
      var clienteId = val("escopo-cliente");
      if (!clienteId) throw new Error("selecione um cliente");
      var { error } = await bfSupabase.from("perfil_escopos").insert({
        perfil_id: usuarioSelecionadoId,
        cliente_id: clienteId,
        nivel_acesso: val("escopo-nivel") || "total",
      });
      if (error) throw error;
      document.getElementById("escopo-cliente").value = "";
      await carregarEscoposDoUsuario(usuarioSelecionadoId);
    });

    bindForm("usuario-escritorio", async function () {
      var nome = val("ue-nome");
      var email = val("ue-email");
      if (!nome || !email) throw new Error("preencha nome e e-mail");

      var { data: { session } } = await bfSupabase.auth.getSession();
      var resp = await fetch(SUPABASE_URL + "/functions/v1/criar-cliente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + session.access_token,
          "apikey": SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ nome: nome, email: email, role: "escritorio" }),
      });
      var result = await resp.json();
      if (!resp.ok) throw new Error(result.error || "não foi possível criar o acesso");

      document.querySelector("[data-cred-email]").textContent = result.email;
      document.querySelector("[data-cred-senha]").textContent = result.senha;
      document.querySelector("[data-credential-box]").classList.add("is-visible");
      document.getElementById("form-usuario-escritorio").reset();
      await carregarUsuarios();
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

    meuPerfilId = session.user.id;
    iniciar();
    await carregarUsuarios();
    await carregarClientesParaSelect();
  }

  init();
})();
