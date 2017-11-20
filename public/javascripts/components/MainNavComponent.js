import el from '../potassium/El.js'
import obj from '../potassium/Obj.js'
import Component from '../potassium/Component.js'

import {User} from '../models/User.js'

/*
MainNavComponent renders the main navigation links.
	dataObject: a User instance, probably from User.getSharedUser()
*/
export default class MainNavComponent extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.el.addClass('main-nav-component')
		this.navEl = el.nav().appendTo(this.el)
		this.siteNameEl = el.a(
			{ href: '/#' },
			el.h1('Social graffiti')
		).appendTo(this.navEl)

		this.rightLinks = el.ul(
			{ class: 'right-links'},
		).appendTo(this.navEl)

		if(this.dataObject.authed){
			this._showAuthed()
		} else {
			this._showUnauthed()
		}
		this.dataObject.addListener(this._handleAuthenticationChange.bind(this), User.AUTHENTICATION_CHANGE)
	}
	_showAuthed(){
		this.rightLinks.innerHTML = ''
		this.addRightLink('/#account', 'account', 'nav-account')
	}
	_showUnauthed(){
		this.rightLinks.innerHTML = ''
		this.addRightLink('#login', 'login', 'nav-login')
	}
	_handleAuthenticationChange(eventName, user, authenticated){
		if(authenticated){
			this._showAuthed()
		} else {
			this._showUnauthed()
		}
	}
	addRightLink(href, anchorText, className) {
		this.rightLinks.append(el.li(el.a({ 'href': href, 'class': className }, anchorText )))
	}
}
