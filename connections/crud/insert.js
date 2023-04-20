module.exports = {
	async insertUsers(connection, discordId, discordNickname, creationDate, actualLvl, subActive) {
	  await new Promise((resolve, reject) => {
		connection.query(
		  'INSERT INTO users (id_discord, discord_name, account_creation_date, actual_lvl, sub_active) VALUES (?, ?, ?, ?, ?)',
		  [discordId, discordNickname, creationDate, actualLvl, subActive],
		  (error, results) => {
			if (error) {
			  reject(error);
			} else {
			  resolve(results);
			}
		  }
		);
	  });
	},
	async insertMinecraft(connection, minecraft, terraria, satisfactory, projectZomboid, id_discord) {
	  await new Promise((resolve, reject) => {
		connection.query(
		  'INSERT INTO nicknames (minecraft, terraria, satisfactory, project_zomboid, id_discord) VALUES (?, ?, ?, ?, ?)',
		  [minecraft, terraria, satisfactory, projectZomboid, id_discord],
		  (error, results) => {
			if (error) {
			  reject(error);
			} else {
			  resolve(results);
			}
		  }
		);
	  });
	},
  };
  