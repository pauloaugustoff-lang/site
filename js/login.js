(function () {
  "use strict";

  var form = document.querySelector("[data-login-form]");
  if (!form) return;

  var feedback = form.querySelector("[data-form-feedback]");
  var feedbackText = feedback ? feedback.querySelector("span") : null;
  var btnAcao = form.querySelector("[data-btn-acao]");
  var btnVoltar = form.querySelector("[data-voltar-login]");
  var campoSenha = form.querySelector("[data-campo-senha]");
  var msgRecuperar = form.querySelector("[data-msg-recuperar]");
  var linkRecuperar = form.querySelector("[data-abrir-recuperar]");

  var modo = "login";

  function showFeedback(message, isError) {
    if (feedbackText) feedbackText.textContent = message;
    if (feedback) {
      feedback.classList.add("is-visible");
      feedback.classList.toggle("is-error", !!isError);
    }
  }
  function limparFeedback() {
    if (feedback) feedback.classList.remove("is-visible", "is-error");
  }

  function entrarModoRecuperar() {
    modo = "recuperar";
    campoSenha.hidden = true;
    msgRecuperar.hidden = false;
    btnAcao.textContent = "Enviar link de redefinição";
    btnVoltar.hidden = false;
    limparFeedback();
  }
  function entrarModoLogin() {
    modo = "login";
    campoSenha.hidden = false;
    msgRecuperar.hidden = true;
    btnAcao.innerHTML = 'Entrar' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    btnVoltar.hidden = true;
    limparFeedback();
  }

  if (linkRecuperar) {
    linkRecuperar.addEventListener("click", function (e) {
      e.preventDefault();
      entrarModoRecuperar();
    });
  }
  if (btnVoltar) {
    btnVoltar.addEventListener("click", entrarModoLogin);
  }

  // Se já tiver sessão ativa (voltou pra tela de login por engano), manda
  // direto pro destino certo em vez de pedir login de novo.
  (async function redirectIfAlreadyLogged() {
    const { data: { session } } = await bfSupabase.auth.getSession();
    if (!session) return;
    const perfil = await bfGetPerfil(session.user.id);
    if (perfil) {
      window.location.href = perfil.role === "escritorio" ? "portal/admin.html" : "portal/painel.html";
    }
  })();

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    var email = form.querySelector("#email").value.trim();

    if (modo === "recuperar") {
      if (!email) {
        showFeedback("Informe seu e-mail para receber o link de redefinição.", true);
        return;
      }
      btnAcao.disabled = true;
      var redirectTo = window.location.origin + window.location.pathname.replace(/login\.html$/, "redefinir-senha.html");
      const { error } = await bfSupabase.auth.resetPasswordForEmail(email, { redirectTo: redirectTo });
      btnAcao.disabled = false;
      if (error) {
        showFeedback("Não foi possível enviar o link agora: " + error.message, true);
        return;
      }
      showFeedback("Se esse e-mail estiver cadastrado, você vai receber um link para redefinir a senha em instantes. Confira também a caixa de spam.", false);
      return;
    }

    btnAcao.disabled = true;
    var senha = form.querySelector("#senha").value;

    const { data, error } = await bfSupabase.auth.signInWithPassword({
      email: email,
      password: senha,
    });

    if (error) {
      showFeedback("Não foi possível entrar: e-mail ou senha inválidos. Confira os dados e tente novamente.", true);
      btnAcao.disabled = false;
      return;
    }

    var perfil = await bfGetPerfil(data.user.id);
    if (!perfil) {
      showFeedback("Seu login foi validado, mas ainda não há um perfil de acesso associado a ele. Fale com o escritório.", true);
      await bfSupabase.auth.signOut();
      btnAcao.disabled = false;
      return;
    }

    window.location.href = perfil.role === "escritorio" ? "portal/admin.html" : "portal/painel.html";
  });
})();
