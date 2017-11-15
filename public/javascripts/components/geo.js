
function getCoordinates(){
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(position => {
			resolve(position.coords)
		}, err => {
			reject(err)
		}, {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		})
	})
}

export {getCoordinates}