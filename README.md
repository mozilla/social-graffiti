# Social graffiti prototype server

This repo contains an Express HTTPD that implements the bare bones API to host the social graffiti demo using WebXR.

While it may, at first glace, appear to be a production-ready anchor name service or a 3D content service, it is neither.

*This is a prototype built quickly for a single demo.*


## Configuring a Glitch.com project

Create a new project, then open a terminal to that project and run:

	cd /app/
	rm -rf node_modules package.json public README.md server.js views
	git init .
	git remote add -t \* -f origin https://github.com/mozilla/social-graffiti.git
	git checkout master
	npm install
	npm run-script build


## Setting up on CentOS / Amazon Linux

	sudo yum install -y gcc-c++ make git
	curl --silent --location https://rpm.nodesource.com/setup_6.x | sudo bash -
	sudo yum install -y nodejs
	sudo npm install npm@latest -g
	sudo mkdir /www
	sudo chown ec2-user:ec2-user /www
	cd /www
	git clone https://github.com/mozilla/social-graffiti.git
	cd social-graffiti
	npm install
	npm run-script build

### Running

	cd /www/social-graffiti
	# export DEBUG=social-graffiti.*
	npm start
