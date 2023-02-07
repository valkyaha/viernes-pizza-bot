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
};