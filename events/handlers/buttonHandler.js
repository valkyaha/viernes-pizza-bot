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
	}, async zombieButtonHandler() {

		const modal = new ModalBuilder()
			.setCustomId('zombieModal')
			.setTitle('Baity Zomboid');

		const zombieInput = new TextInputBuilder()
			.setCustomId('zombieUsernameInput')
			.setLabel('Nick de Zomboid')
			.setStyle(TextInputStyle.Short);

		const zombieInputPassword = new TextInputBuilder()
			.setCustomId('zombiePasswordInput')
			.setLabel('Password de Zomboid')
			.setStyle(TextInputStyle.Short);

		modal.addComponents(new ActionRowBuilder().addComponents(zombieInput));
		modal.addComponents(new ActionRowBuilder().addComponents(zombieInputPassword));
		return modal;
	},
};