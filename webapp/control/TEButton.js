/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
// Provides control .TEInput.
sap.ui.define(['sap/m/Button'],
	function(Button) {
	"use strict";

	var TEButton = Button.extend("org.fater.app.control.TEButton", { 
	
		metadata : {
			//library : "sap.m",
			properties : {
				customId : {type : "string", group : "Misc", defaultValue : null, deprecated: false},
				relatedCustomId : {type : "string", group : "Misc", defaultValue : null, deprecated: false}
			}
		}, 
		renderer: {}
		
	});

	return TEButton;

}, /* bExport= */ true);