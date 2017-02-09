angular.module('tracker', [])
    .controller('trackController', tControl)

tControl.$inject = ['trackFact'];

function tControl(trackFact, $event) {
    var tCtrl = this;
    tCtrl.greeting = "GET YOUR HACK ON!"

    tCtrl.geoFindMe = function ($event) {
        var output = document.getElementById("out");
        console.log('button clicked', $event)
        if (!navigator.geolocation) {
            output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
            return;
        }

        function success(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

            var img = new Image();
            img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

            output.appendChild(img);
        }

        function error() {
            output.innerHTML = "Unable to retrieve your location";
        }

        output.innerHTML = "<p>Locating…</p>";

        navigator.geolocation.getCurrentPosition(success, error);
    }

}



//*******
//ROBS CODE

var map;

    var markers =[];

    function initMap()    {
        map = new google.maps.Map(document.getElementById('map'), {center: {lat: 40.7413, lng: -73.9980}, zoom: 13});
        

    var locations = [];

    var largeInfowindow = new google.maps.InfoWindow();

    var bounds = new google.maps.LatLngBounds();
    // The following group uses the location array to create an array of markers on init.

    for (var i = 0; i < locations.length; i++)    {
    // get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
    // create a marker per location, and put into the markers array
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        //Extend the boundaries of the map for each marker
        bounds.extend(marker.position);
        //Create an onlick event to open an infowindow at each marker.
        marker.addListener('click', function()    {
            populateInfoWindow(this, largeInfowindow);
        });
    }
        map.fitBounds(bounds);
}
        function populateInfoWindow(marker, infowindow)    {
            //check to make sure the infowindow is not already opened on this marker'
            if(infowindow.marker != marker)    {
                infowindow.marker = marker;
                infowindow.setContent('<div>' + marker.title + ',/div>');
                infowindow.open(map, marker);
                //make sure the marker property is cleared if window is closed
                infowindow.addListener('closeclick', function()    {
                    infowindow.setMarker(null);
                });
            }
        }