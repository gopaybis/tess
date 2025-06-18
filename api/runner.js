export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.startsWith("http")) {
    return res.status(400).send("❌ Parameter ?url=https://... wajib");
  }

  try {
    const code = await fetch(url).then(r => r.text());

    let fn;
    try {
      fn = new Function("req", "res", code);
    } catch (err) {
      return res.status(500).send("❌ Gagal meng-compile kode: " + err.message);
    }

    try {
      await fn(req, res);
    } catch (err) {
      return res.status(500).send("❌ Gagal menjalankan kode: " + err.message);
    }
  } catch (err) {
    return res.status(500).send("⚠️ Gagal mengambil kode dari URL: " + err.message);
  }
}