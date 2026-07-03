require("./server");

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

// IDs
const STAFF_CHANNEL_ID = "1522304854310256680";
const LOG_CHANNEL_ID = "1522335394522333275";

// Client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// ---------------- READY ----------------
client.on("ready", () => {
  console.log("🟢 CONNECTÉ DISCORD :", client.user.tag);
});

// ---------------- API RECRUTEMENT ----------------
app.post("/recrutement", async (req, res) => {
  try {

    console.log("🔥 REQUÊTE REÇUE !");
    console.log("📩 DATA :", req.body);

    const data = req.body;

    const id = "XBZ-" + Date.now();

    const embed = new EmbedBuilder()
      .setTitle("🦇 CANDIDATURE XBZ")
      .setColor(0xff7a00)
      .addFields(
        { name: "ID", value: id },
        { name: "Nom", value: data.nom || "N/A" },
        { name: "Âge", value: data.age || "N/A" },
        { name: "Discord", value: data.discord || "N/A" },
        { name: "Pseudo", value: data.pseudo || "N/A" },
        { name: "Jeu", value: data.jeu || "N/A" },
        { name: "Rang", value: data.rang || "N/A" },
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
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId(`interview_${id}`)
        .setLabel("Entretien")
        .setStyle(ButtonStyle.Secondary)
    );

    const channel = await client.channels.fetch(STAFF_CHANNEL_ID);

    if (!channel) {
      console.log("❌ Salon introuvable !");
      return res.sendStatus(500);
    }

    await channel.send({
      embeds: [embed],
      components: [row]
    });

    console.log("📨 ENVOYÉ SUR DISCORD");

    res.sendStatus(200);

  } catch (err) {
    console.error("❌ ERREUR :", err);
    res.status(500).send("Erreur serveur");
  }
});

// ---------------- BOUTONS ----------------
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const [action, id] = interaction.customId.split("_");

  const logChannel = await client.channels.fetch(LOG_CHANNEL_ID);

  if (!logChannel) return;

  if (action === "accept") {
    await interaction.update({
      content: `🟢 CANDIDATURE ${id} ACCEPTÉE par ${interaction.user.tag}`,
      components: []
    });

    await logChannel.send(`✔ Candidature ${id} ACCEPTÉE`);
  }

  if (action === "refuse") {
    await interaction.update({
      content: `🔴 CANDIDATURE ${id} REFUSÉE par ${interaction.user.tag}`,
      components: []
    });

    await logChannel.send(`❌ Candidature ${id} REFUSÉE`);
  }

  if (action === "interview") {
    await interaction.update({
      content: `🟡 ENTRETIEN pour ${id} par ${interaction.user.tag}`,
      components: []
    });

    await logChannel.send(`🟡 Entretien demandé`);
  }
});

// ---------------- HOME ----------------
app.get("/", (req, res) => {
  res.send("XBZ PANEL ONLINE ✔");
});

// ---------------- START ----------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🌐 Panel XBZ actif sur port", PORT);
});

// ---------------- LOGIN ----------------
client.login(process.env.TOKEN);
