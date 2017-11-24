import DataModel from  '../potassium/DataModel.js'
import DataCollection from  '../potassium/DataCollection.js'

import {apiBaseURL} from './Constants.js'

let codeCookieName = 'socialGraffitiCode'

/*
User is used for both authentication and identity
Fields:
	uuid
	idCode: a unique string used to link devices to this account
*/
let User = class extends DataModel {

	// Attempt to create a new account using this email address
	joinService(emailAddress){
		return new Promise((resolve, reject) => {
			var headers = new Headers()
			headers.set('Content-Type', 'application/json')
			this.fetch({
				method: 'POST',
				headers: headers,
				body: JSON.stringify({
					email: emailAddress
				})
			}).then((...params) => {
				setCodeCookie(this.get('code'))
				resolve(this)
				this.trigger(User.AUTHENTICATION_CHANGE, this, true)
			}).catch((...params) => {
				reject(...params)
			})
		})
	}

	// Test whether the User.code is known and authorized
	authenticateCode(code){
		return new Promise((resolve, reject) => {
			var headers = new Headers()
			headers.set('Content-Type', 'application/json')
			this.fetch(
				{
					method: 'POST',
					headers: headers,
					body: JSON.stringify({
						code: code
					})
				},
				apiBaseURL + 'user/code'
			).then((...params) => {
				setCodeCookie(this.get('code'))
				resolve(this)
				this.trigger(User.AUTHENTICATION_CHANGE, this, true)
			}).catch((...params) => {
				reject(...params)
			})
		})
	}

	deauthenticate(){
		removeCodeCookie()
		this.reset()
		this.trigger(User.AUTHENTICATION_CHANGE, this, false)
	}

	// Returns a global shared User, creating it if necessary
	static getSharedUser(){
		if(typeof User._sharedUser === 'undefined'){
			User._sharedUser = new User()
		}
		return User._sharedUser
	}

	get authed(){
		return getCodeCookie() !== null
	}

	get code(){ return getCodeCookie() }

	get url(){
		if(this.isNew || this.get('uuid') === null) return apiBaseURL + 'user/'
		return apiBaseURL + 'user/' + this.get('uuid')
	}
}
User.AUTHENTICATION_CHANGE = 'user-authentication-change'

let Users = class extends DataCollection {
	constructor(data=[], options={}){
		super(data, Object.assign({ dataObject: User }, options))
	}
	get url(){ return apiBaseURL + 'user/'}
}

export {User, Users}

// Returns the ID cookie or null if no such cookie exists
function getCodeCookie(){ return getCookie(codeCookieName) }

function setCodeCookie(code){
	document.cookie = codeCookieName + '=' + encodeURIComponent(code) + '; expires=Fri, 01 Jan 2100 00:00:00 GMT'
}

function removeCodeCookie(){
	document.cookie = codeCookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

function getCookie(name){
    if (document.cookie && document.cookie != '') {
        let cookies = document.cookie.split(';')
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim()
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                return decodeURIComponent(cookie.substring(name.length + 1))
            }
        }
    }
    return null
}
