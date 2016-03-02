const MAPBOX_TOKEN = "pk.eyJ1IjoibWFnZXIiLCJhIjoiY2lobWxvZXRpMG90ZXY1a2x4eG4wNGs1NyJ9.vEVHfV_K15rnm4_niRNHYw";
L.mapbox.accessToken = MAPBOX_TOKEN;

// Make the map object
var map;
map = L.mapbox.map("map", "mapbox.light")
  .setView([37.75, -122.4], 12)
  .addControl(
    L.mapbox.geocoderControl('mapbox.places')
    .on('select', function(e) {
      coords = e.feature.geometry.coordinates;
      var marker = L.marker([coords[1], coords[0]], {
        icon: L.mapbox.marker.icon({
          'marker-size': 'large',
          'marker-symbol': 'heart',
          'marker-color': '#C2C7CA'
        })
      });
      marker.addTo(map);
    })
  );

// Grab the list on the side and create a new layer on the map
var listings = document.getElementById('listings');

var featureLayer = L.mapbox.featureLayer()
  .loadURL('/zones')
  .on('ready', function(e){
    this.setStyle({
      color: '#0077AE',
      weight: 3,
      fillColor: '#4C9FC6'
    });
  })
  .addTo(map)
  .on('dblclick', function(e) {
    map.setView(e.latlng, map.getZoom() + 1);
  });

function setActive(el) {
  var siblings = listings.getElementsByTagName('li');
  for (var i = 0; i < siblings.length; i++) {
    siblings[i].className = siblings[i].className
    .replace(/active/, '').replace(/\s\s*$/, '');
  }

    el.className += ' active';
}

function getZones(data) {
  var zone_name = data.properties.zone_name;
  var map_center = data.features[1].geometry.coordinates.reverse();
  var zoom_level = 11

  // Create some HTML from the GeoJSON
  var listing = listings.appendChild(document.createElement('li'));
  var link = listing.appendChild(document.createElement('a'));
  link.href = '#';
  link.className = 'title';
  link.innerHTML = zone_name;
  listing.className = 'list-group-item';

  link.onclick = function() {
    setActive(listing);
    map.setView(map_center, zoom_level);
    return false;
  };
}

$.getJSON('/zones', function(data) {
  for (i=0;i<data.length;i++) {
    getZones(data[i]);
  }
});


/* Zip code Search */

$('#zip_search').submit(function(e) {
  e.preventDefault();
  var result = $('#zip_input').val();
  get_zip(result);
  center_map(result);
});

function get_zip(q){
  var featureLayer = L.mapbox.featureLayer()
    .loadURL('/zips?zip=' + q)
    .on('ready', function(e){
      this.setStyle({
        color: '#E6E8E9',
        weight: 2,
        fillColor: '#7B858B'
      });
    })
    .addTo(map);
}

function center_map(q) {
    var base_url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    var end_url = '.json?access_token=';
    var request_url = `${base_url}${q}${end_url}${MAPBOX_TOKEN}`;
    var resp = $.getJSON(request_url, function(e) {
      var lon = e.features[0].center[0];
      var lat = e.features[0].center[1];
      var center = [lat, lon];
      map.setView(center, 12);
    });

}
