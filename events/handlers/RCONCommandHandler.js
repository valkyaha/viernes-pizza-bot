const util = require('minecraft-server-util');
require('dotenv').config();
const remoteConsole = require('../../utils/remoteConsole/RCON');

module.exports = {
	async minecraftRCONConnection(username) {
		const client = new util.RCON();
		client.on('message', async (data) => {
			console.log(data);
		});

		const connectOpt = {
			timeout: 1000 * 5,
		};

		const loginOpt = {
			timeout: 1000 * 5,
		};

		try {
			await client.connect(process.env.SERVER_HOST, parseInt(process.env.SERVER_RCON_HOST_PORT), connectOpt);
			await client.login(process.env.MINECRAFT_RCON_PASSWORD, loginOpt);
			await client.run(`whitelist add ${username}`);
			client.close();
		} catch (err) {
			console.log(err);
		}
	},

	async projectZombieRCONConnection(username, password) {

		let conn = new remoteConsole('localhost', 27015, process.env.PZOMBOID_RCON_PASSWORD);

		conn.on('auth', function() {
			console.log('Sending command:');
			conn.send(`adduser ${username} ${password}`);
		}).on('response', function(str) {
			console.log('Response: ' + str);
		}).on('error', function(err) {
			console.log('Error: ' + err);
		}).on('end', function() {
			console.log('Connection closed');
			process.exit();
		});

		conn.connect();
	},
};