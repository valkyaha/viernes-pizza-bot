const mysql = require('mysql');
const { insertUsers, insertMinecraft, insertZomboid } = require('./crud/insert');
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
    const connection = mysql.createConnection(clientData);
    connection.connect();

    connection.changeUser({ database: clientData.database });

    await insertUsers(connection, BigInt(userData.id), userData.tag, userData.createdAt, lvl, isSubActive);

    connection.end();
  },
  async databaseMinecraft(userData, minecraft, terraria, satisfactory, projectZomboid, idDiscord) {
    const connection = mysql.createConnection(clientData);
    connection.connect();

    connection.changeUser({ database: clientData.database });

    await insertMinecraft(connection, minecraft, terraria, satisfactory, projectZomboid, idDiscord);

    connection.end();
  },
  async databaseZomboid(userData, minecraft, terraria, satisfactory, projectZomboid, idDiscord) {
    const connection = mysql.createConnection(clientData);
    connection.connect();

    connection.changeUser({ database: clientData.database });

    await insertZomboid(connection, minecraft, terraria, satisfactory, projectZomboid, idDiscord);

    connection.end();2
  },
};
