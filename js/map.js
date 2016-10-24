var map, infowindow, marker, input;
function initMap() {
	var mapElementId = 'map';
	map = new google.maps.Map(document.getElementById(mapElementId), {
		center: {lat: 37.990832, lng: 23.7033199},
		zoom: 8
	});
	
	input = document.getElementById('pac-input');

	var autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds', map);

	infowindow = new google.maps.InfoWindow();
	marker = new google.maps.Marker({
	  map: map,
	  anchorPoint: new google.maps.Point(0, -29)
	});

	autocomplete.addListener('place_changed', function() {
	  infowindow.close();
	  marker.setVisible(false);
	  var place = autocomplete.getPlace();
	  
	  setThePlace(place);
	  
	});
}

var findGeolocation = function(){
	infowindow.close();
	infoWindow = new google.maps.InfoWindow({map: map});
	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+pos.lat+','+pos.lng+'&sensor=true';
			$.get(url).done(function(data){
				var address = data.results[0].formatted_address;
				
				marker.setIcon(({
					url: "https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png",
					size: new google.maps.Size(71, 71),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(17, 34),
					scaledSize: new google.maps.Size(35, 35)
				}));
				marker.setPosition(pos);
				marker.setVisible(true);
				infowindow.setContent('<div><strong>' + address + '</strong><br>' + address);
				infowindow.open(map, marker);
				map.setCenter(pos);
				map.setZoom(15);
				
				setAngularPlace({
					address: address,
					lat: pos.lat,
					lng: pos.lng
				});
				
				input.value="";
			});
			
		},function(){
			alert("Error with location");
		});
	}
	else
		alert("Browser doesn't support Geolocation");
};

function setThePlace(place){
	
	if (!place.geometry) {
		window.alert("Autocomplete's returned place contains no geometry");
		return;
	  }

	  // If the place has a geometry, then present it on a map.
	  if (place.geometry.viewport) {
		map.fitBounds(place.geometry.viewport);
		map.setZoom(15);
	  } else {
		map.setCenter(place.geometry.location);
		map.setZoom(15);
	  }
	  marker.setIcon(({
		url: place.icon,
		size: new google.maps.Size(71, 71),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(17, 34),
		scaledSize: new google.maps.Size(35, 35)
	  }));
	  marker.setPosition(place.geometry.location);
	  marker.setVisible(true);

	  var address = '';
	  if (place.address_components) {
		address = [
		  (place.address_components[0] && place.address_components[0].short_name || ''),
		  (place.address_components[1] && place.address_components[1].short_name || ''),
		  (place.address_components[2] && place.address_components[2].short_name || '')
		].join(' ');
	  }

	  infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
	  infowindow.open(map, marker);
	  
	setAngularPlace({
		address: address,
		lat: place.geometry.location.lat(),
		lng: place.geometry.location.lng()
	});
}

function setAngularPlace(obj){
	angular.element('body').scope().setPlace(obj);
}