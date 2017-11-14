import el from '../potassium/El.js'
import Component from '../potassium/Component.js'

/*
LoginComponent renders the form for a user to authenticate, either by joining with a new email or linking their account ID with a device
*/
export default class LoginComponent extends Component {
	constructor(dataObject=null, options={}){
		super(dataObject, options)
		this.el.addClass('login-component')

		this.joinForm = el.form(
			{ class: 'join-form form-group' },
			el.h2('Enter your email address to join')
		).appendTo(this.el)
		this.emailInput = el.input({
			type: 'email',
			name: 'email',
			placeholder: 'email'
		}).appendTo(this.joinForm)
		this.joinError = el.div({ class: 'error' }).appendTo(this.joinForm)
		this.joinButton = el.button({ type: 'submit' }, 'JOIN').appendTo(this.joinForm)
		this.listenTo('click', this.joinButton, this._handleJoinClick)

		this.linkForm = el.form(
			{ class: 'link-form form-group' },
			el.h2('Already joined on another device?'),
			el.p('To link this device, enter the ID from the account page on the other device.')
		).appendTo(this.el)
		this.code = el.input({
			type: 'text',
			name: 'code',
			placeholder: 'account ID'
		}).appendTo(this.linkForm)
		this.linkError = el.div({ class: 'error' }).appendTo(this.linkForm)
		this.linkButton = el.button({ type: 'submit' }, 'LINK').appendTo(this.linkForm)
		this.listenTo('click', this.linkButton, this._handleLinkClick)
	}
	_handleJoinClick(ev){
		ev.preventDefault()
		let emailValue = this.emailInput.value
		if(emailValue === null || emailValue.trim().length === 0) return
		if(emailValue.indexOf('@') === -1 || emailValue.indexOf('@') === emailValue.length - 1) return
		this.emailInput.value = ''
		this.dataObject.joinService(emailValue).then(() => {
			console.log('joined')
			this.joinError.innerHTML = ''
			this.linkError.innerHTML = ''
			document.location.href = '#'
		}).catch(err => {
			this.joinError.innerHTML = 'Couldn\'t join with that address: ' + emailValue
			this.linkError.innerHTML = ''
			console.error('Could not join', err)
		})
		return false
	}
	_handleLinkClick(ev){
		ev.preventDefault()
		let code = this.code.value
		if(code === null || code.trim().length === 0) return
		this.code.innerHTML = ''
		this.dataObject.authenticateCode(code).then(() => {
			console.log('linked')
			this.joinError.innerHTML = ''
			this.linkError.innerHTML = ''
			document.location.href = '#'
		}).catch(err => {
			this.joinError.innerHTML = ''
			this.linkError.innerHTML = 'Couldn\'t link with that code: ' + code
			console.error('Could not link', err)
		})
		return false
	}
}
