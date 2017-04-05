sap.ui.define([
	"org/fater/app/framework/Component",
	"sap/ui/Device",
	"org/fater/app/model/models",
	"sap/ui/model/json/JSONModel"
	
], function(UIComponent, Device, models, JSONModel) {
	"use strict";

	return UIComponent.extend("org.fater.app.Component", {
		metadata: {
			manifest: "json"
		},
		
		onInit: function(){
			this.getModel("device").refresh();
			
		},
		
		afterInit: function() {
			var rootPath = jQuery.sap.getModulePath("org.fater.app");
			jQuery("head").append("<script src=\""+rootPath+"/util/Constraint.js\"></script>");
			jQuery("head").append("<script src=\""+rootPath+"/util/survey_utils.js\"></script>");
			
			this.getModel('ControlValues').setSizeLimit(1000);
			
			this.parseUserInfo(this);
		//	this.getModel("oDataModel").setUseBatch(true);
			this.getModel("oDataModel").setSizeLimit(600);
		}, 
		
		getBackupRole: function(modelHandler, id, role) {
			if( role === null || role === undefined || jQuery.sap.getUriParameters().get("role")) {
				if( id === "RIF_COMM_01" ) {
					role = "COMMERCIAL_REFERENCE";
				} else if( id === "RESP_COMM_01" || id === "RESP_COMM_02" || id === "RESP_COMM_03" || id === "RESP_COMM_04" || id === "RESP_COMM_05" ) {
					role = "COMMERCIAL_MANAGER";
				} else if( id === "RESP_ANAG" ) {
					role = "ANAGRAPHIC_MANAGER";
				} else {
					role = "SUPPLIER";
				}
				
				if( role === null || role === undefined || jQuery.sap.getUriParameters().get("role")) {
	
					role = jQuery.sap.getUriParameters().get("role");
					
					if( role === null || role === undefined ) {
						role = "SUPPLIER";
					}
				}
			}
			
			var oUserModel = new JSONModel();
			oUserModel.setData({
				Username: id,
				Role: role
			});
			modelHandler.setModel(oUserModel, "user");
		},
		
		parseUserInfo: function(modelHandler) {
			var id = null;
			
			try {
				var userShell = sap.ushell.Container.getService("UserInfo").getUser();
				id = userShell.getId().toUpperCase();
			} catch ( err ) {}
			
			if( id === null || id === undefined ) {
				try {
					id = jQuery.sap.getUriParameters().get("fater_id");
				} catch ( err ) {}
			}
			
			var component = this;
			var oUserModel = component.getModel("user");
			if( !oUserModel ) {
				this.getModel("oUserModel").read("/UserSet('" + id + "')", {
					async: false,
					success: function(oUserOData) {
						if( oUserOData.Role === "" ) {
							oUserOData.Role = "SUPPLIER";
						}
						oUserModel = new JSONModel();
						oUserModel.setData(oUserOData);
						component.setModel(oUserModel, "user");
					},
					error: function(error) {
						component.getBackupRole(modelHandler, id);
					}
				});
			}
		}
	
	});

});