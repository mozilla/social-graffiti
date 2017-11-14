'use strict';

const uuid = require('./uuid');

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

const codeChars = 'abcdefghijklmnopqrstuvwxyz0123456789'
const codeLength = 6

function generateCode(){
	let results = []
	for(let i=0; i < codeLength; i++){
		results.push(codeChars[getRandomIntInclusive(0, codeChars.length - 1)])
	}
	return results.join('')
}

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('User', {
		uuid:  { type: DataTypes.STRING, primaryKey: true, defaultValue: uuid },
		email: { type: DataTypes.STRING, unique: true },
		code:  { type: DataTypes.STRING, unique: true, defaultValue: generateCode }
	});
};
