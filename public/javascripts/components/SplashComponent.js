import el from '../potassium/El.js'
import Component from '../potassium/Component.js'

import {User} from '../../javascripts/models/User.js'

/*
SplashComponent renders the initial page with the list of nearby paintings
*/
export default class SplashComponent extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.el.addClass('splash-component')

		this.welcomeMessage = el.p(
			{ class: 'welcome-message' },
			'Create 3D paintings.',
			el.br(),
			'Save them to a location.',
			el.br(),
			'See other people’s sculptures.'
		).appendTo(this.el)

		this.paintButton = el.a({ class: 'paint-button button', href: '/paint/' }, 'PAINT').appendTo(this.el)

		this.nearbyTitle = el.h2('Nearby paintings').appendTo(this.el)
		this.nearbyPaintings = el.div('To be done...').appendTo(this.el)

		this._checkAuthed()
		this.dataObject.addListener(()=> {
			this._checkAuthed()
		}, User.AUTHENTICATION_CHANGE)
	}
	_checkAuthed(){
		if(this.dataObject.authed){
			this._showAuthed()
		} else {
			this._showUnauthed()
		}
	}
	_showAuthed(){
		this.welcomeMessage.style.display = 'none'
		this.paintButton.style.display = ''
	}
	_showUnauthed(){
		this.welcomeMessage.style.display = ''
		this.paintButton.style.display = 'none'
	}
}
