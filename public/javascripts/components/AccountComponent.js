import el from '../potassium/El.js'
import Component from '../potassium/Component.js'

/*
AccountComponent renders the information about a User
*/
export default class AccountComponent extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.el.appendChild(el.div('account'))
	}
}
