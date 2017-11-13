import el from '../potassium/El.js'
import obj from '../potassium/Obj.js'
import Component from '../potassium/Component.js'

/*
MainNavComponent renders the main navigation links.
*/
export default class MainNavComponent extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.el.addClass('main-nav-component')
		this.navEl = el.nav().appendTo(this.el)
		this.siteNameEl = el.a(
			{ href: '#' },
			el.h1('Social graffiti')
		).appendTo(this.navEl)

		this.rightLinks = el.ul(
			{ class: 'right-links'},
		).appendTo(this.navEl)
		this.addRightLink('#login', 'login', 'nav-login')
	}
	addRightLink(href, anchorText, className) {
		this.rightLinks.append(el.li(el.a({ 'href': href, 'class': className }, anchorText )))
	}
}
