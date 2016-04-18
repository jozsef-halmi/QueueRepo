import express = require('express');
import routes = require('./routes/index');
import animals = require('./routes/animals');
import cities = require('./routes/cities');
import http = require('http');
import path = require('path');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:16639');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use('/images', express.static(__dirname + '/writable'));

app.use(app.router);





import stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);

// List animals
app.get('/api/animals', animals.listAnimals);

// List animals for user
app.param('userID', function (req, res, next, userID) {
    console.log('User ID: ' + userID);
    next();
});
app.get('/api/animals/:userID', animals.listAnimalsForUser);

app.get('/api/animal/:animalID', animals.getAnimal);

// List cities
app.get('/api/cities', cities.listCities);

// Add new animal
app.post('/api/addanimal', animals.addAnimal);

// Delete animal
app.post('/api/deleteanimal', animals.deleteAnimal);

// Delete animal
app.post('/api/editanimal', animals.updateAnimal);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
