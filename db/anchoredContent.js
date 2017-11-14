'use strict';
const uuid = require('./uuid');
const {convertToArray, convertFromArray} = require('./data');

/*
AnchorContent links Content to an Anchor
Fields:
    uuid
    content: Content uuid
    anchor: Anchor uuid
    transform: a 4x4 column first affine transform matrix
*/
module.exports = (sequelize, DataTypes) => {
	return sequelize.define('AnchoredContent', {
		uuid:  { type: DataTypes.STRING, primaryKey: true, defaultValue: uuid },
		transform: {
			type: DataTypes.STRING,
			get(){
				return convertFromString(this.getDataValue('transform'))
			},
			set(val){
				this.setDataValue('transform', convertFromArray(val))
			}
		}
	});
};
