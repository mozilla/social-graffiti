const express = require('express');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const {db} = require('../db/sequelize');
const {offsetLatLonByMeters, parseLocationParameters} = require('./geo');
const {getUserFromRequest} = require('./auth.js');

const router = express.Router();

const anchorListLimit = 200

/* Get a list of nearby Anchors */
router.get('/', (request, response, next) => {
  const locationParams = parseLocationParameters(request.query)
  if(locationParams){
    var anchorQuery = findAnchorsByLocation(locationParams.latitude, locationParams.longitude, locationParams.radius)
  } else {
    var anchorQuery = db.Anchor.findAll({ limit: anchorListLimit })
  }
  anchorQuery.then(data => {
    response.status(200).json(data)
  }).catch(err => {
    console.log('err', err)
    response.status(500).send({
      error: err
    });
    return
  })
});

router.post('/', (request, response, next) => {
  let expectedFields = ['url', 'latitude', 'longitude', 'altitude', 'positionAccuracy', 'altitudeAccuracy']
  for(let field of expectedFields){
    if(typeof request.body[field] === 'undefined' || request.body[field] === ''){
      console.error('Bad anchor post, expected', field, 'in', request.body)
      response.status(400)
      return
    }
  }
  getUserFromRequest(request).then(user => {
    if(user === null){
      console.error('No user found for that request', request.cookies)
      response.status(403)
      return
    }
    const anchor = db.Anchor.build({
      ownerUuid: user.uuid,
      url: request.body.url,
      latitude: request.body.latitude,
      longitude: request.body.longitude,
      altitude: request.body.altitude,
      positionAccuracy: request.body.positionAccuracy,
      altitudeAccuracy: request.body.altitudeAccuracy,
      orientation: request.body.orientation || [0, 0, 0, 1]
    })
    anchor.save().then(anc => {
      // If the data is included, also create a Content and AnchoredContent
      if(request.body.url && request.body.name){
        const content = db.Content.build({
          name: request.body.name,
          url: request.body.url,
          ownerUuid: user.uuid
        })
        content.save().then(cont => {
          const anchoredContent = db.AnchoredContent.build({
            contentUuid: cont.uuid,
            anchorUuid: anc.uuid,
            transform: [0,0,0,1]
          })
          anchoredContent.save().then(ac => {
            response.status(200).json(anc)
          }).catch(err => {
            console.error('Error saving anchored content', err)
            response.status(500)
          })
        }).catch(err => {
          console.error('Error saving content', err)
          response.status(500)
        })
      } else {
        response.status(200).json(anc)
      }
    }).catch(err => {
      console.error('Error saving anchor', request.body)
      response.status(500)
    })
  })
});

module.exports = router;

/*
For simplicity, find anchors within a square of side 2*radius around the lat/lon.
*/
function findAnchorsByLocation(latitude, longitude, radius){
  const northWestCorner = offsetLatLonByMeters(latitude, longitude, -radius, -radius)
  const southEastCorner = offsetLatLonByMeters(latitude, longitude, radius, radius)
  let sortedLatitude = [northWestCorner.latitude, southEastCorner.latitude]
  sortedLatitude.sort(function(a,b){return a - b})
  let sortedLongitude = [northWestCorner.longitude, southEastCorner.longitude]
  sortedLongitude.sort(function(a,b){return a - b})
  return db.Anchor.findAll({
    limit: anchorListLimit,
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

