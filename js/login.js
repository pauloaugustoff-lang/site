(function () {
  "use strict";

  var form = document.querySelector("[data-login-form]");
  if (!form) return;

  var feedback = form.querySelector("[data-form-feedback]");
  var feedbackText = feedback ? feedback.querySelector("span") : null;
  var submitBtn = form.querySelector('button[type="submit"]');

  function showFeedback(message) {
    if (feedbackText) feedbackText.textContent = message;
    if (feedback) feedback.classList.add("is-visible");
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
    if (submitBtn) submitBtn.disabled = true;

    var email = form.querySelector("#email").value.trim();
    var senha = form.querySelector("#senha").value;

    const { data, error } = await bfSupabase.auth.signInWithPassword({
      email: email,
      password: senha,
    });

    if (error) {
      showFeedback("Não foi possível entrar: e-mail ou senha inválidos. Confira os dados e tente novamente.");
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    var perfil = await bfGetPerfil(data.user.id);
    if (!perfil) {
      showFeedback("Seu login foi validado, mas ainda não há um perfil de acesso associado a ele. Fale com o escritório.");
      await bfSupabase.auth.signOut();
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    window.location.href = perfil.role === "escritorio" ? "portal/admin.html" : "portal/painel.html";
  });
})();
