import DataModel from  '../potassium/DataModel.js'
import DataCollection from  '../potassium/DataCollection.js'

import {apiBaseURL} from './Constants.js'

/*
Anchor represents a specific location.
Fields:
    uuid
    point: (latitude, longitude)
    elevation: float
    orientation: (x, y, z, w)
*/
let Anchor = class extends DataModel {
	get url(){
		if(this.isNew || this.get('uuid') === null) return apiBaseURL + 'user/'
		return apiBaseURL + 'anchor/' + this.get('uuid')
	}
}
let Anchors = class extends DataCollection {
	constructor(data=[], options={}){
		super(data, Object.assign({ dataObject: Anchor }, options))
	}
	get url(){ return apiBaseURL + 'anchor/'}
}

export {Anchor, Anchors}
