'use strict';
const uuid = require('./uuid');
const {convertToArray, convertFromArray} = require('./data');

/*
Anchor represents a specific location.
Fields:
    uuid
    owner: foreign key to User
    latitude: float
    longitude: float
    altitude: float
    positionAccuracy: float
    altitudeAccuracy: float
    orientation: (x, y, z, w)
*/
module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Anchor', {
		uuid:  { type: DataTypes.STRING, primaryKey: true, defaultValue: uuid },
		latitude: { type: DataTypes.FLOAT },
		longitude: { type: DataTypes.FLOAT },
		altitude: { type: DataTypes.FLOAT },
		positionAccuracy: { type: DataTypes.FLOAT },
		altitudeAccuracy: { type: DataTypes.FLOAT },
		orientation: {
			type: DataTypes.STRING,
			get(){
				return convertFromString(this.getDataValue('orientation'))
			},
			set(val){
				this.setDataValue('orientation', convertFromArray(val))
			}
		}
	});
};
