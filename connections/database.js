const mysql = require('mysql');
const { insertUsers, insertNickname, insertZombie } = require('./crud/insert');
require('dotenv').config();

const clientData = {
	user: process.env.DATABASE_USER,
	host: process.env.DATABASE_HOST,
	database: process.env.DATABASE_SCHEMA,
	password: process.env.DATABASE_PASSWORD,
	port: parseInt(process.env.DATABASE_PORT),
};

module.exports = {
	async databaseUsername(userData, lvl, isSubActive) {
		const connection = mysql.createConnection(clientData);
		connection.connect();

		connection.changeUser({ database: clientData.database });

		await insertUsers(connection, BigInt(userData.id), userData.tag, userData.createdAt, lvl, isSubActive);

		connection.end();
	}, async databaseNicknames(userData, minecraft, terraria, satisfactory, projectZombie, idDiscord) {
		const connection = mysql.createConnection(clientData);
		connection.connect();

		connection.changeUser({ database: clientData.database });

		await insertNickname(connection, minecraft, terraria, satisfactory, projectZombie, idDiscord);

		connection.end();
	},
};
