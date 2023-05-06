const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Prepara lo necesario para la Whitelist'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('BaityServer')
			.setURL('https://discord.js.org')
			.setDescription('Aquí podrás preparar todo lo necesario para entrar en el servidor del Baity, solo tienes que' +
				' pulsar el botón del juego y seguir los pasos que se mostrarán a continuación');
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('minecraft')
					.setLabel('Minecraft')
					.setStyle(ButtonStyle.Primary),

				new ButtonBuilder()
					.setCustomId('zombie')
					.setLabel('PZomboid')
					.setStyle(ButtonStyle.Primary),
			);

		await interaction.reply({ embeds: [embed], components: [row] });
	},
};