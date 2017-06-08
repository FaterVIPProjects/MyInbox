sap.ui.define([
	"org/fater/myinbox/framework/BaseController",
	"org/fater/myinbox/util/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/TextArea",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Text"
], function(Controller, formatter, JSONModel, Dialog, TextArea, Button, ButtonType, Text) {
	"use strict";

	return Controller.extend("org.fater.myinbox.controller.Ticket", {
		
		formatter: formatter, 	
		
		__targetName:		["ticketDetail", "ticketDataCompletion"],
		__partecipationId:	undefined,
		__ticketId:			undefined,
		
		onRouteMatched: function(oEvent, routeName, partecipationId, ticketId){
			var controller = this;
			var oView = this.getView();
			this.__partecipationId = partecipationId;
			this.__ticketId = ticketId;
			
			
			var mParameters = {
				urlParameters: {
					"$expand": "Item"
				},
				success: function(oData) {
					var newOData = this.__mapData(oData);
					
					var oTicketModel = oView.getModel();
					if (!oView.getModel()) {
						oTicketModel = new JSONModel();
					}
					oTicketModel.setData(newOData);
					oView.setModel(oTicketModel);
					
					oView.setBusy(false);
				}.bind(this),
				error: function(oError) {
					jQuery.sap.log.info("Odata Error occured");
					oView.setBusy(false);
				}.bind(this)
			};

			this.getView().setBusy(true);
			this.getView().getModel("oDataModel").read("/TicketHSet(ParticipationId='" + partecipationId + "',TicketId='" + ticketId + "')/", mParameters);

			oView.bindElement("/");
		},
		
		__mapData: function(data) {
			if( data["results"] ) {
				data = data["results"];
			}
				
			for (var i in data) {
				if (data[i] instanceof Object) {
					data[i] = this.__mapData(data[i]);
				}
			}
			return data;
		},
		
		onReply: function(){
			var controller = this;
			var dialog = new Dialog({
				title: controller.getTranslation("ticketDialogTitle"),
				type: 'Message',
				content: [
					new Text({
						text: controller.getTranslation("ticketDialogMessage")
					}),
					new TextArea('ticketBody', {
						growing: true,
						growingMaxLines: 7,
						liveChange: function(oEvent) {
							var enabled = sap.ui.getCore().byId("ticketBody").getValue().length > 0;
							oEvent.getSource().getParent().getBeginButton().setEnabled(enabled);
						},
						width: '100%',
						placeholder: controller.getTranslation("ticketDialogMessageRequired")
					})
				],
				beginButton: new Button({
					type: ButtonType.Accept,
					enabled: false,
					text: controller.getTranslation("ticketDialogPositiveAction"),
					press: function() {
						var sMessage = sap.ui.getCore().byId('ticketBody').getValue();
						var oTicket = controller.getView().getModel().getProperty("/");;
						oTicket.Item.push({
							ParticipationId: controller.__partecipationId,
							Message: sMessage,
							Name: controller.getView().getModel("user").getProperty("/Address/Firstname") + " " + controller.getView().getModel("user").getProperty("/Address/Lastname")
						});
						controller.getView().getModel("oDataModel").create("/TicketHSet", oTicket, null, function() {
							sap.m.MessageToast.show( controller.getTranslation("ticketDialogSuccess") );
							dialog.close();
							controller.onNavBack();
						},
						function() {
							sap.m.MessageToast.show( controller.getTranslation("ticketDialogError") );
						});
					}
				}),
				endButton: new Button({
					text: controller.getTranslation("explanationRequestSupplierDialogNegativeAction"),
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			dialog.open();
		},
		
		onNavBack: function(){
			window.history.go(-1);
		}
		
	});

});