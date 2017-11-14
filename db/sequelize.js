'use strict';
// Exports a singleton, connected Sequelize instance using sqlite

const path = require('path');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite')
});

const db = {
	sequelize: sequelize
}
db.User = sequelize.import(path.join(__dirname, 'user.js'));
db.User.sync()

module.exports = { db };
