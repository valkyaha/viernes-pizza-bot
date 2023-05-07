module.exports = {
	async insertUsers(connection, discordId, discordNickname, creationDate, actualLvl, subActive) {
		await new Promise((resolve, reject) => {
			connection.query(`
      INSERT INTO users (id_discord, discord_name, account_creation_date, actual_lvl, sub_active)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        discord_name = VALUES(discord_name),
        account_creation_date = VALUES(account_creation_date),
        actual_lvl = VALUES(actual_lvl),
        sub_active = VALUES(sub_active)
    `, [discordId, discordNickname, creationDate, actualLvl, subActive], (error, results) => {
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
			// Check if the user exists in the database
			connection.query('SELECT * FROM nicknames WHERE id_discord = ?', [id_discord], (error, results) => {
				if (error) {
					console.log(error);
					reject(error);
				}
				else {
					if (results.length > 0) {
						// User already exists in the database
						const oldMinecraft = results[0].minecraft;
						const oldTerraria = results[0].terraria;
						const oldSatisfactory = results[0].satisfactory;
						const oldProjectZomboid = results[0].project_zomboid;
						if (minecraft !== null && minecraft !== oldMinecraft) {
							connection.query(`UPDATE nicknames SET minecraft = ? WHERE id_discord = ?`, [minecraft, id_discord], (error, results) => {
								if (error) {
									console.log(error);
									reject(error);
								}
								else {
									resolve(results);
								}
							});
						}
						if (terraria !== null && terraria !== oldTerraria) {
							connection.query(`UPDATE nicknames SET terraria = ? WHERE id_discord = ?`, [terraria, id_discord], (error, results) => {
								if (error) {
									console.log(error);
									reject(error);
								}
								else {
									resolve(results);
								}
							});
						}
						if (satisfactory !== null && satisfactory !== oldSatisfactory) {
							connection.query(`UPDATE nicknames SET satisfactory = ? WHERE id_discord = ?`, [satisfactory, id_discord], (error, results) => {
								if (error) {
									console.log(error);
									reject(error);
								}
								else {
									resolve(results);
								}
							});
						}
						if (projectZomboid !== null && projectZomboid !== oldProjectZomboid) {
							connection.query(`UPDATE nicknames SET project_zomboid = ? WHERE id_discord = ?`, [projectZomboid, id_discord], (error, results) => {
								if (error) {
									console.log(error);
									reject(error);
								}
								else {
									resolve(results);
								}
							});
						}
						if (minecraft === null) {
							minecraft = oldMinecraft;
						}
						if (terraria === null) {
							terraria = oldTerraria;
						}
						if (satisfactory === null) {
							satisfactory = oldSatisfactory;
						}
						if (projectZomboid === null) {
							projectZomboid = oldProjectZomboid;
						}
						resolve(results);
					}
					else {
						// User does not exist in the database
						connection.query(`INSERT INTO nicknames (minecraft, terraria, satisfactory, project_zomboid, id_discord) VALUES (?, ?, ?, ?, ?)`, [minecraft, terraria, satisfactory, projectZomboid, id_discord], (error, results) => {
							if (error) {
								console.log(error);
								reject(error);
							}
							else {
								resolve(results);
							}
						});
					}
				}
			});
		});
	},
};
