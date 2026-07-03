const express = require("express");
const app = express();
const cors = require("cors");

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} = require("discord.js");

// =====================
// CONFIG
// =====================
const STAFF_CHANNEL_ID = "1522304854310256680";
const LOG_CHANNEL_ID = "1522335394522333275";

app.use(cors());
app.use(express.json());

// =====================
// DISCORD BOT
// =====================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

client.once("ready", () => {
  console.log("🟢 BOT CONNECTÉ :", client.user.tag);
});

// =====================
// API RECRUTEMENT
// =====================
app.post("/recrutement", async (req, res) => {
  try {

    console.log("🔥 REQUÊTE REÇUE :", req.body);

    const data = req.body;

    // ID unique propre
    const id = `XBZ-${Date.now()}`;

    const channel = await client.channels.fetch(STAFF_CHANNEL_ID);
    const logChannel = await client.channels.fetch(LOG_CHANNEL_ID);

    if (!channel) {
      console.log("❌ Salon recrutement introuvable");
      return res.status(500).send("Channel not found");
    }

    // =========================
    // EMBED RECRUTEMENT (PROPRE)
    // =========================
    const embed = new EmbedBuilder()
      .setTitle("🦇 NOUVELLE CANDIDATURE XBZ")
      .setColor(0xff7a00)
      .setDescription(`🆔 ID : **${id}**`)
      .addFields(
        { name: "👤 Nom", value: data.nom || "N/A", inline: true },
        { name: "🎂 Âge", value: data.age || "N/A", inline: true },
        { name: "💬 Discord", value: data.discord || "N/A", inline: false },
        { name: "🎮 Pseudo", value: data.pseudo || "N/A", inline: true },
        { name: "🕹 Jeu", value: data.jeu || "N/A", inline: true },
        { name: "🏆 Rang", value: data.rang || "N/A", inline: true },
        { name: "🧠 Motivation", value: data.motiv || "N/A" }
      )
      .setFooter({ text: "XBZ Recrutement System" })
      .setTimestamp();

    await channel.send({ embeds: [embed] });

    // =========================
    // LOGS COMPLETS
    // =========================
    if (logChannel) {
      await logChannel.send({
        content:
`📩 **Nouvelle candidature reçue**

🆔 ID : ${id}
👤 Nom : ${data.nom || "N/A"}
🎮 Pseudo : ${data.pseudo || "N/A"}
🎂 Âge : ${data.age || "N/A"}`
      });
    }

    console.log("📨 ENVOYÉ SUR DISCORD");

    return res.status(200).send("OK");

  } catch (err) {
    console.error("❌ ERREUR API :", err);
    return res.status(500).send("ERROR");
  }
});

// =====================
// HOME ROUTE
// =====================
app.get("/", (req, res) => {
  res.send("XBZ BOT ONLINE ✔");
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🌐 SERVER ON PORT", PORT);
});

// =====================
// LOGIN DISCORD
// =====================
client.login(process.env.TOKEN);
