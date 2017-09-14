var LocalWeather = {
    map: null,
    latlngbound: null,
    
    initializeMap: function(MapId) {
        LocalWeather.latlngbound = new google.maps.LatLngBounds();
        var latlng = new google.maps.LatLng(0,0);
        var mapOptions = {
            zoom: 8,
            center: latlng,
            //set map styling
            styles: [
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#d3d3d3"}]
            },
            {
                "featureType": "transit",
                "stylers": [{"color": "#808080"}, {"visibility": "off"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{"visibility": "on"},{"color": "#b3b3b3"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#ffffff"}]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [{"visibility": "on"},{"color": "#ffffff"},{"weight": 1.8}]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#d7d7d7"}]
            },
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [{"visibility": "on"},{"color": "#ebebeb"}]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [{"color": "#a7a7a7"}]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#ffffff"}]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#ffffff"}]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [{"visibility": "on"},{"color": "#efefef"}]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#696969"}]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{"visibility": "on"},{"color": "#737373"}]
            },
            {
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#d6d6d6"}]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
            },
            {},
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#dadada"}]
            }
            ]
            
        }
        //initialize default map layer
        LocalWeather.map = new google.maps.Map(document.getElementById(MapId), mapOptions);
        var geocoder = new google.maps.Geocoder();
        //set event listener for setting next requests for localization and temp
        document.getElementById('submit').addEventListener('click', function(){
            LocalWeather.geocodeAddress(geocoder, LocalWeather.map);
        });
    },
    setMarker: function() {
      //get your current location by your IP address - not that accurate, but still helpful to initialize map
        $.get('http://freegeoip.net/json/', function(data) {
            var latitude = data.latitude;
            var longitude = data.longitude;
            var latlng = new google.maps.LatLng(latitude, longitude);
            var marker = new google.maps.Marker({
                map: LocalWeather.map,
                draggable: false,
                position: latlng,
            });
            LocalWeather.placeIPMarker(marker, latlng);
        });
    },
    placeIPMarker: function(marker, latlng){
        marker.setPosition(latlng);
        LocalWeather.map.setCenter(latlng);
    },
    geocodeAddress: function(geocoder, resultsMap){
        var address = document.getElementById('address').value;
        geocoder.geocode({'address': address}, function(results, status){
            if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: resultsMap,
                    animation: google.maps.Animation.DROP,
                    position: results[0].geometry.location
                });
                //show temperatrure and icon for location
                getTemperature(address);
            } else {
                alert('Location not found, because: ' + status);
            }
        });
    },
    // getLocation: function(callback){
    //     $.get('https://freegeoip.net/json', function(response){
    //         //LocalWeather.getTemperature(response.city);
    //         callback.call(this, response.city);
    //     });
    // }

}

function getLocation(callback) {
  $.get('http://freegeoip.net/json/', function (response) {
      console.log(response);
      // $('.test3').html('<h2>Your location is: ' +  data.city + '.</h2>');  
      callback.call(this, response.city);
  });
} 


function getTemperature(location) {
  var city = location;
  var units = "";
  var temp = "";
  if (document.getElementById('fahr').checked) {
    units = 'imperial';
    temp = ' &degF'
  } else {
    units = 'metric';
    temp = ' &degC';
  }
$.get('http://api.openweathermap.org/data/2.5/weather?appid=24c0a72bfc696a4a9ab92c98af2daee1&q=' + city + '&units=' + units, function (data) {
        
        $('.test').html('<h4>Temperature in ' +  city + ' is ' + data.main.temp + temp + '</h4>'
        );
        var code = '';
        code = data.weather[0].id;
        console.log(code);
        $('.ico').html('<i class="wi '+ setWeatherIcon(code) +'"></i>');
            
    });

  

}

function setWeatherIcon(condid) {
  var icon = '';
      switch(condid) {
        case 200: icon = 'wi-owm-200';
        break;
        case 201: icon = 'wi-owm-201';
        break;
        case 202: icon = 'wi-owm-202';
        break;
        case 210: icon = 'wi-owm-210';
        break;
        case 211: icon = 'wi-owm-211';
        break;
        case 212: icon = 'wi-owm-212';
        break;
        case 221: icon = 'wi-owm-221';
        break;
        case 230: icon = 'wi-owm-230';
        break;
        case 231: icon = 'wi-owm-231';
        break;
        case 232: icon = 'wi-owm-232';
        break;
        case 300: icon = 'wi-owm-300';
        break;
        case 301: icon = 'wi-owm-301';
        break;
        case 302: icon = 'wi-owm-302';
        break;
        case 310: icon = 'wi-owm-310';
        break;
        case 311: icon = 'wi-owm-311';
        break;
        case 312: icon = 'wi-owm-312';
        break;
        case 313: icon = 'wi-owm-313';
        break;
        case 314: icon = 'wi-owm-314';
        break;
        case 321: icon = 'wi-owm-321';
        break;
        case 500: icon = 'wi-owm-500';
        break;
        case 501: icon = 'wi-owm-501';
        break;
        case 502: icon = 'wi-owm-502';
        break;
        case 503: icon = 'wi-owm-503';
        break;
        case 504: icon = 'wi-owm-504';
        break;
        case 511: icon = 'wi-owm-511';
        break;
        case 520: icon = 'wi-owm-520';
        break;
        case 521: icon = 'wi-owm-521';
        break;
        case 522: icon = 'wi-owm-522';
        break;
        case 531: icon = 'wi-owm-531';
        break;
        case 600: icon = 'wi-owm-600';
        break;
        case 601: icon = 'wi-owm-601';
        break;
        case 602: icon = 'wi-owm-602';
        break;
        case 611: icon = 'wi-owm-611';
        break;
        case 612: icon = 'wi-owm-612';
        break;
        case 615: icon = 'wi-owm-615';
        break;
        case 616: icon = 'wi-owm-616';
        break;
        case 620: icon = 'wi-owm-620';
        break;
        case 621: icon = 'wi-owm-621';
        break;
        case 622: icon = 'wi-owm-622';
        break;
        case 701: icon = 'wi-owm-701';
        break;
        case 711: icon = 'wi-owm-711';
        break;
        case 721: icon = 'wi-owm-721';
        break;
        case 731: icon = 'wi-owm-731';
        break;
        case 741: icon = 'wi-owm-741';
        break;
        case 761: icon = 'wi-owm-761';
        break;
        case 762: icon = 'wi-owm-762';
        break;
        case 771: icon = 'wi-owm-771';
        break;
        case 781: icon = 'wi-owm-781';
        break;
        case 800: icon = 'wi-owm-800';
        break;
        case 801: icon = 'wi-owm-801';
        break;
        case 802: icon = 'wi-owm-802';
        break;
        case 803: icon = 'wi-owm-803';
        break;
        case 804: icon = 'wi-owm-804';
        break;
        case 900: icon = 'wi-owm-900';
        break;
        case 901: icon = 'wi-owm-901';
        break;
        case 902: icon = 'wi-owm-902';
        break;
        case 903: icon = 'wi-owm-903';
        break;
        case 904: icon = 'wi-owm-904';
        break;
        case 905: icon = 'wi-owm-905';
        break;
        case 906: icon = 'wi-owm-906';
        break;
        case 957: icon = 'wi-owm-957';
        break;
        default: icon = 'wi-owm-901';
        break;
      }
  
      // return '<i class="wi '+icon+'"></i>';
      console.log(icon);
      
      return icon;
}

getLocation(getTemperature);

