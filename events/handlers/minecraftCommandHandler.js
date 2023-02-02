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

		console.log('Aqui llego');
		console.log(username);
		try {
			await (async () => {
				await client.connect(
					process.env.SERVER_HOST,
					parseInt(process.env.SERVER_HOST_PORT),
					connectOpt,
				);
				await client.login('Testing', loginOpt);
				await client.run('whitelist '+ username);
				client.close();
			})();
		} catch (err) {
			console.log(err);
		}
	},
};