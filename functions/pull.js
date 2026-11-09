export async function onRequest(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  const raw = await context.env.chat_storage.get("chat_msg_list");
  const list = raw ? JSON.parse(raw) : [];
  return new Response(JSON.stringify(list), {
    headers: { "Content-Type": "application/json", ...corsHeaders }
  })
}
