// Edge Function: criar-cliente
//
// Cria o login (Supabase Auth) e o perfil (tabela `perfis`) de um novo
// usuário — cliente (vinculado a um cliente_id) ou membro do escritório
// (role='escritorio', sem cliente_id). Só quem já é `role = escritorio`
// pode chamar isso — a checagem é feita aqui dentro, usando a service_role
// key, que nunca fica exposta no site.
//
// Como publicar: cole este arquivo no Supabase Dashboard em
// Edge Functions → New function → nome "criar-cliente" → Deploy.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function gerarSenhaTemporaria(): string {
  // 12 caracteres alfanuméricos, fáceis de ditar/copiar
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Não autenticado." }, 401);
    }

    // Cliente com o token de quem está chamando, só pra descobrir quem é
    const callerClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await callerClient.auth.getUser();
    if (userErr || !user) {
      return jsonResponse({ error: "Sessão inválida." }, 401);
    }

    // Cliente com privilégio total, só usado depois de confirmar que quem
    // chamou é realmente da equipe do escritório.
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { data: perfilChamador } = await admin
      .from("perfis")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!perfilChamador || perfilChamador.role !== "escritorio") {
      return jsonResponse({ error: "Sem permissão para criar acessos." }, 403);
    }

    const { email, nome, cliente_id, escopo, role } = await req.json();
    const roleFinal = role === "escritorio" ? "escritorio" : "cliente";
    if (!email || !nome || (roleFinal === "cliente" && !cliente_id)) {
      return jsonResponse({ error: "Preencha nome, e-mail e cliente." }, 400);
    }
    const escopoFinal = escopo === "prestacao_contas" ? "prestacao_contas" : "total";

    const senha = gerarSenhaTemporaria();

    const { data: novoUsuario, error: createErr } = await admin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    });
    if (createErr) {
      return jsonResponse({ error: createErr.message }, 400);
    }

    const { error: perfilErr } = await admin.from("perfis").insert({
      id: novoUsuario.user.id,
      nome,
      email,
      cliente_id: roleFinal === "escritorio" ? null : cliente_id,
      role: roleFinal,
      escopo: escopoFinal,
    });
    if (perfilErr) {
      // limpa o usuário órfão se o perfil não pôde ser criado
      await admin.auth.admin.deleteUser(novoUsuario.user.id);
      return jsonResponse({ error: perfilErr.message }, 400);
    }

    return jsonResponse({ email, senha });
  } catch (e) {
    return jsonResponse({ error: String(e) }, 500);
  }
});
