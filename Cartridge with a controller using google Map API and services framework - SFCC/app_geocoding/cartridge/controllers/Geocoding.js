'use strict';

/* Script Modules */
var guard = require('sitegenesis_storefront_controllers/cartridge/scripts/guard');
var app = require('sitegenesis_storefront_controllers/cartridge/scripts/app');
var URLUtils = require('dw/web/URLUtils');
 
function show() {
	app.getForm('geolocation').clear();
	
	app.getView({
		Action: 'getgeolocation',
		ContinueURL: URLUtils.https('Geocoding-HandleForm')
	}).render('geolocation');
}

function handleForm() {
	var geolocationForm = app.getForm('geolocation');
	var address = geolocationForm.object.address.value;

	if (empty(address)) {
		geolocationForm.object.address.invalidateFormElement();
		app.getView({
			Action: 'getgeolocation',
			ContinueURL: URLUtils.https('Geocoding-HandleForm')
		}).render('geolocation');
		return;
	}
	
	var coordinates = getCoordinates(address);
	
	
	geolocationForm.handleAction({
		getgeolocation: function () {
			app.getView({
				CurrentForms: session.forms,
				coordinates: coordinates
			}).render('geolocation');
			return;
		},
  
		error: function () {
			success = false;
		}
	});
}

function getCoordinates(address) {
	var coordinates;
	var customObjectMgr = require('dw/object/CustomObjectMgr');
	var co = customObjectMgr.getCustomObject('geolocation', address);
	
	if (co === null) {
		var geolocationUtil = require('~/cartridge/scripts/geolocation.js');

		coordinates = geolocationUtil.getGeolocation(address);
		
		if (coordinates) {
			var transaction = require('dw/system/Transaction');
			transaction.wrap(function() {
				co = customObjectMgr.createCustomObject('geolocation', address);
				co.custom.latitude = coordinates.lat;
				co.custom.longitude = coordinates.lng;
			});
		}

	} else {
		coordinates = {
			lat: co.custom.latitude,
			lng: co.custom.longitude
		}
	}

	return coordinates;
}

exports.Show = guard.ensure(['get'], show);
exports.HandleForm = guard.ensure(['post'], handleForm);
