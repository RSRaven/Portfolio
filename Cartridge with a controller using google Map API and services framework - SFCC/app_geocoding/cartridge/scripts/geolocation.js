'use strict';

function getGeolocation (address) {
	
	var serviceRegistry = require('dw/svc/ServiceRegistry');

	var result;
	var params = null;
	
	serviceRegistry.configure("geolocation", {
		parseResponse : function(svc, output) {
			return JSON.parse(output.text);
		}
	});
	var service = serviceRegistry.get("geolocation");

	service.addParam('address', address)
		   .addParam('key', 'AIzaSyASqxkveu-eW8I8nZPbDG-5Buk1wHm1zF0');

	result = service.call();

	if ( (result.status === 'OK') && !empty(result.object.results) ) {
		return result.object.results[0].geometry.location;
	}
	
	return;	
}

exports.getGeolocation = getGeolocation;
