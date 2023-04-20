const { Events } = require('discord.js');
const { minecraftButtonHandler } = require('./handlers/buttonHandler');
const { minecraftRCONConnection } = require('./handlers/minecraftCommandHandler');
const { databaseConnection, databaseMinecraft } = require('../connections/database');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		try {
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

					try {
						if (
							interaction.member.roles.cache.some(
								role =>
									role.id === '1052635783816810526' ||
									role.id === '956242154353721374' ||
									role.id === '940767720981544982' ||
									role.id === '940614159119294464' ||
									role.id === '940613462701260802' ||
									role.id === '940588435218006079'
							)
						) {
							await databaseConnection(interaction.user, 'Subscriber', true);
							await databaseMinecraft(interaction.user, minecraftUsername, null, null, null, interaction.user.id);

							await minecraftRCONConnection(minecraftUsername);

							await interaction.reply({
								content: `Hola ${interaction.user.tag} aquí tienes la IP para acceder a Minecraft!\nIP: ${minecraftHost}\n`,
								ephemeral: true,
							});
							return;
						}

						if (
							interaction.member.roles.cache.some(
								role => role.id === '1049677221977137203' || role.id === '1085537140416467075'
							)
						) {
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
							content: `Hola ${interaction.user.tag} no tienes los requisitos necesarios para acceder al servidor\nSi crees que esto es un error abre un ticket a moderación y revisaremos tu caso`,
							ephemeral: true,
						});
					} catch (err) {
						await interaction.reply({
							content: `Ya estás en la whitelist`,
							ephemeral: true,
						});
					}
				}
			}

			console.log(`${interaction.user.user} in #${interaction.channel.name} triggered an interaction.`);
		} catch (err) {
			console.error(err);
		}
	},
};
