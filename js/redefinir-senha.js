(function () {
  "use strict";

  var form = document.querySelector("[data-redefinir-form]");
  if (!form) return;

  var msgInvalido = document.querySelector("[data-msg-invalido]");
  var msgSucesso = document.querySelector("[data-msg-sucesso]");
  var lede = document.querySelector("[data-lede]");
  var feedback = form.querySelector("[data-form-feedback]");
  var feedbackText = feedback.querySelector("span");
  var btnSalvar = form.querySelector("[data-btn-salvar]");

  function showFeedback(message, isError) {
    feedbackText.textContent = message;
    feedback.classList.add("is-visible");
    feedback.classList.toggle("is-error", !!isError);
  }

  // O link do e-mail traz um token de recuperação na URL — o supabase-js
  // processa isso sozinho (assíncrono) e abre uma sessão válida. Só
  // liberamos o formulário depois de confirmar que essa sessão existe;
  // se nada acontecer em alguns segundos, o link era inválido/expirado.
  var resolvido = false;
  function liberarFormulario() {
    if (resolvido) return;
    resolvido = true;
    form.hidden = false;
  }
  function mostrarLinkInvalido() {
    if (resolvido) return;
    resolvido = true;
    lede.hidden = true;
    msgInvalido.hidden = false;
  }

  bfSupabase.auth.onAuthStateChange(function (_event, session) {
    if (session) liberarFormulario();
  });
  bfSupabase.auth.getSession().then(function (r) {
    if (r.data.session) liberarFormulario();
  });
  setTimeout(function () {
    if (!resolvido) mostrarLinkInvalido();
  }, 3000);

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    var novaSenha = document.getElementById("nova-senha").value;
    var confirmar = document.getElementById("confirmar-senha").value;

    if (novaSenha.length < 6) {
      showFeedback("A senha precisa ter pelo menos 6 caracteres.", true);
      return;
    }
    if (novaSenha !== confirmar) {
      showFeedback("As senhas não coincidem.", true);
      return;
    }

    btnSalvar.disabled = true;
    var { error } = await bfSupabase.auth.updateUser({ password: novaSenha });
    btnSalvar.disabled = false;

    if (error) {
      showFeedback("Não foi possível salvar a nova senha: " + error.message, true);
      return;
    }

    form.hidden = true;
    lede.hidden = true;
    msgSucesso.hidden = false;
  });
})();
