export const config = {
  runtime: "edge"
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl || !rawUrl.startsWith("https://")) {
    return new Response("❌ Parameter ?url=https://... wajib", { status: 400 });
  }

  try {
    const code = await fetch(rawUrl).then(r => r.text());

    // Eksekusi sebagai fungsi biasa (tanpa export default)
    const fn = new Function("req", `${code}\nreturn handler(req);`);

    const result = await fn(req);

    return result instanceof Response
      ? result
      : new Response(JSON.stringify(result), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
  } catch (err) {
    return new Response("⚠️ Gagal menjalankan: " + err.message, {
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}
