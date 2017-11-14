import el from '../potassium/El.js'
import Component from '../potassium/Component.js'

import {User} from '../models/User.js'

/*
AccountComponent renders the information about a User
*/
export default class AccountComponent extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.el.addClass('account-component')

		this.headline = el.h2('Your account ID').appendTo(this.el)
		this.info = el.p(
			{ class: 'info' },
			'Save this code so that you can link additional devices.'
		).appendTo(this.el)

		this.accountCode = el.div(
			{ class: 'account-code' },
			this.dataObject.code || ''
		).appendTo(this.el)

		this.logoutButton = el.button({ type: 'button', class: 'logout-button' }, 'LOGOUT').appendTo(this.el)
		this.listenTo('click', this.logoutButton, this._handleLogoutClick)
		this.el.appendChild(el.p('Be sure to save your account ID!'))

		this.dataObject.addListener(() => {
			this.accountCode.innerHTML = this.dataObject.code || ''
		}, User.AUTHENTICATION_CHANGE)
	}
	_handleLogoutClick(ev){
		ev.preventDefault()
		User.getSharedUser().deauthenticate()
		document.location.href = '#login'
	}
}
