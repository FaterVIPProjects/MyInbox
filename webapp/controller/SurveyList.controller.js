sap.ui.define([
	"org/fater/myinbox/framework/BaseController",
	"org/fater/myinbox/util/formatter"
], function(Controller, formatter) {
	"use strict";

	return Controller.extend("org.fater.myinbox.controller.SurveyList", {

		formatter: formatter,
		__targetName: "surveyList",
		__clonedTemplate: undefined,

		onInit: function() {
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.attachRouteMatched(this.handleRouteMatched, this);
		},

		handleRouteMatched: function(oEvent) {
			this._bDescending = false;
			this.applyFilter(null, true);
		},

		getUserFilter: function() {
			var userId = this.getView().getModel("user").getProperty("/Username");
			var role = this.getView().getModel("user").getProperty("/Role");

			var oUserFilters = null;
			if (role === "SUPPLIER") {
				oUserFilters = new sap.ui.model.Filter([
					new sap.ui.model.Filter("SupplierRefId", sap.ui.model.FilterOperator.EQ, userId),
					new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.NE, "DI"),
					new sap.ui.model.Filter("DoneByFater", sap.ui.model.FilterOperator.EQ, false)
				], true);
			} else if (role === "COMMERCIAL_REFERENCE") {
				//Enable it when DoneByFater will work correctly		        
				var commercialRefFilter = new sap.ui.model.Filter([
					new sap.ui.model.Filter("CommercialRefId", sap.ui.model.FilterOperator.EQ, userId),
					new sap.ui.model.Filter([
						new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "ER"),
						new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "C"),
						new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "C1")
					], false)
				], true);
				oUserFilters = commercialRefFilter;
			} else if (role === "COMMERCIAL_MANAGER") {
				var commercialManagerFilter = new sap.ui.model.Filter([
					new sap.ui.model.Filter("CommercManagerId", sap.ui.model.FilterOperator.EQ, userId),
					new sap.ui.model.Filter([
						new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "A1"),
						new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "C2")
					], false)
				], true);

				oUserFilters = commercialManagerFilter;
			} else if (role === "ANAGRAPHIC_MANAGER") {
				oUserFilters = new sap.ui.model.Filter([
					new sap.ui.model.Filter("RegistryManagerId", sap.ui.model.FilterOperator.EQ, userId),
					new sap.ui.model.Filter([
						new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "A2"),
						new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "C3")
					], false)
				], true);
			}

			return oUserFilters;
		},

		onListItemPress: function(oEvent) {
			// Hide master
			var oSplitApp = this.getView().getParent().getParent();
			oSplitApp.setMode(sap.m.SplitAppMode.HideMode);

			var participationID = oEvent.getSource().getBindingContextPath().substring(1);

			var status = this.getView().getModel("oDataModel").getProperty(oEvent.getSource().getBindingContextPath() + "/Status");
			var userRole = this.getView().getModel("user").getProperty("/Role");
			var userId = this.getView().getModel("user").getProperty("/Username");

			var isSupplier = userRole === this.getOwnerComponent().getModel("Types").getProperty("/userRoleTypes/SUPPLIER") ||
				(
					userId === this.getView().getModel("oDataModel").getProperty(oEvent.getSource().getBindingContextPath() + "/CommercialRefId") &&
					this.getView().getModel("oDataModel").getProperty(oEvent.getSource().getBindingContextPath() + "/DoneByFater") === true
				);

			sap.ui.getCore().getEventBus().publish("validate", "refresh_validity_check", {});
			
			// DB - FIX bug #076: Forzatura routing sempre su schermata dettaglio (commentato l'if)
			/*
			if (!isSupplier && (status === "C1" || status === "C2" || status === "C3" || status === "ER" || status === "ES" || status === "QC")) {
				this.getRouter().navTo("dataCompletion", {
					id: participationID
				});
			} else {
			*/	
				this.getRouter().navTo("detail", {
					id: participationID
				});
//			}
		},

		handleMenuConfirm: function(oEvent) {
			this._pTypeFilter = [];
			var filterKey = oEvent.getParameter("filterKeys");
			for (var key in filterKey) {
				if (filterKey.hasOwnProperty(key)) {
					this._pTypeFilter.push(new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.EQ, key));
				}
			}
			this.applyFilter();
		},

		onFilterParticipationTypePress: function(oEvent) {
			if (!this._oFilterDialog) {
				this._oFilterDialog = sap.ui.xmlfragment("org.fater.myinbox.view.fragment.dialogs.ParticipationTypeMenu", this);
				this.getView().addDependent(this._oFilterDialog);
			}
			this._oFilterDialog.open("filter");
		},

		handleRefresh: function(oEvent) {
			var oView = this.getView();
			var oList = oView.byId("surveyList");
			var oBinding = oList.getBinding("items");
			oView.setBusy(true);
			this._refresh = true;
			oBinding.refresh();
			this.applyFilter(this._searchString);
			oView.setBusy(false);
		},

		onSearch: function(oEvent) {
			//search string is saved to reapply search on refresh
			this._searchString = this.getView().byId("searchField").getValue().trim();
			this.applyFilter(this._searchString);
		},

		applyFilter: function(string, initList) {
			var oView = this.getView();
			var oMasterPage = oView.byId("Master");
			var oList = oView.byId("surveyList");

			if (initList) {
				if (this.__clonedTemplate === undefined) {
					this.__clonedTemplate = oList.getItems()[0].clone();
				}
				this.__clonedTemplate.setVisible(true);
				oList.bindItems({
					path: "oDataModel>/ParticipationSet",
					template: this.__clonedTemplate,
					filters: this.getUserFilter(),
					parameters: {
						expand: "Supplier,Survey,Cluster"
					}
				});
			}

			var oBinding = oList.getBinding("items");
			var role = this.getView().getModel("user").getProperty("/Role");
			var filterValue = role === this.getView().getModel("Types").getProperty("/userRoleTypes/SUPPLIER") ? "ParticipationId" :
				"Supplier/Name1";
			//apply filters to binding
			var filters = [];
			
			// FIX AS 28.04.2017 - FIX Filtri
			filters.push(this.getUserFilter());
			
			if (this._pTypeFilter && this._pTypeFilter.length > 0) {
				filters.push(new sap.ui.model.Filter(this._pTypeFilter, false));
			}
			if (string && string.length > 0) {
				
					var filter = new sap.ui.model.Filter(
						filterValue,
						sap.ui.model.FilterOperator.Contains,
						string
					);

				filters.push(filter);
			}
			oBinding.filter(filters, sap.ui.model.FilterType.Application);

			// apply sorter to binding
			var aSorters = [];
			aSorters.push(new sap.ui.model.Sorter(filterValue, this._bDescending));
			oBinding.sort(aSorters);
		},

		onMasterListUpdateFinish: function(oEvent) {
			var whiteListedStatus = [];
			var role = this.getView().getModel("user").getProperty("/Role");
			if (role === this.getView().getModel("Types").getProperty("/userRoleTypes/SUPPLIER")) {
				whiteListedStatus.push(this.getView().getModel("Types").getProperty("/participationStatus/I"));
				whiteListedStatus.push(this.getView().getModel("Types").getProperty("/participationStatus/DQ"));
				whiteListedStatus.push(this.getView().getModel("Types").getProperty("/participationStatus/ES"));
				whiteListedStatus.push(this.getView().getModel("Types").getProperty("/participationStatus/EA"));
			}
			var items = oEvent.getSource().getItems();
			var count = 0;
			if (whiteListedStatus.length > 0) {
				for (var i = 0; i < items.length; i++) {
					if (whiteListedStatus.indexOf(items[i].getBindingContext("oDataModel").getObject().Status) !== -1) {
						count++;
					}
				}
				// DB - FIX bug #083: aggiunta assegnazione Master title
				this.getView().byId("Master").setTitle(this.getTranslation("participation") + " (" + count + ")");
			} else {
				count = items.length;
			
			//---------------------------------------------------------------------------------------------------	
			// DB - FIX bug #083: Conteggio relativo alla lista dei lavori (chiamata function)
			var searchedName = this.getView().byId("searchField").getValue();
			var view = this.getView();
			var translation = this.getTranslation("participation");
			this.getView().getModel("oDataModel").callFunction("ParticipationCount",
                                        "GET",
                                        {"SupplierName" : searchedName  }, 
                                        null,        
                                        function(oData, response) {
                                        	count = parseInt(response.data.NumCount);
                                        	view.byId("Master").setTitle(translation + " (" + count + ")");
                                        }, 
                                        function(oError){
                                        } );
			//---------------------------------------------------------------------------------------------------
				
			}
		// DB - FIX bug #083: commentata assegnazione Master title 	
		//	this.getView().byId("Master").setTitle(this.getTranslation("participation") + " (" + count + ")");
			
		},

		onSortButtonPress: function() {
			var oView = this.getView();
			var oList = oView.byId("surveyList");
			var oBinding = oList.getBinding("items");
			var sortValue = "Supplier/Name1";

			// apply sorter to binding
			var aSorters = [];
			aSorters.push(new sap.ui.model.Sorter(sortValue, this._bDescending));
			oBinding.sort(aSorters);

			// update sort order
			this._bDescending = !this._bDescending;
		}

	});

});