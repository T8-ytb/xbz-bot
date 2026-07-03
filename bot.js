require("dotenv").config();

const express = require("express");
const app = express();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

app.use(express.json());

// IDS
const STAFF_CHANNEL_ID = "1522304854310256680";
const LOG_CHANNEL_ID = "1522335394522333275";

// DISCORD CLIENT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

// READY
client.once("ready", () => {
  console.log("🟢 BOT CONNECTÉ :", client.user.tag);
});

// =======================
// ROUTE RECRUTEMENT
// =======================
app.post("/recrutement", async (req, res) => {
  try {

    console.log("🔥 CANDIDATURE REÇUE :", req.body);

    const data = req.body;

    const id = "XBZ-" + Date.now();

    const embed = new EmbedBuilder()
      .setTitle("🦇 NOUVELLE CANDIDATURE XBZ")
      .setColor(0xff7a00)
      .addFields(
        { name: "ID", value: id },
        { name: "Nom", value: data.nom || "N/A" },
        { name: "Âge", value: data.age || "N/A" },
        { name: "Discord", value: data.discord || "N/A" },
        { name: "Pseudo", value: data.pseudo || "N/A" },
        { name: "Motivation", value: data.motiv || "N/A" }
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`accept_${id}`)
        .setLabel("Accepter")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId(`refuse_${id}`)
        .setLabel("Refuser")
        .setStyle(ButtonStyle.Danger)
    );

    const channel = await client.channels.fetch(STAFF_CHANNEL_ID);

    if (!channel) {
      console.log("❌ Salon recrutement introuvable");
      return res.sendStatus(500);
    }

    await channel.send({
      embeds: [embed],
      components: [row]
    });

    // LOGS
    const log = await client.channels.fetch(LOG_CHANNEL_ID);
    if (log) {
      log.send(`📩 Nouvelle candidature : **${data.nom || "inconnu"}**`);
    }

    console.log("📨 ENVOYÉ SUR DISCORD");

    return res.sendStatus(200);

  } catch (err) {
    console.error("❌ ERREUR :", err);
    return res.sendStatus(500);
  }
});

// HOME
app.get("/", (req, res) => {
  res.send("XBZ BOT ONLINE ✔");
});

// START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🌐 SERVER ON PORT", PORT);
});

// LOGIN DISCORD
client.login(process.env.TOKEN);
