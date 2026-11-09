export async function onRequest(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Msg-Id",
  };
  if (context.request.method === "OPTIONS") return new Response(null,{headers:corsHeaders});
  if (context.request.method !== "POST") return new Response("err",{status:400,headers:corsHeaders});

  const msgId = context.request.headers.get("X-Msg-Id");
  if (!msgId) return new Response("err",{headers:corsHeaders});

  // 检查这条消息是否已经处理过
  const exist = await context.env.chat_storage.get("msg_id:"+msgId);
  if(exist){
    return new Response("ok",{headers:corsHeaders});
  }

  const text = await context.request.text();
  if (!text.trim()) return new Response("ok",{headers:corsHeaders});

  let list = await context.env.chat_storage.get("chat_msg_list");
  list = list ? JSON.parse(list) : [];
  list.push({ t: Date.now(), content: text, role: "guest" });
  const MAX_MSG = 30;
  if (list.length > MAX_MSG) list.shift();

  await context.env.chat_storage.put("chat_msg_list", JSON.stringify(list));
  // 标记这条消息id已经处理，TTL 300秒，5分钟足够防止重试
  await context.env.chat_storage.put("msg_id:"+msgId, "1", {expirationTtl:300});

  return new Response("ok",{headers:corsHeaders});
}
