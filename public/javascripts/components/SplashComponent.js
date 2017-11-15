import el from '../potassium/El.js'
import Component from '../potassium/Component.js'
import CollectionComponent from '../potassium/CollectionComponent.js'

import {User} from '../../javascripts/models/User.js'
import {Contents} from '../../javascripts/models/Content.js'

/*
SplashComponent renders the initial page with the list of nearby paintings
*/
export default class SplashComponent extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.el.addClass('splash-component')
		this._contents = new Contents()
		this._currentCoordinates = null

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
		this.nearbyPaintings = new CollectionComponent(this._contents, {
			itemComponent: NearbyPaintingItem
		})
		this.nearbyPaintings.el.addClass('nearby-paintings')
		this.el.appendChild(this.nearbyPaintings.el)

		this._checkAuthed()
		this.dataObject.addListener(()=> {
			this._checkAuthed()
		}, User.AUTHENTICATION_CHANGE)
		this._updateLocation()
	}
	_updateSearch(){
		if(this._currentCoordinates === null){
			this._contents.removeLocationFilter()
			this._contents.reset()
			return
		}
		this._contents.addLocationFilter(this._currentCoordinates.latitude, this._currentCoordinates.longitude, 100)
		this._contents.fetch()
	}
	_updateLocation(){
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(position => {
				this._currentCoordinates = position.coords
				this._updateSearch()
				resolve(position.coords)
			}, err => {
				this._currentCoordinates = null
				this._updateSearch()
				reject(err)
			}, {
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0
			})
		})
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

let NearbyPaintingItem = class extends Component {
	constructor(dataObject, options={}){
		super(dataObject, options)
		this.el.addClass('nearby-painting-item')
		this.editButton = el.a({ class: 'edit-button button', href: `/paint/?url=${encodeURIComponent(dataObject.get('url'))}` }, 'VIEW').appendTo(this.el)
		this.nameEl = el.h3({ class: 'name' }, dataObject.get('name')).appendTo(this.el)
		this.ownerEl = el.div({ class: 'owner' }, dataObject.get('ownerEmail').split('@')[0]).appendTo(this.el)
	}
}
