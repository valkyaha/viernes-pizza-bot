const { Events, roleMention } = require('discord.js');
const { minecraftButtonHandler, zombieButtonHandler } = require('./handlers/buttonHandler');
const { minecraftRCONConnection, projectZombieRCONConnection } = require('./handlers/RCONCommandHandler');
const { databaseUsername, databaseNicknames, databaseZombie } = require('../connections/database');

const allowedRoles = ['1052635783816810526', '956242154353721374', '940767720981544982', '940614159119294464', '940613462701260802', '940588435218006079'];

module.exports = {
	name: Events.InteractionCreate, async execute(interaction) {
		try {
			if (interaction.isButton()) {
				console.log(`${interaction.user.tag} in #${interaction.channel.name}`);

				if (interaction.customId === 'minecraft') {
					return interaction.showModal(await minecraftButtonHandler());
				}

				if (interaction.customId === 'zombie') {
					return interaction.showModal(await zombieButtonHandler());
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

						if (allowedRoles.some(role => interaction.member.roles.cache.has(role))) {
							await databaseUsername(interaction.user, 'Subscriber', true);
							await databaseNicknames(interaction.user, minecraftUsername, null, null, null, interaction.user.id);

							await minecraftRCONConnection(minecraftUsername);

							await interaction.reply({
								content: `Hola ${interaction.user.tag} aquí tienes la IP para acceder a Minecraft!\nIP: ${minecraftHost}\n`,
								ephemeral: true,
							});
							return;
						}

						if (interaction.member.roles.cache.some(role => role.id === '1049677221977137203' || role.id === '1085537140416467075')) {
							await databaseUsername(interaction.user, 'LVL20-PrimilloXiko', false);
							await databaseNicknames(interaction.user, minecraftUsername, null, null, null, interaction.user.id);

							await minecraftRCONConnection(minecraftUsername);

							await interaction.reply({
								content: `Hola ${interaction.user.tag} aquí tienes la IP para acceder a Minecraft!\nIP: ${minecraftHost}\n`,
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
							content: `Ya estás en la whitelist`, ephemeral: true,
						});
					}
				}


				if (interaction.customId === 'zombieModal') {
					const zombieUsername = interaction.fields.getTextInputValue('zombieUsernameInput');
					const zombiePassword = interaction.fields.getTextInputValue('zombiePasswordInput');
					const zombieHost = process.env.SERVER_HOST;


					try {
						if (allowedRoles.some(role => interaction.member.roles.cache.has(role))) {
							await databaseUsername(interaction.user, 'Subscriber', true);
							await databaseZombie(interaction.user, null, null, null, zombieUsername, interaction.user.id);
							await projectZombieRCONConnection(zombieUsername, zombiePassword);

							await interaction.reply({
								content: `Hola ${interaction.user.tag} aquí tienes la IP para acceder a Project Zomboid!\nIP: ${zombieHost}\n`,
								ephemeral: true,
							});
							return;
						}

						if (interaction.member.roles.cache.some(role => role.id === '1049677221977137203' || role.id === '1085537140416467075')) {
							await databaseUsername(interaction.user, 'LVL20-PrimilloXiko', false);
							await databaseNicknames(interaction.user, zombieUsername, null, null, null, interaction.user.id);

							await projectZombieRCONConnection(zombieUsername, zombiePassword);

							await interaction.reply({
								content: `Hola ${interaction.user.tag} aquí tienes la IP para acceder a Minecraft!\nIP: ${zombieHost}\n`,
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
							content: `Ya estás en la whitelist`, ephemeral: true,
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
