const { Pool } = require('pg');
const { insertUsers, insertMinecraft } = require('./crud/insert');
require('dotenv').config();

const clientData = {
	user: process.env.DATABASE_USER,
	host: process.env.DATABASE_HOST,
	database: process.env.DATABASE_SCHEMA,
	password: process.env.DATABASE_PASSWORD,
	port: parseInt(process.env.DATABASE_PORT),
};

module.exports = {
	async databaseConnection(userData, lvl, isSubActive) {
		const pool = new Pool(clientData);
		await insertUsers(pool, BigInt(userData.id), userData.tag, userData.createdAt, lvl, isSubActive);
		pool.end();
	}, async databaseMinecraft(userData, minecraft, terraria, satisfactory, projectZomboid, idDiscord) {
		const pool = new Pool(clientData);
		await insertMinecraft(pool, minecraft, terraria, satisfactory, projectZomboid, idDiscord);
		pool.end();
	},
};