const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
module.exports = {
	async minecraftButtonHandler() {
		const modal = new ModalBuilder()
			.setCustomId('minecraftModal')
			.setTitle('Baity Minecraft');
		const minecraftInput = new TextInputBuilder()
			.setCustomId('minecraftInput')
			.setLabel('Nick de minecraft')
			.setStyle(TextInputStyle.Short);
		const firstActionRow = new ActionRowBuilder().addComponents(minecraftInput);
		modal.addComponents(firstActionRow);
		return modal;
	},
	async zomboidButtonHandler() {

		const modal = new ModalBuilder()
			.setCustomId('zomboidModal')
			.setTitle('Baity Zomboid');

		const zomboidInput = new TextInputBuilder()
			.setCustomId('zomboidUsernameInput')
			.setLabel('Nick de Zomboid')
			.setStyle(TextInputStyle.Short);

		const zomboidInputPassword = new TextInputBuilder()
			.setCustomId('zomboidPasswordInput')
			.setLabel('Password de Zomboid')
			.setStyle(TextInputStyle.Short);

		modal.addComponents(new ActionRowBuilder().addComponents(zomboidInput));
		modal.addComponents(new ActionRowBuilder().addComponents(zomboidInputPassword));
		return modal;
	},
};