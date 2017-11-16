import el from '../potassium/El.js'
import Component from '../potassium/Component.js'

import {Anchor} from '../models/Anchor.js'

import {getCoordinates} from './geo.js'

/*
SavePaintingComponent renders the form for a user to name and save an a-painter painting
*/
export default class SavePaintingComponent extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.el.addClass('save-painting-component')
		this.title = el.h2({ class: 'title' }, 'Name and save your painting').appendTo(this.el)

		this.form = el.form({ class: 'form-group' }).appendTo(this.el)
		this.nameInput = el.input({ type: 'text', name: 'name', placeholder: 'Painting name' }).appendTo(this.form)
		this.buttonGroup = el.div({ class: 'buttons' }).appendTo(this.form)
		this.cancelButton = el.button({ type: 'button' }, 'CANCEL').appendTo(this.buttonGroup)
		this.listenTo('click', this.cancelButton, this._handleCancel)
		this.saveButton = el.button({ type: 'button', class: 'save-button' }, 'SAVE').appendTo(this.buttonGroup)

		this.spinner = el.div({ class: 'spinner' }, 'Working...').appendTo(this.el)
		this.spinner.style.display = 'none'

		this.listenTo('click', this.saveButton, this._handleSave)
		this.listenTo('submit', this.form, this._handleSave)
	}
	_toggleSpinner(show){
		if(show){
			this.spinner.style.display = ''
			this.saveButton.style.display = 'none'
		} else {
			this.spinner.style.display = 'none'
			this.saveButton.style.display = ''
		}
	}
	_handleSave(ev){
		ev.preventDefault()
		let contentURL = (new URL(document.location)).searchParams.get('url');
		if(!contentURL){
			console.error('No content URL!')
			return
		}
		let name = this.nameInput.value;
		if(name === null){
			console.error('No name')
			return
		}
		this._toggleSpinner(true)
		getCoordinates().then(coordinates => {
			let anchor = new Anchor({
				latitude: coordinates.latitude,
				longitude: coordinates.longitude,
				altitude: coordinates.altitude,
				positionAccuracy: coordinates.accuracy,
				altitudeAccuracy: coordinates.altitudeAccuracy,
				orientation: [0, 0, 0, 1],
				// Including these is a shortcut to auto-create a Content and AnchoredContent record
				url: contentURL,
				name: name,
			})
			anchor.save().then(() => {
				this._toggleSpinner(false)
				document.location = '/#'
				// TODO fetch the nearby paintings
			}).catch(err => {
				this._toggleSpinner(false)
				console.error('Error saving anchor', anchor, err)
			})
		}).catch(err => {
			this._toggleSpinner(false)
			console.error('Could not get coordinates', err)			
		})
		return false
	}
	_handleCancel(ev){
		ev.preventDefault()
		return false
	}
}
