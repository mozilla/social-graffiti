import DataModel from  '../potassium/DataModel.js'
import DataCollection from  '../potassium/DataCollection.js'

import {apiBaseURL} from './Constants.js'

/*
AnchoredContent links Content to an Anchor
Fields:
    uuid
    content: Content uuid
    anchor: Anchor uuid
    transform: a column first affine transform matrix
*/
let AnchoredContent = class extends DataModel {
	get url(){
		if(this.isNew || this.get('uuid') === null) return apiBaseURL + 'user/'
		return apiBaseURL + 'anchored-content/' + this.get('uuid')
	}
}
let AnchoredContents = class extends DataCollection {
	constructor(data=[], options={}){
		super(data, Object.assign({ dataObject: AnchorContent }, options))
	}
	get url(){ return apiBaseURL + 'anchored-content/'}
}

export {AnchorContent, AnchorContents}
