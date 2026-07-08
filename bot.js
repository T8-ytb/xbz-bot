const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

// =====================
// CONFIG
// =====================
const STAFF_CHANNEL_ID = "1522304854310256680";
const LOG_CHANNEL_ID = "1522335394522333275";

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
    console.log("🎮 JEU :", data.jeu);
console.log("🔗 RL TRACKER :", data.rltracker);

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

     const fields = [
  { name: "👤 Nom", value: data.nom || "N/A", inline: true },
  { name: "🎂 Âge", value: data.age || "N/A", inline: true },
  { name: "💬 Discord", value: data.discord || "N/A", inline: false },
  { name: "🎮 Pseudo", value: data.pseudo || "N/A", inline: true },
  { name: "🕹 Jeu", value: data.jeu || "N/A", inline: true },
  { name: "🏆 Rang", value: data.rang || "N/A", inline: true }
];

// Ajoute RL Tracker uniquement pour Rocket League
if (data.jeu?.trim() === "Rocket League") {
  fields.push({
    name: "🔗 RL Tracker",
    value: data.rltracker
      ? `[Voir le profil RL Tracker](${data.rltracker})`
      : "Non renseigné",
    inline: false
  });
}

fields.push({
  name: "🧠 Motivation",
  value: data.motiv || "N/A"
});
const embed = new EmbedBuilder()
  .setTitle("🦇 NOUVELLE CANDIDATURE XBZ")
  .setColor(0x0066FF)
  .setDescription(`🆔 ID : **${id}**`)
  .addFields(fields)
  .setFooter({ text: "XBZ Recrutement System" })
  .setTimestamp();
    const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId(`accept_${id}`)
    .setLabel("✅ Accepter")
    .setStyle(ButtonStyle.Success),

  new ButtonBuilder()
    .setCustomId(`refuse_${id}`)
    .setLabel("❌ Refuser")
    .setStyle(ButtonStyle.Danger),

  new ButtonBuilder()
    .setCustomId(`interview_${id}`)
    .setLabel("🟡 Entretien")
    .setStyle(ButtonStyle.Secondary)
);

await channel.send({
  embeds: [embed],
  components: [row]
});

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
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const [action, id] = interaction.customId.split("_");

  try {
    const logChannel = await client.channels.fetch(LOG_CHANNEL_ID).catch(() => null);

    // =====================
    // ACCEPT
    // =====================
    if (action === "accept") {
      await interaction.update({
        content: `🟢 CANDIDATURE **${id}** ACCEPTÉE par ${interaction.user.tag}`,
        components: []
      });

      if (logChannel) {
        logChannel.send(`✔ Candidature **${id}** ACCEPTÉE`);
      }
      return;
    }

    // =====================
    // REFUSE
    // =====================
    if (action === "refuse") {
      await interaction.update({
        content: `🔴 CANDIDATURE **${id}** REFUSÉE par ${interaction.user.tag}`,
        components: []
      });

      if (logChannel) {
        logChannel.send(`❌ Candidature **${id}** REFUSÉE`);
      }
      return;
    }

    // =====================
    // INTERVIEW (MODE ATTENTE)
    // =====================
    if (action === "interview") {

      const newRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`accept_${id}`)
          .setLabel("✅ Accepter")
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId(`refuse_${id}`)
          .setLabel("❌ Refuser")
          .setStyle(ButtonStyle.Danger)
      );

      await interaction.update({
        content:
          `🟡 CANDIDATURE **${id}** EN ENTREVUE\n\n` +
          `👤 Demandé par ${interaction.user.tag}\n` +
          `⏳ Statut : EN ATTENTE D'ENTRETIEN`,
        components: [newRow]
      });

      if (logChannel) {
        logChannel.send(`🟡 Entretien demandé pour **${id}**`);
      }

      return;
    }

  } catch (err) {
    console.error("❌ BUTTON ERROR :", err);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "❌ Erreur bouton",
        ephemeral: true
      });
    }
  }
});
