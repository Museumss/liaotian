export async function onRequest(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (context.request.method === "OPTIONS") return new Response(null,{headers:corsHeaders});
  if (context.request.method !== "POST") return new Response("err",{status:400,headers:corsHeaders});
  const text = await context.request.text();
  if (!text.trim()) return new Response("ok",{headers:corsHeaders});
  let list = await context.env.chat_storage.get("chat_msg_list");
  list = list ? JSON.parse(list) : [];
  list.push({ t: Date.now(), content: text, role: "guest" });
  const MAX_MSG = 30;
  if (list.length > MAX_MSG) list.shift();
  await context.env.chat_storage.put("chat_msg_list", JSON.stringify(list));
  return new Response("ok",{headers:corsHeaders});
}
