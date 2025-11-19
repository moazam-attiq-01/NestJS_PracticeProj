export default function handler(req, res) {
  console.log("Ping function executed");
  res.status(200).json({ ok: true });
}
