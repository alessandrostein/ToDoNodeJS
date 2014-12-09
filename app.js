
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var RouteController = require('./server/routecontroller');
var model = require('./server/models');
var User, Task;

app.use(bodyparser());
app.use(express.static(__dirname + '/public'));

var server = app.listen(3000, function() {
    console.log('Server is up and running! Port: ' +server.address().port);
    model.init(function(models) {
    	User = models.User;
    	Task = models.Task;
   		RouteController.init(server, app, createRoutes);
    });
});

function createRoutes(router) {
	router.createGETRoute('/users', User);
	router.createGETRoute('/user/:id', User);
	router.createGETRoute('/tasks', Task);
	router.createGETRoute('/task/:id', Task);

  router.createGETRoute('/index/:id', User);

	router.createPOSTRoute('/user', User);
  router.auth('/auth', User);
	router.createPOSTRoute('/task', Task);

	router.createPUTRoute('/user/:id', User);
	router.createPUTRoute('/task/:id', Task);

	router.createDELETERoute('/user/:id', User);
	router.createDELETERoute('/task/:id', Task);

	app.get('/', function(req, res) {
		res.redirect('/views/index.html');
	});

  app.get('/index', function(req, res) {
    debugger;
    res.redirect('/views/index.html');
  });

  app.get('/unauthorized', function(req, res) {
    res.redirect('/views/login.html');
  });

	app.get('/login', function(req, res) {
		res.redirect('/views/login.html');
	});
}
