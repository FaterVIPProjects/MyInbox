/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
sap.ui.define([
	"org/fater/app/framework/BaseController",
	"org/fater/app/util/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/Input",
	"sap/m/TextArea",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Text",
	"sap/ui/commons/RichTooltip",
	"org/fater/app/control/TETextQuestion",
	"org/fater/app/control/TETextAreaQuestion",
	"org/fater/app/control/TEChoiceQuestion",
	"org/fater/app/control/TERadioQuestion",
	"org/fater/app/control/TEFileQuestion",
	"org/fater/app/control/TERevenueYear3Question",
	"org/fater/app/control/TERevenueYearQuestion",
	"org/fater/app/control/TEDateQuestion",
	"org/fater/app/control/TEMoneyQuestion",
	"org/fater/app/control/TEFileComplexQuestion",
	"org/fater/app/control/TENumberType",
	"org/fater/app/control/TENumberTypeString"
], function(Controller, formatter, JSONModel, MessageBox, Dialog, Input, TextArea, Button, ButtonType, Text, RichTooltip, TETextQuestion, TETextAreaQuestion,
	TEChoiceQuestion, TERadioQuestion, TEFileQuestion, TERevenueYear3Question, TERevenueYearQuestion, TEDateQuestion, TEMoneyQuestion, 
	TEFileComplexQuestion, TENumberType, TENumberTypeString) {
	"use strict";

	return Controller.extend("org.fater.app.controller.Detail", {

		__targetName: "detail",
		formatter: formatter,
		__partecipationId: undefined,
		__role: undefined,
		__total_q_count: 0,
		__total_q_result_count: 0,
		__survey_validated: false,
		__participation_id: false,
		_i: {},
		_firstTimeValidate: true,
		isFromBack: false,
		__isFormValid: false,
		
		__initFieldsVisibility: function(controller) {
			
			var supplierType = controller.getView().getModel().getProperty("/Supplier/Type");
			var surveyType = controller.getView().getModel().getProperty("/Type");
			var surveyStatus = controller.getView().getModel().getProperty("/Status");
			var userRole = controller.getView().getModel("user").getProperty("/Role");
			var userId = controller.getView().getModel("user").getProperty("/Username");
			var isDoneByFater = controller.getView().getModel().getProperty("/DoneByFater") === true;
			var isCommercialRef = userId === controller.getView().getModel().getProperty("/CommercialRefId");
			var isSupplier = userRole === controller.getOwnerComponent().getModel("Types").getProperty("/userRoleTypes/SUPPLIER") || ( isCommercialRef && isDoneByFater );
			var disableAll = userRole === controller.getOwnerComponent().getModel("Types").getProperty("/userRoleTypes/SUPPLIER") && surveyStatus === this.getComponentModelProperty("Types", "/participationStatus/R");
			var fields = {};
			
			
				// visible="{field_visibility>/business_name/visible}"
				// enabled="{field_visibility>/business_name/enabled}"
				// required="{field_visibility>/business_name/required}" 
			
			//all fields
			
			
			//	--- DONEBYFATER FIELDS ---
			var tabKey = "0";
			
			controller.__addField(fields, tabKey, null, "supplier_doc_form", isDoneByFater );
			controller.__addField(fields, tabKey, {"realtime_validate": false}, "supplier_doc_upload_email", isDoneByFater, isDoneByFater && isCommercialRef, isDoneByFater && isCommercialRef );
			controller.__addField(fields, tabKey, {"realtime_validate": false}, "supplier_doc_upload_form", isDoneByFater, isDoneByFater && isCommercialRef, isDoneByFater && isCommercialRef );
			
			//	--- GENERAL FIELDS ---
			//	supplier_code
			//	header
			//	business_name
			//	research_critery
			//	street_address
			//	street_number
			//	cap
			//	locality
			//	country
			//	province
			//	telephone
			//	communication_preferred
			//	fax
			//	email
			
			controller.__addField(fields, tabKey, null, "supplier_code" );
			controller.__addField(fields, tabKey, null, "header" );
			controller.__addField(fields, tabKey, null, "business_name" );
			controller.__addField(fields, tabKey, null, "research_critery" );
			controller.__addField(fields, tabKey, null, "street_address" );
			controller.__addField(fields, tabKey, null, "street_number" );
			controller.__addField(fields, tabKey, null, "cap" );
			controller.__addField(fields, tabKey, null, "locality" );
			controller.__addField(fields, tabKey, null, "country" );
			controller.__addField(fields, tabKey, null, "province" );
			controller.__addField(fields, tabKey, null, "telephone" );
			controller.__addField(fields, tabKey, null, "communication_preferred" );
			controller.__addField(fields, tabKey, null, "fax" );
			controller.__addField(fields, tabKey, null, "email" );
			
			
			
			if( surveyType === controller.getOwnerComponent().getModel("Types").getProperty("/participationType/PRE_QUALIFICATION") ) {
				controller.__addField(fields, tabKey, null, "supplier_code", true );
				controller.__addField(fields, tabKey, null, "business_name", true );
				controller.__addField(fields, tabKey, null, "country", true );
			} else {
				controller.__addField(fields, tabKey, null, "supplier_code", true );
				controller.__addField(fields, tabKey, null, "business_name", true );
				controller.__addField(fields, tabKey, null, "research_critery", true );
				controller.__addField(fields, tabKey, null, "street_address", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
				controller.__addField(fields, tabKey, null, "street_number", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
				controller.__addField(fields, tabKey, null, "cap", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
				controller.__addField(fields, tabKey, null, "locality", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
				controller.__addField(fields, tabKey, null, "country", true );
				controller.__addField(fields, tabKey, null, "province", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
				controller.__addField(fields, tabKey, null, "telephone", true, !isSupplier || disableAll ? false : true );
				controller.__addField(fields, tabKey, null, "communication_preferred", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
				controller.__addField(fields, tabKey, null, "fax", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
				controller.__addField(fields, tabKey, {"validation": {"email": true}}, "email", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
			}
			
			//Disable verification for fax and email
			fields.email.skipVerification = true;
			fields.fax.skipVerification = true;
			
			//	--- CONTACTS ---
			//	contact_title
			//	contact_name
			//	contact_surname
			//	contact_area
			//	contact_telephone
			//	contact_cellphone
			//	contact_email
			
			controller.__addField(fields, tabKey, null, "contact_title", true, !isSupplier || disableAll ? false : true );
			controller.__addField(fields, tabKey, null, "contact_name", true );
			controller.__addField(fields, tabKey, null, "contact_surname", true );
			controller.__addField(fields, tabKey, null, "contact_area", true );
			controller.__addField(fields, tabKey, null, "contact_telephone", true, !isSupplier || disableAll ? false : true );
			controller.__addField(fields, tabKey, null, "contact_cellphone", true, !isSupplier || disableAll ? false : true );
			controller.__addField(fields, tabKey, {"validation": {"email": true}}, "contact_email", true );
			
			//	--- OTHER CONTACTS ---
			// contact_business_name
			// contact_business_surname
			// contact_business_email
			// contact_business_bank_attestation
			// contact_oda_name
			// contact_oda_surname
			// contact_oda_email
			// contact_administration_name
			// contact_administration_surname
			// contact_administration_email
			tabKey = "2";
			
			
			// Always the same for every kind			
			controller.__addField(fields, tabKey, null, "contact_business_name", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
			controller.__addField(fields, tabKey, null, "contact_business_surname", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
			controller.__addField(fields, tabKey, {"validation": {"email": true}}, "contact_business_email", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
			
			controller.__addField(fields, tabKey, null, "contact_business_bank_attestation", false );
			if( surveyType === controller.getOwnerComponent().getModel("Types").getProperty("/participationType/ONLY_CODIFICATION") ) {
				controller.__addField(fields, tabKey, null, "contact_business_bank_attestation", true, !isSupplier || disableAll ? false : true );
			} else {
				controller.__addField(fields, tabKey, null, "contact_business_bank_attestation", false );
			}
			
			
			controller.__addField(fields, tabKey, null, "contact_oda_name", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : false );
			controller.__addField(fields, tabKey, null, "contact_oda_surname", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : false );
			controller.__addField(fields, tabKey, {"validation": {"email": true}}, "contact_oda_email", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : false );
			
			controller.__addField(fields, tabKey, null, "contact_administration_name", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : false );
			controller.__addField(fields, tabKey, null, "contact_administration_surname", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : false );
			controller.__addField(fields, tabKey, {"validation": {"email": true}}, "contact_administration_email", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : false );
			
			//	--- SUPPLIER ---
			//	*cluster
			//	*supplier_type
			//	vat_it
			//	vat_cee
			//	fiscal_code
			//	profession
			//	phisical_person
			//	gender
			//	birth_city
			//	birth_date
			//	withholding
			//	survey_type
			//	*fater_company
			//	*fater_purchase_org
			//	*industrial_sector
			
			tabKey = "0";
			controller.__addField(fields, tabKey, null, "cluster" );
			controller.__addField(fields, tabKey, null, "supplier_type" );
			controller.__addField(fields, tabKey, null, "vat_it" );
			controller.__addField(fields, tabKey, null, "vat_cee" );
			controller.__addField(fields, tabKey, null, "fiscal_code" );
			controller.__addField(fields, tabKey, null, "profession" );
			controller.__addField(fields, tabKey, null, "phisical_person" );
			controller.__addField(fields, tabKey, null, "gender" );
			controller.__addField(fields, tabKey, null, "birth_city" );
			controller.__addField(fields, tabKey, null, "birth_date" );
			controller.__addField(fields, tabKey, null, "withholding" );
			controller.__addField(fields, tabKey, null, "survey_type" );
			controller.__addField(fields, tabKey, null, "fater_company" );
			controller.__addField(fields, tabKey, null, "fater_purchase_org" );
			controller.__addField(fields, tabKey, null, "industrial_sector" );
			
			if( supplierType === controller.getOwnerComponent().getModel("Types").getProperty("/supplierTypes/NATIONAL") ) {
				controller.__addField(fields, tabKey, null, "vat_it", true );
			} else if ( supplierType === controller.getOwnerComponent().getModel("Types").getProperty("/supplierTypes/CEE") ) {
				controller.__addField(fields, tabKey, null, "vat_cee", true );
			} else if ( supplierType === controller.getOwnerComponent().getModel("Types").getProperty("/supplierTypes/EXTRA_CEE") ) {
				controller.__addField(fields, tabKey, null, "vat_cee", true );
			} else if( supplierType === controller.getOwnerComponent().getModel("Types").getProperty("/supplierTypes/FREELANCER") ) {
				controller.__addField(fields, tabKey, null, "vat_it", true );
				controller.__addField(fields, tabKey, null, "fiscal_code", true );
				
				controller.__addField(fields, tabKey, null, "profession", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
				controller.__addField(fields, tabKey, null, "gender", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
				controller.__addField(fields, tabKey, null, "birth_city", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
				controller.__addField(fields, tabKey, null, "birth_date", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
				controller.__addField(fields, tabKey, null, "withholding", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
			}
			
			
			//	--- BANK ---
			//	bank_name
			//	bank_address
			//	abi
			//	cab
			//	bank_account
			//	cin
			//	swift
			//	iban
			//	backup_account
			
			tabKey = "1";
			controller.__addField(fields, tabKey, null, "bank_name" );
			controller.__addField(fields, tabKey, null, "bank_address" );
			controller.__addField(fields, tabKey, null, "branch" );
			controller.__addField(fields, tabKey, null, "branch_code" );
			controller.__addField(fields, tabKey, null, "abi" );
			controller.__addField(fields, tabKey, null, "cab" );
			controller.__addField(fields, tabKey, null, "bank_account" );
			controller.__addField(fields, tabKey, null, "cin" );
			controller.__addField(fields, tabKey, null, "swift" );
			controller.__addField(fields, tabKey, null, "iban" );
			controller.__addField(fields, tabKey, null, "backup_account" );
			
			if( surveyType !== controller.getOwnerComponent().getModel("Types").getProperty("/participationType/PRE_QUALIFICATION") ) {
				controller.__addField(fields, tabKey, null, "payment_form", true );
				
				controller.__addField(fields, tabKey, null, "bank_name", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
				controller.__addField(fields, tabKey, null, "bank_address", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
				controller.__addField(fields, tabKey, null, "backup_account", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
				
				if( supplierType === controller.getOwnerComponent().getModel("Types").getProperty("/supplierTypes/NATIONAL") || supplierType === controller.getOwnerComponent().getModel("Types").getProperty("/supplierTypes/FREELANCER") ) {
					controller.__addField(fields, tabKey, null, "abi", true );
					controller.__addField(fields, tabKey, null, "cab", true );
					controller.__addField(fields, tabKey, null, "bank_account", true );
					controller.__addField(fields, tabKey, null, "cin", true );
					controller.__addField(fields, tabKey, null, "swift", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
					controller.__addField(fields, tabKey, null, "iban", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
				} else if ( supplierType === controller.getOwnerComponent().getModel("Types").getProperty("/supplierTypes/CEE") ) {
					controller.__addField(fields, tabKey, null, "branch", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
					controller.__addField(fields, tabKey, null, "branch_code", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
					controller.__addField(fields, tabKey, null, "swift", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
					controller.__addField(fields, tabKey, null, "iban", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
				} else if ( supplierType === controller.getOwnerComponent().getModel("Types").getProperty("/supplierTypes/EXTRA_CEE") ) {
					controller.__addField(fields, tabKey, null, "branch_code", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
					controller.__addField(fields, tabKey, null, "swift", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
					controller.__addField(fields, tabKey, null, "iban", true, !isSupplier || disableAll ? false : true, !isSupplier || disableAll ? false : true );
				}
				
				fields.abi.minLength = 5;
				fields.cab.minLength = 5;
				fields.bank_account.minLength = 12;
				fields.swift.minLength = 11;
				fields.iban.minLength = 4;
				
			} else {
				controller.__addField(fields, tabKey, null, "payment_form", false );
			}
			
			controller.__fields = fields;
			
			var oFieldsModel = new JSONModel();
			oFieldsModel.setData(fields);
			controller.getView().setModel(oFieldsModel, "field_visibility");
		},
		
		__addField: function(fields, group, options, field_name, visible, enabled, required) {
			if( fields[field_name] === undefined ) {
				fields[field_name] = {};
			}
			fields[field_name].group = group;
			fields[field_name].name = field_name;
			fields[field_name].options = options;
			fields[field_name].visible = visible ? visible : false;
			fields[field_name].enabled = enabled ? enabled : false;
			fields[field_name].required = required ? required : false;
			fields[field_name].class = fields[field_name].required ? "fakeLabel required" : "fakeLabel";
			fields[field_name].skipVerification = false;
			fields[field_name].minLength = 0;
			return fields;
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
		
		__mapHSE: function(isHSE, questions) {
			if( !questions || questions.length === 0 )
				return;
			
			for (var qi in questions) {
				var q = questions[qi];
				if( isHSE ) {
					var HsnePoints = 0;
					for (var ai in q["AnswerS"]) {
						var a = q["AnswerS"][ai];
						if( a.Selected ) {
							HsnePoints += a["HsnePoints"];
						}
					}
					q["HsnePoints"] = HsnePoints;
				}
				q["IsHsne"] = isHSE;
			}
		},
		
		onExit: function() {
			if( this._busyDialog ) {
				this._busyDialog.destroy();
				this._busyDialog = null;
			}
			if( this._submitDialog ) {
				this._submitDialog.destroy();
				this._submitDialog = null;
			}
		},

		onRouteMatched: function(oEvent, routeName, id) {
			var oView = this.getView();
			var controller = this;
			this.isFromBack = this.__partecipationId === id;
			this.__partecipationId = id;
			
			this.resetValidation();
			
			if( !this.isFromBack ) {
				var mParameters = {
					urlParameters: {
						"$expand": "Survey,Survey/GroupS/QuestionS/AnswerS,Supplier,Cluster/ClusterCom/Company/PurchaseOrg,Supplier/Company,Supplier/PurchaseOrg"
						// "$expand": "Survey,Survey/GroupS/QuestionS/AnswerS,Supplier"
					},
					success: function(oData) {
						var newOData = this.__mapData(oData);
						this.__mapHSE(newOData.Survey.GroupS[0].IsHsne, newOData.Survey.GroupS[0].QuestionS);
						this.__mapHSE(newOData.Survey.GroupS[1].IsHsne, newOData.Survey.GroupS[1].QuestionS);
						this.__mapHSE(newOData.Survey.GroupS[2].IsHsne, newOData.Survey.GroupS[2].QuestionS);
						this.__mapHSE(newOData.Survey.GroupS[3].IsHsne, newOData.Survey.GroupS[3].QuestionS);
						
						var oParticipationModel = oView.getModel();
						if (!oView.getModel()) {
							var oParticipationModel = new JSONModel();
						}
						oParticipationModel.setData(newOData);
						oView.setModel(oParticipationModel);
						
						controller.__initFieldsVisibility(controller);
						controller._updateLocalitySelectOptions( newOData.Supplier.Country );
						
						var supplierType = controller.getView().getModel().getProperty("/Supplier/Type");
						var surveyType = controller.getView().getModel().getProperty("/Type");
						var surveyStatus = controller.getView().getModel().getProperty("/Status");
						var userRole = controller.getView().getModel("user").getProperty("/Role");
						var userId = controller.getView().getModel("user").getProperty("/Username");
						var isSupplier = userRole === controller.getOwnerComponent().getModel("Types").getProperty("/userRoleTypes/SUPPLIER") ||
								(userId === controller.getView().getModel().getProperty("/CommercialRefId") &&
								controller.getView().getModel().getProperty("/DoneByFater") === true
								);
						
						// id=filter_tab_welcome
						// visible="{= ${user>/Username} === ${SupplierRefId} || ( ${user>/Username} === ${CommercialRefId} &amp;&amp; ${DoneByFater} === true ) }"
						var isWelcomeVisible = userId === controller.getView().getModel().getProperty("/SupplierRefId") || (
							userId === 	controller.getView().getModel().getProperty("/CommercialRefId") && 
							controller.getView().getModel().getProperty("/DoneByFater")
						);
						oView.byId("filter_tab_welcome").setVisible( isWelcomeVisible );
						
						// id=filter_tab_0
						// visible="{= (${user>/Username} === ${SupplierRefId} || ( ${user>/Username} === ${CommercialRefId} &amp;&amp; ${DoneByFater} === true )) === false }"
						oView.byId("filter_tab_0").setVisible( !isWelcomeVisible );
						if( isWelcomeVisible ) {
							oView.byId("welcome_image").setSrc($.sap.getModulePath("org.fater.app", "/img/faterspa.jpg") );
						}
						
						var doneByFater = controller.getView().getModel().getProperty("/DoneByFater");
						var userRole = controller.getView().getModel("user").getProperty("/Role");
						var userId = controller.getView().getModel("user").getProperty("/Username");
						var isCommercialRef = userId === controller.getView().getModel().getProperty("/CommercialRefId");
						var isSupplier = userRole === controller.getOwnerComponent().getModel("Types").getProperty("/userRoleTypes/SUPPLIER") || ( isCommercialRef && doneByFater );
						var surveyStatus = controller.getView().getModel().getProperty("/Status");
						
						if( (isSupplier && (surveyStatus === controller.getComponentModelProperty("Types", "/participationStatus/ES") || surveyStatus === controller.getComponentModelProperty("Types", "/participationStatus/EA"))) 
							|| (isCommercialRef && surveyStatus === controller.getComponentModelProperty("Types", "/participationStatus/ER")) ) {
							oView.byId("iconTabBar").setSelectedKey( "communicationTabFilter" );
						} else {
							oView.byId("iconTabBar").setSelectedKey( isWelcomeVisible ? "0" : "1" );
						}
						
						this.getView().getModel("oUserModel").read("/UserSet('" + newOData.CommercialRefId + "')", {
							success: function(oUserOData) {
								var oUserModel = new JSONModel();
								oUserModel.setData(oUserOData);
								oView.setModel(oUserModel, "CommercialReference");
							}
						});
						
						var iban = controller.getView().byId("iban");
						iban.attachChange(function(oEventChange) {
							var v = iban.getValue();
							var countryCode = v.substring(0, 2);
							var cinIban = v.substring(2, 4);
							var cin = v.substring(4, 5);
							var abi = v.substring(5, 10);
							var cab = v.substring(10, 15);
							var bankAccount = v.substring(15, 27);
							controller.getView().byId("abi").setValue(abi);
							controller.getView().byId("cab").setValue(cab);
							controller.getView().byId("cin").setValue(cin);
							controller.getView().byId("bank_account").setValue(bankAccount);
						});
	
						oView.bindElement("/");
						
						for (var key in this.__fields) {
						  if (this.__fields.hasOwnProperty(key)) {
							this.handleFieldVerification(this.__fields[key]);
						  }
						}
						
						if( !this.getView().getModel("tickets") ) {
							this.__loadTickets();
						}
						
						
						this.getView().byId("detailPage").setShowFooter(true);
						
						oView.setBusy(false);
					}.bind(this),
					error: function(oError) {
						jQuery.sap.log.info("Odata Error occured");
						oView.setBusy(false);
					}.bind(this)
				};	
				
				this.getView().setBusy(true);
				this.getView().getModel("oDataModel").read("/" + id, mParameters);
			}
			
			

			//Subscribe to validation Event
			sap.ui.getCore().getEventBus().subscribe("validate", "result", this.onValidateResult, this);
			sap.ui.getCore().getEventBus().subscribe("validate", "refresh_validity_check", this.onRefreshValidityCheck, this);

			
			/*this.getView().addEventDelegate({
				onBeforeShow: function(oEvent) {
					controller.tryUIFixTabSelect();
					controller.tryUIFixTabShowHide();
				}
			});*/

		},
		
		handleFieldVerification: function(field) {
			var controller = this;
			var e = this.getView().byId(field.name);
			if( e && !field.skipValidation && (field.options === null || field.options.realtime_validate) ) {
				if( e.attachChange ) {
					e.attachChange(function(oEventChange) {
						var valid = controller.__checkRequired(field, false);
						if( controller.tabError.fields[field["name"]] === undefined || valid !== controller.tabError.fields[field["name"]] ) {
							if( !valid ) {
								controller.tabError.groups[field["group"]]++;
							} else if( valid && controller.tabError.fields[field["name"]] !== undefined ) {
								controller.tabError.groups[field["group"]]--;
							}
						}
						controller.tabError.fields[field["name"]] = valid;
						controller.processValidation();
					});
				} else if( e.attachSelect ) {
					e.attachSelect(function(oEventSelect) {
						var valid = controller.__checkRequired(field, false);
						if( controller.tabError.fields[field["name"]] === undefined || valid !== controller.tabError.fields[field["name"]] ) {
							if( !valid ) {
								controller.tabError.groups[field["group"]]++;
							} else if( valid && controller.tabError.fields[field["name"]] !== undefined ) {
								controller.tabError.groups[field["group"]]--;
							}
						}
						controller.tabError.fields[field["name"]] = valid;
						controller.processValidation();
					});
				}
			}
		},
		
		tryUIFixTabSelect: function() {
			var oView = this.getView();
			var iconTabBar = oView.byId("iconTabBar");
			var selectedKey = iconTabBar.getSelectedKey();
			iconTabBar.setSelectedKey( "6" );
			iconTabBar.setSelectedKey( "2" );
			iconTabBar.setSelectedKey( "3" );
			iconTabBar.setSelectedKey( "4" );
			iconTabBar.setSelectedKey( "5" );
			iconTabBar.setSelectedKey( "6" );
			iconTabBar.setSelectedKey( "communicationTabFilter" );
			iconTabBar.setSelectedKey( "6" );
			iconTabBar.setSelectedKey( selectedKey );
		},
		
		tryUIFixTabShowHide: function() {
			var oView = this.getView();
			oView.byId("survey_group_all").setVisible(false);
			setTimeout(function() {
				oView.byId("survey_group_all").setVisible(true);
			}, 500);
			oView.byId("survey_group_0").setVisible(false);
			setTimeout(function() {
				oView.byId("survey_group_0").setVisible(true);
			}, 500);
			oView.byId("survey_group_1").setVisible(false);
			setTimeout(function() {
				oView.byId("survey_group_1").setVisible(true);
			}, 500);
			oView.byId("survey_group_2").setVisible(false);
			setTimeout(function() {
				oView.byId("survey_group_2").setVisible(true);
			}, 500);
			oView.byId("survey_group_3").setVisible(false);
			setTimeout(function() {
				oView.byId("survey_group_3").setVisible(true);
			}, 500);
		},
		
		validationScore: function(oEvent) {
			var value = parseInt(oEvent.getSource().getValue(), 10);
			if (isNaN(value) || value < 0 || value > 100) {
				oEvent.getSource().setValueState("Error");
				oEvent.getSource().setValueStateText(this.getTranslation("errorValueStateText"));
			} else {
				oEvent.getSource().setValueState("None");
				oEvent.getSource().setValueStateText("");
			}
		},
		
		onApproveButtonPress: function(oEvent){
			var controller = this;
			var dialog = new Dialog({
				title: controller.getTranslation("approveSupplierDialogTitle"),
				type: 'Message',
				content: new Text({
					text: controller.getTranslation("approveSupplierDialogMessage")
				}),
				beginButton: new Button({
					type: ButtonType.Accept,
					text: controller.getTranslation("approveSupplierDialogPositiveAction"),
					press: function() {
						var nextStatus = controller.getComponentModelProperty("Types", "/participationStatus/A2");
						controller.updateParticipation(dialog, nextStatus, null, controller.getTranslation("approveSupplierDialogError"), function(oData, response) {
							if( oData.Status === controller.getComponentModelProperty("Types", "/participationStatus/QC") && oData.Supplier.Lifnr !== "" ) {
								sap.m.MessageToast.show(controller.getTranslation("supplier_created_success", oData.Supplier.Lifnr), {
								    duration: 5000,
								    width: "30em",
								    animationDuration: 1000,
								    closeOnBrowserNavigation: false
								});
							} else {
								sap.m.MessageToast.show(controller.getTranslation("approveSupplierDialogSuccess"), {
								    duration: 5000,
								    width: "30em",
								    animationDuration: 1000,
								    closeOnBrowserNavigation: false
								});
							}		
							
							var oSplitApp = controller.getView().getParent().getParent();
							oSplitApp.setMode(sap.m.SplitAppMode.ShowHideMode);
							controller.navTo("surveyList");
						}, false);
					}
				}),
				endButton: new Button({
					text: controller.getTranslation("approveSupplierDialogNegativeAction"),
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

		onCompleteButtonPress: function(oEvent) {
			var controller = this;
			var currentStatus = controller.getView().getModel().getProperty("/Status");
			var nextStatus = null;
			var userId = controller.getView().getModel("user").getProperty("/Username");
			var isCommercialRef = userId === controller.getView().getModel().getProperty("/CommercialRefId");
			var isDoneByFater = controller.getView().getModel().getProperty("/DoneByFater");
			var surveyType = controller.getView().getModel().getProperty("/Type");
			if( isDoneByFater && isCommercialRef ) {
				if( surveyType === controller.getOwnerComponent().getModel("Types").getProperty("/participationType/PRE_QUALIFICATION") ) {
					nextStatus = controller.getComponentModelProperty("Types", "/participationStatus/QC");
				} else {
					var isCommercialMan = userId === controller.getView().getModel().getProperty("/CommercManagerId");
					if( isCommercialMan ) {
						nextStatus = controller.getComponentModelProperty("Types", "/participationStatus/C2");
					} else {
						nextStatus = controller.getComponentModelProperty("Types", "/participationStatus/C1");
					}
				}
			} else {
				if( currentStatus === controller.getComponentModelProperty("Types", "/participationStatus/C") || currentStatus === controller.getComponentModelProperty("Types", "/participationStatus/C1") ) {
					nextStatus = controller.getComponentModelProperty("Types", "/participationStatus/C1");
				} else if( currentStatus === controller.getComponentModelProperty("Types", "/participationStatus/A1") || currentStatus === controller.getComponentModelProperty("Types", "/participationStatus/C2")) {
					nextStatus = controller.getComponentModelProperty("Types", "/participationStatus/C2");
				} else if( currentStatus === controller.getComponentModelProperty("Types", "/participationStatus/A2") || currentStatus === controller.getComponentModelProperty("Types", "/participationStatus/C3") ) {
					nextStatus = controller.getComponentModelProperty("Types", "/participationStatus/C3");
				}
			}
			
			controller.updateParticipation(null, nextStatus, null, controller.getTranslation("completeDataSupplierDialogError"), function(oData, response) {
				controller.navTo("dataCompletion",{id:controller.__partecipationId}, true);
			});
		},

		onRejectButtonPress: function(oEvent) {
			var controller = this;
			var dialog = new Dialog({
				title: controller.getTranslation("rejectSupplierDialogTitle"),
				type: 'Message',
				content: [
					new Text({
						text: controller.getTranslation("rejectSupplierDialogMessage")
					}),
					new TextArea('rejectRequestBody', {
						growing: true,
						growingMaxLines: 7,
						liveChange: function(oEvent) {
							var enabled = sap.ui.getCore().byId("rejectRequestBody").getValue().length > 0;
							oEvent.getSource().getParent().getBeginButton().setEnabled(enabled);
						},
						width: '100%',
						placeholder: controller.getTranslation("rejectRequestSupplierDialogMessageRequired")
					})
				],
				beginButton: new Button({
					type: ButtonType.Accept,
					text: controller.getTranslation("rejectSupplierDialogPositiveAction"),
					press: function() {
						var sMessage = sap.ui.getCore().byId("rejectRequestBody").getValue();
						controller.getView().getModel().setProperty("/RejectNote", sMessage);
						controller.updateParticipation(dialog, controller.getComponentModelProperty("Types", "/participationStatus/R"), controller.getTranslation("rejectSupplierDialogSuccess"), controller.getTranslation("rejectSupplierDialogError"), function() {
							var oSplitApp = controller.getView().getParent().getParent();
							oSplitApp.setMode(sap.m.SplitAppMode.ShowHideMode);						
							controller.navTo("surveyList", {}, true);
						});
					}
				}),
				endButton: new Button({
					text: controller.getTranslation("rejectSupplierDialogNegativeAction"),
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

		handleUploadSupplierBusinessBankAttestationPress: function(oEvent) {
			var uploader = this.getView().byId("contact_business_bank_attestation");
			var valid = true;
			if( valid ) {
				var supplierId = this.getView().getModel().getProperty("/SupplierId");
				uploader.removeAllHeaderParameters();
				uploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				     name: "Accept", 
				     value: "application/json"
				}));
				uploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				     name: "x-requested-with", 
				     value: true
				}));
				uploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				     name: "slug", 
				     value: uploader.getValue() + "/" + supplierId
				}));
				this.getView().setBusy(true);
				uploader.upload();
			}
		},
		
		onUploadSupplierBusinessBankAttestationComplete: function(oEvent) {
			this.getView().setBusy(false);
			this.getView().getModel().setProperty("/Supplier/BankAttestation", JSON.parse(oEvent.getParameter("responseRaw")).d.FileName);
		},

		onUploadEmailClick: function(oEvent) {
			var uploader = this.getView().byId("supplier_doc_upload_email");
			
			var valid = true;
			if( valid ) {
				var supplierId = this.getView().getModel().getProperty("/SupplierId");
				uploader.removeAllHeaderParameters();
				uploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				     name: "Accept", 
				     value: "application/json"
				}));
				uploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				     name: "x-requested-with", 
				     value: true
				}));
				uploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				     name: "slug", 
				     value: uploader.getValue() + "/" + supplierId
				}));
				this.getView().setBusy(true);
				uploader.upload();
			}
		},
		
		onUploadEmailComplete: function(oEvent) {
			this.getView().setBusy(false);
			this.getView().getModel().setProperty("/Emailupload", JSON.parse(oEvent.getParameter("responseRaw")).d.FileName);
		},

		onUploadFormClick: function(oEvent) {
			var uploader = this.getView().byId("supplier_doc_upload_form");
			var valid = true;
			if( valid ) {
				var supplierId = this.getView().getModel().getProperty("/SupplierId");
				uploader.removeAllHeaderParameters();
				uploader.setUploadUrl( "/sap/opu/odata/sap/ZVIP_PROJECT_SRV/FileSet" );
				uploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				     name: "Accept", 
				     value: "application/json"
				}));
				uploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				     name: "x-requested-with", 
				     value: true
				}));
				uploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
				     name: "slug", 
				     value: uploader.getValue() + "/" + supplierId
				}));
				this.getView().setBusy(true);
				uploader.upload();
			}
		},
		
		onUploadFormComplete: function(oEvent) {
			this.getView().setBusy(false);
			this.getView().getModel().setProperty("/Formupload", JSON.parse(oEvent.getParameter("responseRaw")).d.FileName);
		},
		
		onTicketPress: function(oEvent) {
			var ticket = this.getView().getModel("tickets").getProperty(oEvent.getSource().getBindingContextPath());
			this.getRouter().navTo("ticketDetail",{
				participation_id: ticket.ParticipationId,
				ticket_id: ticket.TicketId
			});
		},
		
		fixIconTabBarFilter: function(oITF, invalidate) {
			var oView = this.getView(),
					oPage = oView.byId("detailPage");
			if( invalidate ) {
				oITF.invalidate();
				oITF.rerender();
			}
			for ( var i = 0 ; i < oITF.getContent().length ; i++ ) {
				oITF.getContent()[i].rerender();
			}
			oPage.rerender();
			oView.getModel().refresh();
			for ( var i = 0 ; i < oITF.getContent().length ; i++ ) {
				oITF.getContent()[i].rerender();
			}
		},
		
		fixIconTabBar: function() {
			this.fixIconTabBarFilter( this.getView().byId("survey_group_0") );
			this.fixIconTabBarFilter( this.getView().byId("survey_group_1") );
			this.fixIconTabBarFilter( this.getView().byId("survey_group_2") );
			this.fixIconTabBarFilter( this.getView().byId("survey_group_3") );
			this.fixIconTabBarFilter( this.getView().byId("survey_group_all") );
			this.fixUI();
		},
		
		iconTabBarItemSelected: function (oEvent){
			var e = this._i[oEvent.getParameter("selectedItem").getId()];
			//if (e === null || e === undefined) {
				if( oEvent.getParameters().selectedItem.getKey() === "6" ) {
					this.getView().byId("iconTabBar").setSelectedKey( "communicationTabFilter" );
					this.getView().byId("iconTabBar").setSelectedKey( "6" );
				}
				
				this._i[oEvent.getParameter("selectedItem").getId()] = 0;
				this.fixIconTabBarFilter(oEvent.getParameter("selectedItem"));
				this.getView().getModel().refresh();
				
				if( oEvent.getParameters().selectedItem.getKey() === "6" ) {
					this.getView().byId("iconTabBar").setSelectedKey( "communicationTabFilter" );
					this.getView().byId("iconTabBar").setSelectedKey( "6" );
				}
			//}
			
			var model = this.getView().getModel("TempModel"); 
			var title = oEvent.getParameters().selectedItem.getText();
			model.setProperty("/tabTitle", title);
		},
		
		__loadTickets: function() {
			var controller = this;
			var oView = this.getView();
			var partId = parseInt(this.getView().getModel().getProperty("/ParticipationId"), 10);
			
			var mParameters = {
				filters: [
					new sap.ui.model.Filter("ParticipationId", sap.ui.model.FilterOperator.EQ, partId)	
				],
				urlParameters: {
					"$expand": "Item"
				},
				success: function(oData) {
					var doneByFater = controller.getView().getModel().getProperty("/DoneByFater");
					var userRole = controller.getView().getModel("user").getProperty("/Role");
					var userId = controller.getView().getModel("user").getProperty("/Username");
					var isCommercialRef = userId === controller.getView().getModel().getProperty("/CommercialRefId");
					var isCommercialMan = userId === controller.getView().getModel().getProperty("/CommercManagerId") || (
						controller.getView().getModel().getProperty("/CommercialRefId") === controller.getView().getModel().getProperty("/CommercManagerId") && 
						doneByFater
					);
					var isSupplier = userRole === controller.getOwnerComponent().getModel("Types").getProperty("/userRoleTypes/SUPPLIER") || ( isCommercialRef && doneByFater );
					var isAnagMan = userId === controller.getView().getModel().getProperty("/RegistryManagerId");
					var ticketVisible = false;
					var hasInternal = false;
					var hasExternal = false;
					for (var ti in oData.results) {
						var t = oData.results[ti];
						if( t.Internal ) {
							hasInternal = true;
						} else {
							hasExternal = true;
						}
						if( !t.Internal && (isSupplier || isCommercialRef || isAnagMan) ) {
							ticketVisible = true;
						} else if ( t.Internal && (isCommercialMan || isCommercialRef || isAnagMan) ) {
							ticketVisible = true;
						}
					}
					var oTickets = oView.getModel();
					if (!oView.getModel("tickets")) {
						oTickets = new JSONModel();
					}
					oData.hasInternal = hasInternal;
					oData.hasExternal = hasExternal;
					oTickets.setData(oData);
					oView.setModel(oTickets, "tickets");
					oView.byId("communicationTabFilter").setVisible(ticketVisible);
					
					var surveyStatus = controller.getView().getModel().getProperty("/Status");
					if( (isSupplier && (surveyStatus === controller.getComponentModelProperty("Types", "/participationStatus/ES") || surveyStatus === controller.getComponentModelProperty("Types", "/participationStatus/EA"))) 
						|| (isCommercialRef && surveyStatus === controller.getComponentModelProperty("Types", "/participationStatus/ER")) ) {
						oView.byId("iconTabBar").setSelectedKey( "communicationTabFilter" );
					}
					
				}.bind(this),
				error: function(oError) {
				}.bind(this)
			};

			this.getView().getModel("oDataModel").read("/TicketHSet", mParameters);
		},

		onUpdateFinished: function(oEvent) {
			var controller = this;
			var surveyStatus = controller.getView().getModel().getProperty("/Status");
			var userRole = controller.getView().getModel("user").getProperty("/Role");
			var userId = controller.getView().getModel("user").getProperty("/Username");
			var isSupplier = userRole === controller.getOwnerComponent().getModel("Types").getProperty("/userRoleTypes/SUPPLIER") ||
							(userId === controller.getView().getModel().getProperty("/CommercialRefId") &&
							controller.getView().getModel().getProperty("/DoneByFater") === true
							);
			var disableAll = userRole === controller.getOwnerComponent().getModel("Types").getProperty("/userRoleTypes/SUPPLIER") && surveyStatus === this.getComponentModelProperty("Types", "/participationStatus/R");
			this.__renderSurvey(oEvent, isSupplier && !disableAll);
			//this.fixUI(oEvent);
		},
		
		onUpdateFinishedReadOnly: function(oEvent) {
			this.__renderSurvey(oEvent, false);
			//this.fixUI(oEvent);
		},
		
		fixUI: function(oEvent) {
			if (oEvent.getSource().getParent().getId().indexOf("group_0") !== -1){
				var oITB = this.getView().byId("iconTabBar");
				oITB.fireSelect({
					"selectedItem": oEvent.getSource().getParent()
				});
			}
		},
		
		__renderSurvey: function(oEvent, enabled) {
			var e = this._i[oEvent.getSource().getId()];
			if (e === null || e === undefined) {
				this._i[oEvent.getSource().getId()] = true;
				var items = oEvent.getSource().getItems();
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					var customControl = this.getCustomControl(item.getBindingContext(), enabled);
					item.getContent()[0].addContent(customControl);
				}
				
				// this.tryUIFixTabSelect();
				// this.tryUIFixTabShowHide();
				// this.fixIconTabBar();
			}
		},

		getCustomControl: function(bindingContext, enabled) {
			var conditionCanEdit = "{= ${user>/Username} === ${SupplierRefId} || ( ${user>/Username} === ${CommercialRefId} &amp;&amp; ${DoneByFater} === true ) }";
			var type = bindingContext.getObject().Type;
			var control = null;
			if (type === 'TEXT') {
				control = new TETextQuestion({
					mandatory: "{Mandatory}",
					enabled: enabled !== null ? enabled : conditionCanEdit
				});
			} else if (type === 'TEXT_AREA') {
				control = new TETextAreaQuestion({
					mandatory: "{Mandatory}",
					enabled: enabled !== null ? enabled : conditionCanEdit
				});
			} else if (type === 'TEXT_MULTI_CHOICE' || type === 'SINGLE_CHECKBOX') {
				control = new TEChoiceQuestion({
					mandatory: "{Mandatory}",
					enabled: enabled !== null ? enabled : conditionCanEdit
				});
			} else if (type === 'TEXT_SINGLE_CHOICE') {
				control = new TERadioQuestion({
					mandatory: "{Mandatory}",
					enabled: enabled !== null ? enabled : conditionCanEdit
				});
			} else if (type === 'FILE') {
				control = new TEFileQuestion({
					mandatory: "{Mandatory}",
					enabled: enabled !== null ? enabled : conditionCanEdit
				});
			} else if (type === 'YEAR_REVENUE_3') {
				control = new TERevenueYear3Question({
					mandatory: "{Mandatory}",
					enabled: enabled !== null ? enabled : conditionCanEdit
				});
			} else if (type === 'YEAR_REVENUE') {
				control = new TERevenueYearQuestion({
					mandatory: "{Mandatory}",
					enabled: enabled !== null ? enabled : conditionCanEdit
				});
			} else if (type === 'DATEPICKER') {
				control = new TEDateQuestion({
					mandatory: "{Mandatory}",
					enabled: enabled !== null ? enabled : conditionCanEdit
				});
			} else if (type === 'MONEY') {
				control = new TEMoneyQuestion({
					mandatory: "{Mandatory}",
					enabled: enabled !== null ? enabled : conditionCanEdit
				});
			} else if (type === 'FILE_CERTIFICATION') {
				control = new TEFileComplexQuestion({
					mandatory: "{Mandatory}",
					enabled: enabled !== null ? enabled : conditionCanEdit
				});
			}

			return control;
		},

		/*******************************************************
		 * DIALOGS
		 *******************************************************/

		onSaveDraftSupplier: function(oEvent) {
			var controller = this;
			var dialog = new Dialog({
				title: controller.getTranslation("saveDraftSupplierDialogTitle"),
				type: 'Message',
				content: new Text({
					text: controller.getTranslation("saveDraftSupplierDialogMessage")
				}),
				beginButton: new Button({
					type: ButtonType.Accept,
					text: controller.getTranslation("saveDraftSupplierDialogPositiveAction"),
					press: function() {
						controller.updateParticipation(dialog, controller.getComponentModelProperty("Types", "/participationStatus/DQ"), controller.getTranslation("saveDraftSupplierDialogSuccess"), controller.getTranslation("saveDraftSupplierDialogError"), function() {
							var oSplitApp = controller.getView().getParent().getParent();
							oSplitApp.setMode(sap.m.SplitAppMode.ShowHideMode);
							controller.navTo("surveyList", {}, true);
						});
					}
				}),
				endButton: new Button({
					text: controller.getTranslation("saveDraftSupplierDialogNegativeAction"),
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

		updateParticipation: function(dialog, newStatus, successMessage, errorMessage, successCallback) {
			// instantiate dialog
			var busyDialog = sap.ui.xmlfragment("org.fater.app.view.fragment.dialogs.BusyDialog", this);
			this.getView().addDependent(busyDialog);
 
			// open busyDialog
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), busyDialog);
			busyDialog.open();
			
			var object = this.getView().getModel().getProperty("/");
			
			if( newStatus ) {
				object.Status = newStatus;
				object.ModifiedT = new Date();
			}
			
			if ( newStatus === this.getComponentModelProperty("Types", "/participationStatus/ES") || newStatus === this.getComponentModelProperty("Types", "/participationStatus/EA") ) {
				var newExpiredate = new Date(object.ExpireT);
    			newExpiredate.setDate(newExpiredate.getDate() + 45);
				object.ExpireT = object.ExpireT;
			}
			if ( newStatus !== this.getComponentModelProperty("Types", "/participationStatus/DQ") ) {
				object.SentT = new Date();
			}
			
			if( newStatus === this.getComponentModelProperty("Types", "/participationStatus/QC") ) {
				if( object.StatusChange === this.getComponentModelProperty("Types", "/participationStatusEdit/RC") ) {
					object.StatusChange = "";
				}
			}
			
			
			var controller = this;
			jQuery.sap.delayedCall(500, this, function () {
				controller.getView().getModel("oDataModel").create("/ParticipationSet", object, null, function(oData, response) {
						busyDialog.close();
						if( successMessage ) {
							sap.m.MessageToast.show(successMessage, {
							    duration: 5000,
							    width: "30em",
							    animationDuration: 1000,
							    closeOnBrowserNavigation: false
							});
						}
						if( successCallback ) {
							successCallback(oData, response);
						}
					},
					function(oError) {
						busyDialog.close();
						if( errorMessage ) {
							sap.m.MessageToast.show(errorMessage);
						}
						
						if( oError && oError.response ) {
							var jsonError = JSON.parse(oError.response.body);
							var message = "";
							
							if( jsonError.error.message.value ) {
								message = jsonError.error.message.value + "\n\n";
							}
							
							for (var i = 0; i < jsonError.error.innererror.errordetails.length; i++){
								var error = jsonError.error.innererror.errordetails[i];
								if( error.severity === "error" && error.message !== "" ) {
									message += error.message + "\n";
								}
							}
							var bCompact = !!controller.getView().$().closest(".sapUiSizeCompact").length;
							MessageBox.error(
								message,
								{
									styleClass: bCompact ? "sapUiSizeCompact" : ""
								}
							);
						}
				});
			});
				
				
			if( dialog ) {
				dialog.close();
			}
		},
		
		__checkRequired: function(field, forceVerificartion) {
			var isValid = true;
			
			
			if( (field.required || field.minLength > 0 || (field.options !== null && field.options.validation)) && (!field.skipVerification || forceVerificartion) ) {
				var element = this.getView().byId(field.name);
				var isEmpty = false;
				
				if( field.required ) {
					if( sap.ui.unified.FileUploader.getMetadata()._sClassName === element.getMetadata()._sClassName ) {
						var href = this.getView().byId(field.name + "_link").getHref();
						isEmpty = href === null || href.length === 0;
					} else if( element.getSelectedItem ) {
						isEmpty = !element.getSelectedItem() || element.getSelectedItem().getKey() === null || element.getSelectedItem().getKey().length === 0;
					} else if ( element.getSelected ) {
						isEmpty = false;
					} else {
						isEmpty = element.getValue() === null || element.getValue().length === 0;
					}
					if( isEmpty ) {
						isValid = false;
						if( element.setValueState ) {
							element.setValueState("Error");
						}
						if( element.setValueStateText ) {
							element.setValueStateText( this.getTranslation("field_required_error") );
						}
					}
				}
				
				if( isValid && field.minLength > 0 && element.getValue().length > 0 ) {
					if( element.getValue().length < field.minLength ) {
						isValid = false;
						if( element.setValueState ) {
							element.setValueState("Error");
						}
						if( element.setValueStateText ) {
							element.setValueStateText( this.getTranslation("field_min_len_error", field.minLength) );
						}
					}
				}
				
				if( isValid && element.getValue && element.getValue().length > 0 && field.options !== null && field.options.validation  ) {
					if( field.options.validation.email ) {
						var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
						isValid = re.test(element.getValue());
						if( !isValid ) {
							if( element.setValueState ) {
								element.setValueState("Error");
							}
							if( element.setValueStateText ) {
								element.setValueStateText( this.getTranslation("field_email_error") );
							}
						}
					}
				}
			
				if( isValid ) {
					if( element.setValueState ) {
						element.setValueState("Success");
					}
					if( element.setValueStateText ) {
						element.setValueStateText( null );
					}
				}
			}
			return isValid;
		},
		
		resetValidation: function() {
			this.tabError = {
				groups: {
					0: 0,
					1: 0,
					2: 0,
					3: 0
				},
				fields: {}
			};
		},
		
		processValidation: function() {
			var controller = this;
			for (var key in controller.tabError.groups) {
			  if (controller.tabError.groups.hasOwnProperty(key)) {
				var errors = controller.tabError.groups[key];
				if( errors === 0 ) {
					controller.getView().byId("survey_group_" + key ).setCount(null);
					controller.getView().byId("survey_group_" + key ).setIconColor("Default");
				} else {
					controller.getView().byId("survey_group_" + key ).setCount(errors);
					controller.getView().byId("survey_group_" + key ).setIconColor("Critical");
				}
			  }
			}
			//this.fixIconTabBar();
		},
		
		createDialog: function(dialog, path) {
			if( !dialog ) {
				dialog = sap.ui.xmlfragment(path, this);
				this.getView().addDependent(dialog);
			}
			return dialog;
		},

		onCancelPress: function() {
			this._submitDialog.close();
			// this._submitDialog.destroy();
		},
		
		_validateForm: function() {
			this._firstTimeValidate = false;
			var isAllValid = true;
			var controller = this;
			this.resetValidation();
					
			//First check if all fields has been correctly validated
			for (var key in controller.__fields) {
			  if (controller.__fields.hasOwnProperty(key)) {
			  	var field = controller.__fields[key];
				var valid = controller.__checkRequired(controller.__fields[key], false);
				if( controller.tabError.fields[field["name"]] === undefined || valid !== controller.tabError.fields[field["name"]] ) {
					if( !valid ) {
						controller.tabError.groups[field["group"]]++;
					} else if( valid && controller.tabError.fields[field["name"]] !== undefined ) {
						controller.tabError.groups[field["group"]]--;
					}
				}
				controller.tabError.fields[field["name"]] = valid;
				isAllValid = isAllValid && valid;
			  }
			}
			
			var element = controller.getView().byId(controller.__fields["communication_preferred"].name);
			if( element.getSelectedItem() ) {
				var selectedKey = element.getSelectedItem().getKey();
				if( selectedKey === "FAX" ) {
					var valid = controller.__checkRequired(controller.__fields["fax"], true);
					if( controller.tabError.fields[controller.__fields["fax"]["name"]] === undefined || valid !== controller.tabError.fields[controller.__fields["fax"]["name"]] ) {
						if( !valid ) {
							controller.tabError.groups[controller.__fields["fax"]["group"]]++;
						} else if( valid && controller.tabError.fields[controller.__fields["fax"]["name"]] !== undefined ) {
							controller.tabError.groups[controller.__fields["fax"]["group"]]--;
						}
					}
					controller.tabError.fields[controller.__fields["fax"]["name"]] = valid;
						
					var otherElem = controller.getView().byId(controller.__fields["email"].name);
					otherElem.setValueState("None");
					otherElem.setValueStateText(null);
					isAllValid = isAllValid && valid;
				} else if( selectedKey === "INT" ) {
					var valid = controller.__checkRequired(controller.__fields["email"], true);
					if( controller.tabError.fields[controller.__fields["email"]["name"]] === undefined || valid !== controller.tabError.fields[controller.__fields["email"]["name"]] ) {
						if( !valid ) {
							controller.tabError.groups[controller.__fields["email"]["group"]]++;
						} else if( valid && controller.tabError.fields[controller.__fields["email"]["name"]] !== undefined ) {
							controller.tabError.groups[controller.__fields["email"]["group"]]--;
						}
					}
					controller.tabError.fields[controller.__fields["email"]["name"]] = valid;
					var otherElem = controller.getView().byId(controller.__fields["fax"].name);
					otherElem.setValueState("None");
					otherElem.setValueStateText(null);
					isAllValid = isAllValid && valid;
				}
			}
			controller.processValidation();
			
			return isAllValid;
		},

		onSubmitConfirmPress: function() {
			if( this._submitDialog ) {
				this._submitDialog.close();
			}
				
			//TUTTO VALIDO
			var controller = this;
			var currentStatus = controller.getView().getModel().getProperty("/Status");
			var nextStatus = null;
			
			if( currentStatus === controller.getComponentModelProperty("Types", "/participationStatus/QC") ) {
				nextStatus = controller.getComponentModelProperty("Types", "/participationStatus/QC");
			} else if( currentStatus === controller.getComponentModelProperty("Types", "/participationStatus/EA") ) {
				nextStatus = controller.getComponentModelProperty("Types", "/participationStatus/A2");
			} else {
				nextStatus = controller.getComponentModelProperty("Types", "/participationStatus/C");	
			}
			
			controller.updateParticipation(null, nextStatus, controller.getTranslation("submitSupplierDialogSuccess"), controller.getTranslation("submitSupplierDialogError"), function() {
				var oSplitApp = controller.getView().getParent().getParent();
				oSplitApp.setMode(sap.m.SplitAppMode.ShowHideMode);
				controller.navTo("surveyList", {}, true);
			});
		},
		
		onPrivacySelected: function(oEvent) {
			var sourceId = oEvent.getSource().getId();
			this.getView().getModel().setProperty("/Privacyaccepted", sourceId === "privacy_accepted");
		},
		
		onPaymentSelected: function(oEvent) {
			var sourceId = oEvent.getSource().getId();
			this.getView().getModel().setProperty("/Acceptedpaymentcondition", sourceId === "payment_accepted");
		},

		onSubmitButtonSupplier: function(oEvent, doneByFater) {
			var controller = this;
			this.__isFormValid = this._validateForm();
			
			var g = controller.getView().getModel().getProperty(controller.getView().getBindingContext().getPath()).Survey.GroupS;
			controller.__total_q_count = g[0].QuestionS.length + g[1].QuestionS.length + g[2].QuestionS.length +
				g[3].QuestionS.length;
			controller.__total_q_result_count = 0;
			controller.__survey_validated = true;
			if( controller.__total_q_count === 0 ) {
				this.__afterValidated(this.__isFormValid);
			} else {
				setTimeout(function() {
					sap.ui.getCore().getEventBus().publish("validate", "all", {
						validate_all_survey: true
					});
				}, 100);
			}
		},

		onRefreshValidityCheck: function(channel, event, data) {
			if( !this._firstTimeValidate ) {
				this.__isFormValid = this._validateForm();
				this.processValidation();
			}
		},

		onValidateResult: function(channel, event, data) {
			this.__total_q_result_count++;
			this.__survey_validated = this.__survey_validated && data.result.valid;
			
			var valid = data.result.valid;
			if( this.tabError.fields[data.id] === undefined || valid !== this.tabError.fields[data.id] ) {
				if( !valid ) {
					this.tabError.groups[data.group]++;
				} else if( valid && this.tabError.fields[data.id] !== undefined ) {
					this.tabError.groups[data.group]--;
				}
			}
			this.tabError.fields[data.id] = valid;
			if( !data.validate_all_survey ) {
				this.processValidation();	
			}
			if (this.__total_q_result_count === this.__total_q_count) {
				this.__afterValidated(this.__survey_validated && this.__isFormValid);
			}
		},
		
		__afterValidated: function(isValid) {
			if (isValid) {
				//se siamo DoneByFater
				var isDoneByFater = this.getView().getModel().getProperty("/DoneByFater") === true;
				if( isDoneByFater ) {
					this.onCompleteButtonPress(null);
				} else {
					var currentStatus = this.getView().getModel().getProperty("/Status");
					if( currentStatus === this.getComponentModelProperty("Types", "/participationStatus/DQ") || currentStatus === this.getComponentModelProperty("Types", "/participationStatus/I") ) {
						if (!this._submitDialog) {
							this._submitDialog = this.createDialog(this._submitDialog, "org.fater.app.view.fragment.dialogs.SubmitConfirmDialog");
						}
						this._submitDialog.open();
					} else {
						this.onSubmitConfirmPress();
					}
				}
			} else {
				this.processValidation();
				sap.m.MessageToast.show(this.getTranslation("survey_error_text"));
			}
		},

		onExplanationRequestButtonPress: function(oEvent){
			
			var controller = this;
			var dialog = new Dialog({
				title: controller.getTranslation("explanationRequestSupplierDialogTitle"),
				type: 'Message',
				content: [
					new Text({
						text: controller.getTranslation("explanationRequestSupplierDialogMessage")
					}),
					new Input('explanationRequestTitle', {
						liveChange: function(oEvent) {
							var enabled = sap.ui.getCore().byId("explanationRequestBody").getValue().length > 0 && sap.ui.getCore().byId("explanationRequestTitle").getValue().length > 0;
							oEvent.getSource().getParent().getBeginButton().setEnabled(enabled);
						},
						width: '100%',
						placeholder: controller.getTranslation("explanationRequestSupplierDialogTitleRequired")
					}),
					new TextArea('explanationRequestBody', {
						growing: true,
						growingMaxLines: 7,
						liveChange: function(oEvent) {
							var enabled = sap.ui.getCore().byId("explanationRequestBody").getValue().length > 0 && sap.ui.getCore().byId("explanationRequestTitle").getValue().length > 0;
							oEvent.getSource().getParent().getBeginButton().setEnabled(enabled);
						},
						width: '100%',
						placeholder: controller.getTranslation("explanationRequestSupplierDialogMessageRequired")
					})
				],
				beginButton: new Button({
					type: ButtonType.Accept,
					enabled: false,
					text: controller.getTranslation("explanationRequestSupplierDialogPositiveAction"),
					press: function() {
						var nextStatus = null;
						var userRole = controller.getView().getModel("user").getProperty("/Role");
						var id = controller.getView().getModel("user").getProperty("/Username");

						if( userRole === controller.getOwnerComponent().getModel("Types").getProperty("/userRoleTypes/COMMERCIAL_REFERENCE") ) {
							nextStatus = controller.getComponentModelProperty("Types", "/participationStatus/ES");
						} else if( userRole === controller.getOwnerComponent().getModel("Types").getProperty("/userRoleTypes/COMMERCIAL_MANAGER") ) {
							if( controller.getView().getModel().getProperty("/DoneByFater") === true && id === controller.getView().getModel().getProperty("/CommercialRefId") ) {
								nextStatus = controller.getComponentModelProperty("Types", "/participationStatus/ES");
							} else {
								nextStatus = controller.getComponentModelProperty("Types", "/participationStatus/ER");
							}
						} else if( userRole === controller.getOwnerComponent().getModel("Types").getProperty("/userRoleTypes/ANAGRAPHIC_MANAGER") ) {
							nextStatus = controller.getComponentModelProperty("Types", "/participationStatus/EA");
						}

						var isInternal = nextStatus === controller.getComponentModelProperty("Types", "/participationStatus/ER");

						var sTitle = sap.ui.getCore().byId('explanationRequestTitle').getValue();
						var sMessage = sap.ui.getCore().byId('explanationRequestBody').getValue();
						
						var oTicket = {
							ParticipationId: controller.getView().getModel().getProperty("/ParticipationId"),
							Title: sTitle,
							Internal: isInternal,
							Item: [
								{
									ParticipationId: controller.getView().getModel().getProperty("/ParticipationId"),
									Message: sMessage,
									Name: controller.getView().getModel("user").getProperty("/Address/Firstname") + " " + controller.getView().getModel("user").getProperty("/Address/Lastname")
								}	
							]
						};
						
						controller.getView().getModel("oDataModel").create("/TicketHSet", oTicket, null, function() {
							controller.updateParticipation(dialog, nextStatus, controller.getTranslation("explanationRequestSupplierDialogCreatedSuccess"), controller.getTranslation("explanationRequestSupplierDialogCreatedError"), function() {
								var oSplitApp = controller.getView().getParent().getParent();
								oSplitApp.setMode(sap.m.SplitAppMode.ShowHideMode);
								controller.navTo("surveyList", {}, true);
							});
						},
						function() {
							sap.m.MessageToast.show( controller.getTranslation("explanationRequestSupplierDialogCreatedError") );
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

		__submitButtonSupplier: function(oEvent, dialog) {
			sap.m.MessageToast.show("Questionario inviato con successo!");
			dialog.close();
		},

		onCountryChange: function(oEvent) {
			var selectedKey = oEvent.getParameter("selectedItem").getKey();
			this._updateLocalitySelectOptions(selectedKey);
		},
		
		_updateLocalitySelectOptions: function(selectedCountry) {
			if( !selectedCountry ) {
				return;
			}
			
			var localityElem = this.getView().byId("locality");
			var oTemplate = new sap.ui.core.Item({  
				key : "{oDataModel>Key}",  
				text : "{oDataModel>Description}"  
			});
			
			this.getView().byId("withholding").bindItems({
	    		path: "oDataModel>/CountrySet('"+selectedCountry+"')/Withholdingtaxcode",
	    		sorter: new sap.ui.model.Sorter("Description", true),
	    		template: oTemplate
	    	});
			
			this.getView().byId("province").bindItems({
	    		path: "oDataModel>/CountrySet('"+selectedCountry+"')/Regio",
	    		sorter: new sap.ui.model.Sorter("Description", true),
	    		template: oTemplate
	    	});
			
			this.getView().byId("withholding_readonly").bindItems({
	    		path: "oDataModel>/CountrySet('"+selectedCountry+"')/Withholdingtaxcode",
	    		sorter: new sap.ui.model.Sorter("Description", true),
	    		template: oTemplate
	    	});
			
			this.getView().byId("province_readonly").bindItems({
	    		path: "oDataModel>/CountrySet('"+selectedCountry+"')/Regio",
	    		sorter: new sap.ui.model.Sorter("Description", true),
	    		template: oTemplate
	    	});
	    	
	    	var lang = sap.ui.getCore().getConfiguration().getLocale().getLanguage().toUpperCase();
			if( lang !== "IT" ) {
				lang = "EN";
			}
			if( this.getView().byId("gender_readonly") ) {
				this.getView().byId("gender_readonly").bindItems({
		    		path: "ControlValues>/Gender_" + lang,
		    		sorter: new sap.ui.model.Sorter("Description", true),
		    		template: new sap.ui.core.Item({  
						key : "{ControlValues>Key}",  
						text : "{ControlValues>Description}"  
					})
		    	});
			}
			this.getView().byId("gender").bindItems({
	    		path: "ControlValues>/Gender_" + lang,
	    		sorter: new sap.ui.model.Sorter("Description", true),
	    		template: new sap.ui.core.Item({  
					key : "{ControlValues>Key}",  
					text : "{ControlValues>Description}"  
				})
	    	});
		},
		
		onPrintPdfButtonPress: function(oEvent) {
			var controller = this;
			var itb = this.getView().byId("iconTabBar");
			if( itb.getSelectedKey() !== "6" ) {
				itb.setSelectedKey("6");
				setTimeout(function() {
					controller.__printPdf(oEvent);
				}, 1000);
			} else {
				controller.__printPdf(oEvent);
			}
		},
		
		__printPdf: function(oEvent) {
			var model = this.getView().getModel("TempModel"); 
			var	title = model.getProperty("/tabTitle");
			var html = "<!DOCTYPE HTML><html><head>";
			html += '<title>' + title + '</title>';
			html += '<link rel="stylesheet" type="text/css" href="../resources/sap/ui/core/themes/sap_bluecrystal/library.css">';
			html += '<link rel="stylesheet" type="text/css" href="../resources/sap/m/themes/sap_bluecrystal/library.css">';
			html += '<link rel="stylesheet" type="text/css" href="../resources/sap/ui/layout/themes/sap_bluecrystal/library.css">';
			html += '<link rel="stylesheet" type="text/css" href="../resources/sap/ui/unified/themes/sap_bluecrystal/library.css">';
			html += '<link rel="stylesheet" type="text/css" href="../resources/sap/ui/commons/themes/sap_bluecrystal/library.css">';
			html += '<link rel="stylesheet" type="text/css" href="css/style.css"></head><body class="sapUiBody" id="content">';
			var id = this.getView().byId("iconTabBar").getId();
			html += $("#" + id + "-content").html();
		//	html += $("#__component0---detail--iconTabBar-content").html();
			html += "</body></html>";
			
	        var newWindow = window.open ("","","location=1,status=1,scrollbars=1");
			newWindow.document.body.innerHTML = '';
        	newWindow.document.write(html);
        	newWindow.document.close();
        	var printAndClose = function () {
				if (newWindow.document.readyState === "complete") {
					clearInterval(interval);
					newWindow.print();
					newWindow.close();
				}
    		};
    		var interval = setInterval(printAndClose, 200);
        	
        	/*var doc = new jsPDF();
			// We'll make our own renderer to skip this editor
			var specialElementHandlers = {
				'#editor': function(element, renderer){
					return true;
				}
			};
			// All units are in the set measurement for the document
			// This can be changed to "pt" (points), "mm" (Default), "cm", "in"
			doc.fromHTML(html, 15, 15, {
				'width': 170, 
				'elementHandlers': specialElementHandlers
			});
			doc.save("test.pdf");*/
		}

	});

});