ToDoList by [@GianpieroBozza](http://twitter.com/GianpieroBozza)
========

In this repository you'll find a simple [Sencha Touch 2](http://www.sencha.com/products/touch) 
application called ToDoList, the name is self-explanatory, that helps you keeping track of your daily tasks.
It's my first app using this framework so it's something like an exercise aimed to learn using it and..
on the backend side I also wanted to learn something new, so I'm using [node.js](http://nodejs.org/) 
to realize a RESTful web service that connects the application to the 
[MongoDB](http://www.mongodb.org/) database where documents and users lives.
It don't pretend this to be the top of the class for this kind of application, but if you like it and want to 
contribute / start a project from this repo I'll be happy to keep in touch.
Another mention goes to the development server: I'm using a [Raspberry PI Model B](http://www.raspberrypi.org/) 
running [Raspbian "Wheezy"](http://www.raspbian.org/).

### A summary of the technologies used:
 * [Sencha Touch 2.1.1](http://www.sencha.com/products/touch)
 * [node.js 0.8.21](http://nodejs.org/) ARM-PI release (waiting for the new compiled version)
  * [express.js](http://expressjs.com/) a web application framework for node.js
  * [mongoose.js](http://mongoosejs.com/) an elegant mongodb object modeling for node.js
 * [MongoDB v2.1.1](http://www.mongodb.org/) ARM release (waiting to have the guts to compile the new version)
 * [RESTful](http://en.wikipedia.org/wiki/Representational_state_transfer) web server implementation

### Quick roadmap:
 * Complete User Model (change details, update password with confirmation, etc)
 * App settings screen
 * App how-to-use screen
 * Re-factor server.js into multiple and human readable files
 * Register new user and better login session managment.
 * "Maybe" Facebook, Twetter, Google login
 * Update development environment (aka the Raspberry PI):
  * node.js 0.10.*
  * MongoDB 2.4.* 
 * Encrypt database for security and privacy of the user
 * Set up production branch
 * Deploy on [Nodejitsu](https://www.nodejitsu.com/) / [Heroku](http://www.heroku.com/)

