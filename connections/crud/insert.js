module.exports = {
	async insertUsers(pool, discordId, discordNickname, creationDate, actualLvl, subActive) {

		await pool.query('INSERT INTO baitybot.users ' + '("id_discord", "discord_name", "account_creation_date","actual_lvl","sub_active") ' + 'VALUES ($1, $2, $3, $4, $5)', [discordId, discordNickname, creationDate, actualLvl, subActive]);

	}, async insertMinecraft(pool, minecraft, terraria, satisfactory, projectZomboid, id_discord) {

		await pool.query('INSERT INTO baitybot.nicknames ' + '("minecraft", "terraria", "satisfactory", "project_zomboid", "id_discord") ' + 'VALUES ($1, $2, $3, $4, $5)', [minecraft, terraria, satisfactory, projectZomboid, id_discord]);

	},
};
