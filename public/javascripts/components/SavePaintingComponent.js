import el from '../potassium/El.js'
import Component from '../potassium/Component.js'

/*
SavePaintingComponent renders the form for a user to name and save an a-painter painting
*/
export default class SavePaintingComponent extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.el.appendChild(el.div('Save'))
	}
}
