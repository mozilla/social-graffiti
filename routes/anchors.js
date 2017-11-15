const express = require('express');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const {db} = require('../db/sequelize');

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
    res.status(500).send({
      error: err
    });
    return
  })
});

module.exports = router;

/*
For simplicity, find anchors within a square of side 2*radius around the lat/lon.
*/
function findAnchorsByLocation(latitude, longitude, radius, response){
  const northWestCorner = offsetLatLonByMeters(latitude, longitude, -radius, -radius)
  const southEastCorner = offsetLatLonByMeters(latitude, longitude, radius, radius)
  let sortedLatitude = [northWestCorner.latitude, southEastCorner.latitude]
  sortedLatitude.sort()
  let sortedLongitude = [northWestCorner.longitude, southEastCorner.longitude]
  sortedLongitude.sort()
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

/*
Returns { latitude, longitude } offset from passed in lat/lon by their respective meters.
Assumes that 111,111 meters (111.111 km) in the y direction is 1 degree (of latitude)
and that 111,111 * cos(latitude) meters in the x direction is 1 degree (of longitude).
Note: This will not work near the poles.
From: https://gis.stackexchange.com/questions/2951/algorithm-for-offsetting-a-latitude-longitude-by-some-amount-of-meters
*/
function offsetLatLonByMeters(latitude, longitude, metersLatitude, metersLongitude){
  return {
    latitude: latitude + (metersLatitude / 111111),
    longitude: longitude + (metersLongitude / (111111 * Math.cos(latitude)))
  }
}

/*
Pull out the latitude, longitude, and radius query parameters.
*/
function parseLocationParameters(query){
  const latStr = query.latitude
  const lonStr = query.longitude
  const radiusStr = query.radius || '100' // meters
  if(!latStr || !lonStr) return null
  const lat = parseFloat(latStr)
  const lon = parseFloat(lonStr)
  const radius = parseFloat(radiusStr) || 100
  return {
    latitude: lat,
    longitude: lon,
    radius: radius
  }
}