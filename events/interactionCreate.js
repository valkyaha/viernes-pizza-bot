const { Events, MessageActionRow, MessageButton } = require('discord.js');
const { minecraftButtonHandler } = require('./handlers/buttonHandler');
const { minecraftRCONConnection } = require('./handlers/minecraftCommandHandler');
const wait = require('node:timers/promises').setTimeout;
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		if (interaction.isButton()) {
			console.log(`${interaction.user.tag} in #${interaction.channel.name} clicked the offense button.`);

			if (interaction.customId === 'primary') {
				console.log(`${interaction.user.tag} in #${interaction.channel.name} clicked the offense button.`);
				const ActionRow = new MessageActionRow().setComponents(new MessageButton() // Create the button inside of an action Row
					.setCustomId('CustomId')
					.setLabel('Label')
					.setStyle('PRIMARY'));
				return interaction.update({ content: 'Hey', components: [ActionRow], ephemeral: true });
			}

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

		if (interaction.isSelectMenu()) {
			console.log('Pressed one item');
			if (interaction.customId === 'test') {
				const selected = interaction.values[0];
				if (selected === 'first_option') {
					console.log('First!');
					await interaction.update({ content: 'Something was selected!', components: [] });
				}
				if (selected === 'second_option') {
					console.log('First');
					await interaction.deferUpdate();
					await wait(4000);
					await interaction.editReply({ content: 'Something was selected!', components: [] });
				}
			}
		}

		if (interaction.isModalSubmit()) {
			if (interaction.customId === 'minecraftModal') {
				console.log('TEST2');
				const favoriteColor = interaction.fields.getTextInputValue('minecraftInput');
				minecraftRCONConnection(favoriteColor);
				console.log({ favoriteColor });
				const minecraftHost = process.env.SERVER_HOST;
				const minecraftPort = process.env.SERVER_HOST_PORT;
				// await interaction.reply({
				// 	content: `Hola ${interaction.user.tag} aquí tienes la IP para acceder a Miecraft!\nIP: ${minecraftHost}\nPuerto: ${minecraftPort}`,
				// 	ephemeral: true,
				// });
				await interaction.reply({
					content: `Hola ${interaction.user.tag} aquí tienes la IP para acceder a Miecraft!\nIP:`,
					ephemeral: true,
				});
			}
		}

		console.log(`${interaction.user.user} in #${interaction.channel.name} triggered an interaction.`);
	},
};
