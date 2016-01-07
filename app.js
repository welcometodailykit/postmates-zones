var express = require('express');
var app = express();

var request = require('request');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index');
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

var server = app.listen(process.env.PORT || 5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
