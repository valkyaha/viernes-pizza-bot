module.exports = {
	async insertUsers(connection, discordId, discordNickname, creationDate, actualLvl, subActive) {
		await new Promise((resolve, reject) => {
			connection.query('INSERT INTO users (id_discord, discord_name, account_creation_date, actual_lvl, sub_active) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE discord_name = ?, account_creation_date = ?, actual_lvl = ?, sub_active = ?', [discordId, discordNickname, creationDate, actualLvl, subActive, discordNickname, creationDate, actualLvl, subActive], (error, results) => {
				if (error) {
					console.log(error);
					reject(error);
				}
				else {
					resolve(results);
				}
			});
		});
	}, async insertNickname(connection, minecraft, terraria, satisfactory, projectZomboid, id_discord) {
		await new Promise((resolve, reject) => {
			connection.query('INSERT INTO nicknames (minecraft, terraria, satisfactory, project_zomboid, id_discord) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE minecraft = ?, terraria = ?, satisfactory = ?, project_zomboid = ?', [minecraft, terraria, satisfactory, projectZomboid, id_discord, minecraft, terraria, satisfactory, projectZomboid], (error, results) => {
				if (error) {
					console.log(error);
					reject(error);
				}
				else {
					resolve(results);
				}
			});
		});
	},
};
