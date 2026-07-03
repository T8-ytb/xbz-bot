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

const STAFF_CHANNEL_ID = "1522304854310256680";
const LOG_CHANNEL_ID = "1522335394522333275";

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

// ---------------- RECRUTEMENT API ----------------
app.post("/recrutement", async (req, res) => {
  try {
    const data = req.body;

    const id = "XBZ-" + Date.now();

    const embed = new EmbedBuilder()
      .setTitle("🦇 CANDIDATURE XBZ")
      .setColor(0xff7a00)
      .addFields(
        { name: "ID", value: id },
        { name: "Nom", value: data.nom || "N/A" },
        { name: "Âge", value: data.age || "N/A" },
        { name: "Pays résidence", value: data.pays1 || "N/A" },
        { name: "Pays naissance", value: data.pays2 || "N/A" },
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

    await channel.send({
      embeds: [embed],
      components: [row]
    });

    res.sendStatus(200);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});
console.log("📩 DATA REÇUE :", req.body);
console.log("📢 ENVOI SALON :", STAFF_CHANNEL_ID);
// ---------------- BOUTONS STAFF ----------------
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const [action, id] = interaction.customId.split("_");

  const logChannel = await client.channels.fetch(LOG_CHANNEL_ID);

  // ACCEPT
  if (action === "accept") {
    await interaction.update({
      content: `🟢 CANDIDATURE ${id} ACCEPTÉE par ${interaction.user.tag}`,
      components: []
    });

    await logChannel.send(`✔ Candidature ${id} ACCEPTÉE par ${interaction.user.tag}`);
  }

  // REFUSE
  if (action === "refuse") {
    await interaction.update({
      content: `🔴 CANDIDATURE ${id} REFUSÉE par ${interaction.user.tag}`,
      components: []
    });

    await logChannel.send(`❌ Candidature ${id} REFUSÉE par ${interaction.user.tag}`);
  }

  // INTERVIEW
  if (action === "interview") {
    await interaction.update({
      content: `🟡 ENTRETIEN DEMANDÉ pour ${id} par ${interaction.user.tag}`,
      components: []
    });

    await logChannel.send(`🟡 Entretien demandé pour ${id} par ${interaction.user.tag}`);
  }
});

// ---------------- WEB PANEL ----------------
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
