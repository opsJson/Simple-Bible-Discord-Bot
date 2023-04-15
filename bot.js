const {Client, GatewayIntentBits, EmbedBuilder} = require("discord.js");

const client = new Client({intents:[]});

const DiscordToken = "discord-token";

client.on("ready", () => {
	client.application.commands.create({
		name: "bible",
		description: "Manda uma citação.",
		options: [
		{
			name: "quote",
			description: "Exemplo: salmos 23:1-3",
			type: 3,
			required: true
		}]
	});
	console.log("Bible bot online!");
});

client.on("interactionCreate", async (interaction) => {
	const quote = interaction.options.getString("quote").trim();
	
	const response = await fetch(`https://bible-api.com/${quote}?translation=almeida`);
	
	if (response.status != 200) {
		interaction.reply({
			content: "Erro interno!",
			ephemeral: true
		});
		return;
	}
	
	const json = await response.json();
	
	let text = "";
	let flag = false;
	json.verses.forEach(verse => {
		const v = `${verse.verse}. ${verse.text.trim()}${"\n"}`;
		
		if (text.length + v.length > 4093) {
			flag = true;
			return;
		}
		text += v;
	});
	if (flag) text += "...";
	
	const embed = new EmbedBuilder()
		.setDescription(text)
		.setColor(0x2B2D31)
		.setFooter({text: json.reference});
	
	interaction.reply({
		embeds: [embed]
	});
});

client.login(DiscordToken);