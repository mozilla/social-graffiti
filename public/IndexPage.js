import el from './javascripts/potassium/El.js'
import obj from './javascripts/potassium/Obj.js'
import Page from './javascripts/potassium/Page.js'
import Engine from './javascripts/potassium/Engine.js'
import Component from './javascripts/potassium/Component.js'
import DataObject from './javascripts/potassium/DataObject.js'
import CollectionComponent from './javascripts/potassium/CollectionComponent.js'

import LoginComponent from './javascripts/components/LoginComponent.js'
import SplashComponent from './javascripts/components/SplashComponent.js'
import AccountComponent from './javascripts/components/AccountComponent.js'
import MainNavComponent from './javascripts/components/MainNavComponent.js'
import SavePaintingComponent from './javascripts/components/SavePaintingComponent.js'

import {User} from './javascripts/models/User.js'

let IndexPage = class extends Page {
	constructor(){
		super()
		this.el.addClass('index-page')
		this._user = User.getSharedUser()

		// Set up the navbar at the top during flat and overlay and the main nav in the controlGroup when scenic
		this.mainNavComponent = new MainNavComponent(this._user)
		this.el.appendChild(this.mainNavComponent.el)

		// Create one row with a single center column
		this.row = el.div({
			class: 'row top-row' // the flat-only class is a handy way to only show elements when in flat mode 
		}).appendTo(this.el)
		this.centerCol = el.div(
			{ class: 'col-12' }
		).appendTo(this.row)

		this.loginComponent = new LoginComponent(this._user)
		this.centerCol.appendChild(this.loginComponent.el)

		this.accountComponent = new AccountComponent(this._user)
		this.centerCol.appendChild(this.accountComponent.el)

		this.savePaintingComponent = new SavePaintingComponent()
		this.centerCol.appendChild(this.savePaintingComponent.el)

		this.splashComponent = new SplashComponent(this._user)
		this.centerCol.appendChild(this.splashComponent.el)

		// Set up our URL router to handle view switching
		this._router.addRoute(/^$/, 'splash')
		this._router.addRoute(/^login$/, 'login')
		this._router.addRoute(/^account$/, 'account')
		this._router.addRoute(/^save-painting$/, 'save-painting')
		this._router.addListener(this._handleRoutes.bind(this))
		this._router.start()
	}
	_handleRoutes(eventName, path, ...params){
		switch(eventName){
			case 'login':
				if(this._user.authed){
					document.location.href = '#account'
					return
				}
				this._showLogin(...params)
				break
			case 'account':
				if(this._user.authed === false){
					document.location.href = '#login'
					return
				}
				this._showAccount(...params)
				break
			case 'save-painting':
				if(this._user.authed === false){
					document.location.href = '#login'
					return
				}
				this._showSavePainting(...params)
				break
			case 'splash':
			default:
				this._showSplash(...params)
		}
	}
	_showLogin(){
		this.loginComponent.el.style.display = ''
		this.accountComponent.el.style.display = 'none'
		this.savePaintingComponent.el.style.display = 'none'
		this.splashComponent.el.style.display = 'none'
	}
	_showAccount(){
		this.loginComponent.el.style.display = 'none'
		this.accountComponent.el.style.display = ''
		this.savePaintingComponent.el.style.display = 'none'
		this.splashComponent.el.style.display = 'none'
	}
	_showSavePainting(){
		this.loginComponent.el.style.display = 'none'
		this.accountComponent.el.style.display = 'none'
		this.savePaintingComponent.el.style.display = ''
		this.splashComponent.el.style.display = 'none'
	}
	_showSplash(){
		this.loginComponent.el.style.display = 'none'
		this.accountComponent.el.style.display = 'none'
		this.savePaintingComponent.el.style.display = 'none'
		this.splashComponent.el.style.display = ''
	}
}

export default IndexPage

window.IndexPage = IndexPage
