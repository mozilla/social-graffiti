'use strict';
const uuid = require('./uuid');

/*
Content represents a set of ContentAssets that could refer to assets for a glTF model, an a-painter blob, or a simple text file.
If the Content is returned as part of a list of Content for an Anchor, it also includes a relative pose matrix named `transform` which is taken from the associated AnchoredContent record.
Fields:
    uuid
    name (''): string
    owner: User uuid
    transform: column major 4x4 affine transform matrix (taken from AnchoredContent)
*/
module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Content', {
		uuid: { type: DataTypes.STRING, primaryKey: true, defaultValue: uuid },
		name: { type: DataTypes.STRING }
	});
};
