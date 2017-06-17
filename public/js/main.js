
var map;
var geocoder;
var activeThreats =[];

var placeSearch, autocomplete;

function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementsByClassName('autocomplete')[0]),
            {types: ['geocode']});
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
          });
        }
}

function locationSuccess(position) {
  var current = {lat: position.coords.latitude, lng: position.coords.longitude};
  map.setCenter(current);
  map.setOptions({zoom: 15})

  var marker = new google.maps.Marker({
    position: current,
    map: map,
    icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
  });
}

function locationError() {
  console.log("Could Not Find Current Location");
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 1.290270, lng: 103.851959}
  });
  navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
  // Initialise geocoding API
   geocoder = new google.maps.Geocoder();

}

function createNewEvent(lat, lng) {
  var newEvent = {
    name: $('#description').val(),
    address: $('#address').val(),
    lat: lat,
    lng: lng,
    Category: $('#categories').val(),
    dangerLevel: $('#dangerLevel').val()
  }

  var contentString = '<div class="iw-description">Threat:'+ newEvent.name +'</div><div class="iw-address">Location: '+ newEvent.address +'</div><div class="iw-category">Category: '+ newEvent.Category +'</div><div class="iw-dangerLevel">Threat Level: '+ newEvent.dangerLevel +'</div>'

  var threatMarker = {
    marker: new google.maps.Marker({
      map: map,
      position: {lat: newEvent.lat, lng: newEvent.lng},
    }),
    iw: new google.maps.InfoWindow({
      content: contentString
    })
  }

  // add listener to this threat's marker
  threatMarker.marker.addListener('click', function() {
      threatMarker.iw.open(map, threatMarker.marker);
    });

  activeThreats.push(threatMarker);



  socket.emit('newEvent', newEvent);
}

function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  var shame;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      map.setCenter(results[0].geometry.location);

      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });

      createNewEvent(results[0].geometry.location.lat(), results[0].geometry.location.lng());
    }

    else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });

}


$(document).ready(function() {

  initMap();
  initAutocomplete();
  socket = io.connect('//localhost:3000/', {secure: true, transports: ['websocket']});

  // var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
  // var mapOptions = {
  //   zoom: 4,
  //   center: myLatlng
  // }

  // Populate map with existing events
  socket.on('getExistingEvents', function(data) {

    // indexing into each threat
    var tempArray = [];
    data.forEach((threat, index) => {
      console.log(threat.dangerLevel);

      var contentString = '<div class="iw-description">Threat: '+ threat.name +'</div><div class="iw-address">Location: '+ threat.address +'</div><div class="iw-category">Category: '+ threat.Category +'</div><div class="iw-dangerLevel">Threat Level: '+ threat.dangerLevel +'</div>'

      var threatMarker = {
        id: threat.id,
        marker: new google.maps.Marker({
          map: map,
          position: {lat: threat.lat, lng: threat.lng},
        }),
        iw: new google.maps.InfoWindow({
          content: contentString
        })
      }

      // add listener to this threat's marker
      threatMarker.marker.addListener('click', function() {
          threatMarker.iw.open(map, threatMarker.marker);
        });

      tempArray.push(threatMarker);
    })
    activeThreats = tempArray;
    console.log(activeThreats);
  })

  document.getElementById('submit').addEventListener('click', function(e) {
    e.preventDefault();

    geocodeAddress(geocoder, map);

    console.log("geocoding works");
    // $('#description').val(''),
    // address: $('#address').val(''),
    // Category: $('#categories').val(''),
    // dangerLevel: $('#dangerLevel').val(),
    //additional CRUD stuff
  });

    // marker.setMap(map);

    // var message = $('#chat input').val();
    // socket.emit('newMessage', message);
    // $('#chat input').val('');


});
