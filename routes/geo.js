"use strict";

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

module.exports = { offsetLatLonByMeters, parseLocationParameters }

