sap.ui.define([
	"org/fater/app/framework/BaseController"
], function(Controller) {
	"use strict";

	return Controller.extend("org.fater.app.controller.App", {
		
/*		onRouteMatched: function(){
			this._isMasterOpening = false;	
		},*/
		
		onHomePress: function(){
			this.navTo("surveyList");
		}, 
		
/*		onMasterButtonPress: function(){
			if (this._isMasterOpening){
				this.getView().byId("app").setMode(sap.m.SplitAppMode.ShowHideMode);				
			} 
			this._isMasterOpening = !this._isMasterOpening;
		}*/
		
		onAfterMasterOpenPress: function(){
			this.getView().byId("app").setMode(sap.m.SplitAppMode.ShowHideMode);
		}
	});

});