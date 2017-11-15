const express = require('express');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const {db} = require('../db/sequelize');
const {offsetLatLonByMeters, parseLocationParameters} = require('./geo');

const router = express.Router();

const listLimit = 200

/* Get a list of nearby Anchors */
router.get('/', (request, response, next) => {
  const locationParams = parseLocationParameters(request.query)
  if(locationParams){
    var query = findContentsByLocation(locationParams.latitude, locationParams.longitude, locationParams.radius)
  } else {
    var query = db.Anchor.findAll({ limit: listLimit })
  }
  query.then(data => {
    response.status(200).json(data)
  }).catch(err => {
    console.log('err', err)
    res.status(500).send({
      error: err
    });
    return
  })
});

module.exports = router;

function findContentsByLocation(latitude, longitude, radius, response){
  return new Promise((resolve, reject) => {
    findAnchorsByLocation(latitude, longitude, radius, response).then(anchors => {
      let preppedIds = '(' + anchors.map(anchor => { return `'${anchor.uuid}'` }).join(',') + ')'
      db.sequelize.query(
        `SELECT content.* FROM contents as content, anchoredContents as anchoredContent 
            where (content.uuid = anchoredContent.contentUuid 
            AND anchoredContent.anchorUuid in ${preppedIds}) LIMIT 200
          `, { model: db.Content }).then(contents => {resolve(contents) }).catch(err => { reject(err) })
    }).catch(err => {
      reject(err)
    })
  })
}

/*
For simplicity, search within a square of side 2*radius around the lat/lon.
*/
function findAnchorsByLocation(latitude, longitude, radius, response){
  const northWestCorner = offsetLatLonByMeters(latitude, longitude, -radius, -radius)
  const southEastCorner = offsetLatLonByMeters(latitude, longitude, radius, radius)
  let sortedLatitude = [northWestCorner.latitude, southEastCorner.latitude]
  sortedLatitude.sort(function(a,b){return a - b})
  let sortedLongitude = [northWestCorner.longitude, southEastCorner.longitude]
  sortedLongitude.sort(function(a,b){return a - b})
  return db.Anchor.findAll({
    limit: listLimit,
    where: {
      [Op.and]: [
        { 
          latitude: {
            [Op.between]: sortedLatitude
          } 
        },
        {
          longitude: {
            [Op.between]: sortedLongitude
          } 
        }
      ]
    }    
  })
}

