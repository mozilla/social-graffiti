'use strict';
// Exports a singleton, connected, synced Sequelize instance using sqlite

const path = require('path');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite')
});

const db = {
	sequelize: sequelize
}

db.User = sequelize.import(path.join(__dirname, 'user.js'));
db.User.sync()

db.Content = sequelize.import(path.join(__dirname, 'content.js'));
db.Content.belongsTo(db.User, { as: 'owner' })
db.Content.sync()

db.Anchor = sequelize.import(path.join(__dirname, 'anchor.js'));
db.Anchor.belongsTo(db.User, { as: 'owner' })
db.Anchor.sync()

db.AnchoredContent = sequelize.import(path.join(__dirname, 'anchoredContent.js'));
db.AnchoredContent.belongsTo(db.Anchor)
db.AnchoredContent.belongsTo(db.Content)
db.AnchoredContent.sync()

module.exports = { db };
