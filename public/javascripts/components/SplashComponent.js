import el from '../potassium/El.js'
import Component from '../potassium/Component.js'

/*
SplashComponent renders the initial page with the list of nearby paintings
*/
export default class SplashComponent extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.el.addClass('splash-component')
		this.el.appendChild(el.div('splash'))
	}
}
