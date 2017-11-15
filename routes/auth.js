"use strict";

const {db} = require('../db/sequelize');

let codeCookieName = 'socialGraffitiCode';


/*
Looks for the code cookie and if there looks for the User with that code.
The Promise resolves the user or null if there is no cookie or the code is unknown.
*/
function getUserFromRequest(request){
	return new Promise((resolve, reject) => {
		let code = request.cookies[codeCookieName];
		if(!code){
			resolve(null)
			return
		}
		db.User.findOne({ where: { code: code }}).then(user => {
			resolve(user)
		}).catch(err => {
			reject(err)
		})
	})
}

module.exports = {getUserFromRequest}