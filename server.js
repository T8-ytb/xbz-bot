const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// ⚠️ mot de passe simple (on pourra sécuriser après)
const PANEL_PASSWORD = "xbz123";

app.use(express.urlencoded({ extended: true }));

// 🌐 page panel
app.get("/", (req, res) => {
  res.send(`
    <h1>XBZ PANEL</h1>
    <p>Bot en ligne ✔</p>

    <form method="POST" action="/restart">
      <input name="password" placeholder="Mot de passe" />
      <button type="submit">Restart bot</button>
    </form>
  `);
});

// 🔁 restart du bot (Render redémarre le process)
app.post("/restart", (req, res) => {
  if (req.body.password !== PANEL_PASSWORD) {
    return res.send("❌ Mot de passe incorrect");
  }

  res.send("🔄 Redémarrage...");
  process.exit(1);
});

app.listen(PORT, () => {
  console.log("🌐 Panel XBZ actif sur port", PORT);
});
