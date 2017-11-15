import DataModel from  '../potassium/DataModel.js'
import DataCollection from  '../potassium/DataCollection.js'

import {apiBaseURL} from './Constants.js'

/*
Content represents a set of ContentAssets that could hold assets for a glTF model, an a-painter blob, or a simple text file. If the Content is returned as part of a list of Content for an Anchor, it also includes a relative pose matrix named `transform` which is taken from the associated AnchoredContent record.
Fields:
    uuid
    name (''): string
    owner: User uuid
    transform: column major 4x4 affine transform matrix (taken from AnchoredContent)
*/
let Content = class extends DataModel {
	get url(){
		if(this.isNew || this.get('uuid') === null) return apiBaseURL + 'user/'
		return apiBaseURL + 'content/' + this.get('uuid')
	}
}
let Contents = class extends DataCollection {
	constructor(data=[], options={}){
		super(data, Object.assign({ dataObject: Content }, options))
		this._locationFilter = null
	}
	addLocationFilter(latitude, longitude, radius){
		this._locationFilter = {
			latitude: latitude,
			longitude: longitude,
			radius: radius
		}
	}
	removeLocationFilter(){
		this._locationFilter = null
	}
	get url(){
		let result = apiBaseURL + 'content/'
		if(this._locationFilter !== null){
			result += `?latitude=${this._locationFilter.latitude}&longitude=${this._locationFilter.longitude}&radius=${this._locationFilter.radius}`
		}
		return result
	}
}

export {Content, Contents}
