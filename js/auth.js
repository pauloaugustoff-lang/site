// Cliente Supabase compartilhado + helpers de sessão/perfil usados por
// login.html e por todas as páginas dentro de portal/.
// Depende de supabase-config.js (SUPABASE_URL / SUPABASE_ANON_KEY) e do
// script oficial @supabase/supabase-js já terem sido carregados antes.
const bfSupabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Retorna a sessão atual ou manda para o login se não houver uma.
// `loginPath` é o caminho relativo até login.html a partir da página atual.
async function bfRequireSession(loginPath) {
  const { data: { session } } = await bfSupabase.auth.getSession();
  if (!session) {
    window.location.href = loginPath;
    return null;
  }
  return session;
}

// Busca o perfil (nome, papel, cliente e escopo de acesso) do usuário logado.
async function bfGetPerfil(userId) {
  const { data, error } = await bfSupabase
    .from("perfis")
    .select("id, nome, role, escopo, cliente_id, clientes(nome, tipo_cliente, uf, municipio, path)")
    .eq("id", userId)
    .single();
  if (error) {
    console.error("Erro ao buscar perfil:", error);
    return null;
  }
  return data;
}

async function bfLogout(loginPath) {
  await bfSupabase.auth.signOut();
  window.location.href = loginPath;
}
