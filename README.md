# Social graffiti prototype server

This repo contains an Express HTTPD that implements the bare bones API to host the social graffiti demo using WebXR.

While it may, at first glace, appear to be a production-ready anchor name service or a 3D content service, it is neither.

*This is a prototype built quickly for a single demo.*

## Running

	cd social-graffiti
	npm install
	npm run-script build // Creates public/site.js for browsers that don't support ES6 modules
	DEBUG=social-graffiti:* npm start

