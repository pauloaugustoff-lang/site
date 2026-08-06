// Edge Function: excluir-usuario
//
// Exclui um login (Supabase Auth). O perfil (tabela `perfis`) e os
// escopos extras (tabela `perfil_escopos`) vinculados a ele são
// removidos automaticamente por cascata (on delete cascade já configurado
// no schema) — não precisa apagar essas linhas manualmente aqui.
//
// Só quem já é `role = escritorio` pode chamar isso, e ninguém pode
// excluir o próprio login por aqui (evita se trancar fora do sistema sem
// querer).
//
// Como publicar: cole este arquivo no Supabase Dashboard em
// Edge Functions → New function → nome "excluir-usuario" → Deploy.

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
      return jsonResponse({ error: "Sem permissão para excluir acessos." }, 403);
    }

    const { perfil_id } = await req.json();
    if (!perfil_id) {
      return jsonResponse({ error: "Informe o usuário a excluir." }, 400);
    }
    if (perfil_id === user.id) {
      return jsonResponse({ error: "Você não pode excluir o próprio acesso." }, 400);
    }

    const { error: deleteErr } = await admin.auth.admin.deleteUser(perfil_id);
    if (deleteErr) {
      return jsonResponse({ error: deleteErr.message }, 400);
    }

    return jsonResponse({ ok: true });
  } catch (e) {
    return jsonResponse({ error: String(e) }, 500);
  }
});
