var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var request = require('request');
var turf = require('turf');
var zones = require('./zones.json');


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json({
    type: '*/*'
}));

var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GOOGLE_API_KEY || '',
  formatter: null
};

var geocoder = NodeGeocoder(options);



app.post('/addresses', function(req, res) {
  var addresses = req.body.data;

  Promise.all(addresses.map((addy) => isAddressInZone(addy)))
    .then((results) => res.send(results));
});


app.get('/', function (req, res) {
  res.render('index');
});

app.get('/bulk', function (req, res) {
  res.render('bulk');
});

app.get('/bulk', function (req, res) {
  res.render('bulk');
});

app.get('/zones', function(req, res) {

  var options = {}
  options.url = 'https://api.postmates.com/v1/delivery_zones';
  options.headers = {
    Authorization: process.env.POSTMATES_AUTH
  }

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      res.send(info);
    }
  }
  request(options, callback);

});

app.get('/zips', function(req, res) {

  var base_url = 'https://vanitysoft-boundaries-io-v1.p.mashape.com/reaperfire/rest/v1/public/boundary';
  var query_params = '?includepostal=true&limit=1&zipcode=';
  var zip = req.query.zip;

  var options = {}
  options.url = `${base_url}${query_params}${zip}`;
  options.headers = {
    'X-Mashape-Key': process.env.MASHAPE_KEY
  }

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      res.send(info);
    }
  }
  request(options, callback);

});

function getZonePolygons(zones) {
    var zone_polygons = [];

    for (var i = 0; i < zones.length; i++) {
        var zone = turf.polygon(
            zones[i]['features'][0]['geometry']['coordinates'][0]
        );

        zone_polygons.push(zone);
    }

    return zone_polygons;
}

function isAddressInZone(address) {
    var polygons = getZonePolygons(zones);
    var pointInPolygon = false;

    return new Promise((resolve, _reject) => {
        return geocoder.geocode(address, function(err, result) {
            if (result.length) {
                var point = turf.point(
                    [result[0]['longitude'], result[0]['latitude']]
                );

                for (var i=0; i<polygons.length; i++) {
                    if (turf.inside(point, polygons[i])) {
                        pointInPolygon = true;
                    };
                }
            }
            resolve(pointInPolygon);
        });
    });
}

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
