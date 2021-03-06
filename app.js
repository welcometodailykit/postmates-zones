const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const request = require('request');
const turf = require('turf');
const NodeGeocoder = require('node-geocoder');
const zones = require('./zones.json');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json({
    type: '*/*'
}));

const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GOOGLE_API_KEY || '',
  formatter: null
};

const geocoder = NodeGeocoder(options);

app.post('/addresses', function(req, res) {
  const mode = req.body.mode;
  const addresses = req.body.data;
  const MODES = {
      ADDRESSES: 'addresses',
      COORDINATES: 'coordinates'
  };
  if (mode === MODES.ADDRESSES) {
      const addressesInZone = addresses.map((address) => {
         const formattedAddress = address.replace(/\s+/g, ' ');
         return isAddressInZone(formattedAddress);
      });

      Promise.all(addressesInZone).then((results) => res.json(results));
  } else if (mode === MODES.COORDINATES) {
      const coordinatesInZone = addresses.map((coord) => isCoordinateInZone(coord));

      Promise.all(coordinatesInZone).then((results) => res.json(results));
  } else {
      return res.json({
          'message': 'Incorrect mode'
      });
  }
});

app.use((req, res, next) => {
    if ('/robots.txt' == req.url) {
        res.type('text/plain')
        res.send("User-agent: *\nDisallow: /");
    } else {
        next();
    }
})

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/bulk', function (req, res) {
  res.render('bulk');
});

app.get('/zones', function(req, res) {
  const options = {}
  options.url = 'https://api.postmates.com/v1/delivery_zones';
  options.headers = {
    Authorization: process.env.POSTMATES_AUTH
  }

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      res.json(info);
    }
  }
  request(options, callback);
});

app.get('/zips', function(req, res) {
  const base_url = 'https://vanitysoft-boundaries-io-v1.p.mashape.com/reaperfire/rest/v1/public/boundary';
  const query_params = '?includepostal=true&limit=1&zipcode=';
  const zip = req.query.zip;

  const options = {}
  options.url = `${base_url}${query_params}${zip}`;
  options.headers = {
    'X-Mashape-Key': process.env.MASHAPE_KEY
  }

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      const info = JSON.parse(body);
      console.log(`Successful response: ${JSON.stringify(info)}`);
      res.json(info);
    }
  }
  request(options, callback);
});

function getZonePolygons(zones) {
    return zones.map((zone) => {
        return {
            coords: turf.polygon(zone.features[0].geometry.coordinates[0]),
            zone: zone.properties.zone_name
        };
    });
}

function isAddressInZone(address) {
    const polygons = getZonePolygons(zones);

    return new Promise((resolve, _reject) => {
        return geocoder.geocode(address, (err, result) => {
            let pointInPolygon = false;
            if (result && result.length) {
                const point = turf.point(
                    [result[0]['longitude'], result[0]['latitude']]
                );

                pointInPolygon = polygons.some((polygon) =>
                    turf.inside(point, polygon));
            }
            resolve(pointInPolygon);
        });
    });
}

function isCoordinateInZone(coords) {
    const polygons = getZonePolygons(zones);
    const [ lat, lng ] = coords.split(',');
    let zoneName;

    return new Promise((resolve, _reject) => {
        const point = turf.point([parseFloat(lng), parseFloat(lat)]);
        const pointInPolygon = polygons.some((polygon) => {
            return turf.inside(point, polygon['coords']);
        });

        if (pointInPolygon) {
            zoneName = polygons.find((polygon) => {
                return turf.inside(point, polygon['coords']);
            })['zone'];
        } else {
            zoneName = ''
        }

        resolve({
            pointInPolygon,
            zoneName
        });
    });
}

const server = app.listen(process.env.PORT || 3000, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
