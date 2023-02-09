const { Events } = require('discord.js');
const { minecraftButtonHandler } = require('./handlers/buttonHandler');
const { minecraftRCONConnection } = require('./handlers/minecraftCommandHandler');
const { databaseConnection, databaseMinecraft } = require('../connections/database');

module.exports = {
	name: Events.InteractionCreate, async execute(interaction) {

		if (interaction.isButton()) {
			console.log(`${interaction.user.tag} in #${interaction.channel.name} clicked the offense button.`);

			if (interaction.customId === 'minecraft') {
				return interaction.showModal(await minecraftButtonHandler());
			}

			return;
		}

		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		}

		if (interaction.isModalSubmit()) {
			if (interaction.customId === 'minecraftModal') {

				const minecraftUsername = interaction.fields.getTextInputValue('minecraftInput');
				const minecraftHost = process.env.SERVE_IP_ADDRESS_MINECRAFT;
				const minecraftPort = process.env.SERVER_HOST_PORT;

				try {
					if (interaction.member.roles.cache.some(role => role.name === 'YouTube Member') || interaction.member.roles.cache.some(role => role.name === 'Twitch Subscriber') || interaction.member.roles.cache.some(role => role.name === 'Server Booster')) {
						await databaseConnection(interaction.user, 'Subscriber', true);
						await databaseMinecraft(interaction.user, minecraftUsername, null, null, null, interaction.user.id);

						await minecraftRCONConnection(minecraftUsername);

						await interaction.reply({
							content: `Hola ${interaction.user.tag} aquí tienes la IP para acceder a Minecraft!\nIP: ${minecraftHost}\nPuerto: ${minecraftPort}`,
							ephemeral: true,
						});
						return;
					}

					if (interaction.member.roles.cache.some(role => role.name === 'LVL20-PrimilloXiko')) {

						await databaseConnection(interaction.user, 'LVL20-PrimilloXiko', false);
						await databaseMinecraft(interaction.user, minecraftUsername, null, null, null, interaction.user.id);

						await minecraftRCONConnection(minecraftUsername);

						await interaction.reply({
							content: `Hola ${interaction.user.tag} aquí tienes la IP para acceder a Minecraft!\nIP: ${minecraftHost}\nPuerto: ${minecraftPort}`,
							ephemeral: true,
						});

						return;
					}

					await interaction.reply({
						content: `Hola ${interaction.user.tag} no tienes los requisitos necesarios para acceder al servidor\n
						Si crees que esto es un error abre un ticket a moderación y revisaremos tu caso`,
						ephemeral: true,
					});


				} catch (err) {
					await interaction.reply({
						content: `Ya estas en la whitelist`, ephemeral: true,
					});
				}
			}
		}

		console.log(`${interaction.user.user} in #${interaction.channel.name} triggered an interaction.`);
	},
};

