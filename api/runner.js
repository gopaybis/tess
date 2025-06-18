export default async function handler(req, res) {
  const rawUrl = req.query.url;

  if (!rawUrl || !rawUrl.startsWith("https://")) {
    return res.status(400).send("❌ Parameter ?url= wajib");
  }

  try {
    const code = await fetch(rawUrl).then(r => r.text());
    const fn = new Function("req", code + "\n return handler(req);");

    const result = await fn(req);

    return typeof result === "object"
      ? res.status(200).json(result)
      : res.status(200).send(result);
  } catch (err) {
    return res.status(500).send("⚠️ Gagal menjalankan: " + err.message);
  }
}
