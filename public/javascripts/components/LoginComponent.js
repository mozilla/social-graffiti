import el from '../potassium/El.js'
import Component from '../potassium/Component.js'

/*
LoginComponent renders the form for a user to authenticate
*/
export default class LoginComponent extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.el.appendChild(el.div('login'))
	}
}
