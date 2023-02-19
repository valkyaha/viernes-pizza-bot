const util = require('minecraft-server-util');
require('dotenv').config();

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
			await (async () => {
				await client.connect(
					process.env.SERVER_HOST,
					parseInt(process.env.SERVER_RCON_HOST_PORT),
					connectOpt,
				);
				await client.login(process.env.MINECRAFT_RCON_PASSWORD, loginOpt);
				await client.run('whitelist add '+ username);
				client.close();
			})();
		} catch (err) {
			console.log(err);
		}
	},
};