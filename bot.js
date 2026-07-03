const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const express = require("express");
const bodyParser = require("body-parser");

const TOKEN = process.env.TOKEN;
const STAFF_CHANNEL_ID = "1522304854310256680";
const LOG_CHANNEL_ID = "1522335394522333275";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

const app = express();
app.use(bodyParser.json());

app.post("/recrutement", async (req, res) => {
  const data = req.body;

  const embed = new EmbedBuilder()
    .setTitle("🦇 CANDIDATURE XBZ")
    .setColor(0xff7a00)
    .addFields(
      { name: "Pseudo", value: data.pseudo || "N/A" },
      { name: "Âge", value: data.age || "N/A" },
      { name: "Discord", value: data.discord || "N/A" },
      { name: "Jeu", value: data.jeu || "N/A" },
      { name: "Rang", value: data.rang || "N/A" },
      { name: "Tracker RL", value: data.tracker || "N/A" },
      { name: "Motivation", value: data.motivation || "N/A" }
    );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`accept_${Date.now()}`)
      .setLabel("Accepter")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId(`refuse_${Date.now()}`)
      .setLabel("Refuser")
      .setStyle(ButtonStyle.Danger)
  );

  const channel = await client.channels.fetch(STAFF_CHANNEL_ID);
  channel.send({ embeds: [embed], components: [row] });

  res.sendStatus(200);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;

  const [action] = interaction.customId.split("_");

  if (action === "accept") {
    await interaction.reply({ content: "✅ Candidature ACCEPTÉE", ephemeral: true });
  }

  if (action === "refuse") {
    await interaction.reply({ content: "❌ Candidature REFUSÉE", ephemeral: true });
  }
});

client.login(TOKEN);

app.listen(3000, () => {
  console.log("🔥 Bot XBZ actif sur port 3000");
});
