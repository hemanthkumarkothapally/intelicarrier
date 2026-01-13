sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment"
], function (Controller, MessageToast, MessageBox, JSONModel, Filter, FilterOperator,Fragment) {
    "use strict";

    return Controller.extend("intellicarrier.controller.Home", {
        
        onInit: function () {
            
            // Initialize view model with fleet and shipment data
            var oViewModel = new JSONModel({
                selectedKey: "dashboard",
                isExpanded: true,
                recentShipments: this._getMockRecentShipments(),
                rates: [],
                activeShipments: this._getMockActiveShipments(),
                
                // NEW: Fleet Management Data
                availableFleet: this._getMockFleetData(),
                bookedShipments: this._getMockBookedShipments(),
                selectedVehicle: null
            });
            this.getView().setModel(oViewModel);
            
            // Set initial view visibility
            this._showView("dashboard");
        },

        // Global fragment load function
        loadFragment:function(sPath){
            let oView = this.getView();
            return Fragment.load({
                id: oView.getId(),
                name: sPath,
                controller: this
            }).then(function (oDialog) {
                oView.addDependent(oDialog);
                return oDialog;
            });
        },
        
        // Navigation handlers
        onMenuButtonPress: function () {
            var oSideNavigation = this.byId("sideNavigation");
            var bExpanded = oSideNavigation.getExpanded();
            oSideNavigation.setExpanded(!bExpanded);
            
        },
        
        onItemSelect: function (oEvent) {
            this.onClearRateForm();
            this.onClearShipmentForm();
            var sKey = oEvent.getParameter("item").getKey();
            this._showView(sKey);
            var sKey = "fleetoverview";
            this._showShipmentTab(sKey);
            this.getView().byId("shipmentTabBar").setSelectedKey("fleetoverview");

            // Update model
            var oModel = this.getView().getModel();
            oModel.setProperty("/selectedKey", sKey);
        },
        
        _showView: function (sKey) {
            // Hide all views
            this.byId("dashboardView").setVisible(false);
            this.byId("rateShoppingView").setVisible(false);
            this.byId("shipmentExecutionView").setVisible(false);
            this.byId("trackingView").setVisible(false);
            
            // Show selected view
            switch (sKey) {
                case "dashboard":
                    this.byId("dashboardView").setVisible(true);
                    break;
                case "rateshopping":
                    this.byId("rateShoppingView").setVisible(true);
                    break;
                case "shipmentexecution":
                    this.byId("shipmentExecutionView").setVisible(true);
                    break;
                case "tracking":
                    this.byId("trackingView").setVisible(true);
                    break;
            }
        },
        
        // Dashboard handlers
        onNotificationPress: function () {
            MessageToast.show("You have 3 new notifications");
        },

        //--Dashboard formater status
        formatStateStatus:function(sStatus){
            if(sStatus==="Delivered"){
                return "Success";
            }
            else if(sStatus==="In Transit"){
                return "Warning";
            }
            else{
                return "Error";
            }
        },
        
        //-- dashboard search.
        onLiveSearch:function(oEvent){
            let sQuery=oEvent.getParameter("newValue");
            let oTableSearchState;
            	if (sQuery && sQuery.length > 0) {
        oTableSearchState = new Filter([
            new Filter("ShipmentID", FilterOperator.Contains, sQuery),
            new Filter("Customer", FilterOperator.Contains, sQuery),
            new Filter("Destination", FilterOperator.Contains, sQuery),
            new Filter("Status", FilterOperator.Contains, sQuery)
        ], false);
    }

			this.getView().byId("recentShipmentsTable").getBinding("items").filter(oTableSearchState);
        },

        
        // Smart Rate Shopping handlers
        onCalculateRates: function () {
            var oOrigin = this.byId("originInput").getValue();
            var oDestination = this.byId("destinationInput").getValue();
            var oWeight = this.byId("weightInput").getValue();
            
            if (!oOrigin || !oDestination || !oWeight) {
                MessageBox.error("Please fill in all required fields");
                return;
            }
            
            // Show loading
            this.byId("rateResultsPanel").setBusy(true);
            this.byId("rateResultsPanel").setVisible(true);
            
            // Simulate API call
            setTimeout(function () {
                // Mock rate data
                var aMockRates = [
                    {
                        service: "Same Day Delivery",
                        description: "Delivered by end of day",
                        transitTime: "Today by 9 PM",
                        baseRate: "85.00",
                        fuelSurcharge: "7.50",
                        totalCost: "92.50"
                    },
                    {
                        service: "Overnight Express",
                        description: "Next business day delivery",
                        transitTime: "1 Business Day",
                        baseRate: "45.00",
                        fuelSurcharge: "4.20",
                        totalCost: "49.20"
                    },
                    {
                        service: "Express Service",
                        description: "Guaranteed 2-day delivery",
                        transitTime: "2 Business Days",
                        baseRate: "32.00",
                        fuelSurcharge: "3.00",
                        totalCost: "35.00"
                    },
                    {
                        service: "Standard Ground",
                        description: "Economy service",
                        transitTime: "3-5 Business Days",
                        baseRate: "18.50",
                        fuelSurcharge: "1.80",
                        totalCost: "20.30"
                    }
                ];
                
                // Update table
                var oTable = this.byId("ratesTable");
                var oModel = new JSONModel({ rates: aMockRates });
                oTable.setModel(oModel);
                oTable.bindItems({
                    path: "/rates",
                    template: new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.ObjectIdentifier({
                                title: "{service}",
                                text: "{description}"
                            }),
                            new sap.m.Text({ text: "{transitTime}" }),
                            new sap.m.ObjectNumber({ 
                                number: "{baseRate}", 
                                unit: "USD" 
                            }),
                            new sap.m.ObjectNumber({ 
                                number: "{fuelSurcharge}", 
                                unit: "USD" 
                            }),
                            new sap.m.ObjectNumber({ 
                                number: "{totalCost}", 
                                unit: "USD",
                                state: "Warning"
                            }),
                            new sap.m.Button({
                                text: "Select",
                                type: "Accept",
                                press: this.onSelectRate.bind(this)
                            })
                        ]
                    })
                });
                
                this.byId("rateResultsPanel").setBusy(false);
                MessageToast.show("Rates calculated successfully");
            }.bind(this), 1500);
        },
        
        onSelectRate: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            var oRate = oContext.getObject();
            
            MessageBox.confirm(
                "Do you want to proceed with " + oRate.service + " for $" + oRate.totalCost + "?",
                {
                    title: "Confirm Rate Selection",
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            MessageToast.show("Rate selected. Redirecting to shipment execution...");
                            // Navigate to shipment execution
                            this._showView("shipmentexecution");
                            this.byId("sideNavigation").setSelectedKey("shipmentexecution");
                        }
                    }.bind(this)
                }
            );
        },
        
        onClearRateForm: function () {
            this.byId("originInput").setValue("");
            this.byId("destinationInput").setValue("");
            this.byId("weightInput").setValue("");
            this.byId("lengthInput").setValue("");
            this.byId("widthInput").setValue("");
            this.byId("heightInput").setValue("");
            this.byId("serviceLevelSelect").setSelectedKey("all");
            this.byId("rateResultsPanel").setVisible(false);
        },
        
        onOriginValueHelp: function (oEvent) {
            this.selectedInputId=oEvent.getParameter("id");

            if (!this._ItemsDialog) {
                this._ItemsDialog = this.loadFragment("intellicarrier.view.LocationValueHelpDialog");
            }
            this._ItemsDialog.then(function (oDialog) {
                oDialog.open();
            });
            this.byId("selectOriginDialog").getBinding("items").filter([]);

        },
        onValueHelpSearch:function(oEvent){
            var sQuery = oEvent.getParameter("value");
            var oTable = this.byId("selectOriginDialog");
            var oBinding = oTable.getBinding("items");
            
            if (sQuery && sQuery.length > 0) {
                var aFilters = new Filter("subdistrictNameEn", FilterOperator.Contains, sQuery)
                oBinding.filter(aFilters);
            } else {
                oBinding.filter([]);
            }
            
        },
        onOriginSelection:function(oEvent){
            let oSelectedobject=oEvent.getParameter("listItem").mProperties.title;
            if(this.selectedInputId.includes("originInput")){
                this.byId("originInput").setValue(oSelectedobject);
                MessageToast.show("Origin Selected Successfully");

            }else if(this.selectedInputId.includes("destinationInput")){
                this.byId("destinationInput").setValue(oSelectedobject);
                MessageToast.show("Destination Selected Successfully");

            }else if(this.selectedInputId.includes("originShipmentInput")){
                this.byId("originShipmentInput").setValue(oSelectedobject);
                MessageToast.show("Origin Selected Successfully");

            }else if(this.selectedInputId.includes("destinationShipmentInput")){
                this.byId("destinationShipmentInput").setValue(oSelectedobject);
                MessageToast.show("Destination Selected Successfully");

            }

        },
        onDestinationValueHelp: function () {
            MessageToast.show("Location search dialog would open here");
        },

        // NEW: Shipment Execution Handlers
        onShipmentTabSelect: function (oEvent) {
            var sKey = oEvent.getParameter("selectedKey");
            this._showShipmentTab(sKey);
        },
        
        _showShipmentTab: function (sKey) {
            // Hide all tabs
            this.byId("fleetOverviewTab").setVisible(false);
            this.byId("newShipmentTab").setVisible(false);
            this.byId("bookedShipmentsTab").setVisible(false);
            
            // Show selected tab
            switch (sKey) {
                case "fleetoverview":
                    this.byId("fleetOverviewTab").setVisible(true);
                    break;
                case "newshipment":
                    this.byId("newShipmentTab").setVisible(true);
                    break;
                case "bookedshipments":
                    this.byId("bookedShipmentsTab").setVisible(true);
                    break;
            }
        },
        
        // Fleet Management Handlers
        onSearchFleet: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var oTable = this.byId("fleetTable");
            var oBinding = oTable.getBinding("items");
            
            if (sQuery && sQuery.length > 0) {
                var aFilters = [
                    new Filter("id", FilterOperator.Contains, sQuery),
                    new Filter("type", FilterOperator.Contains, sQuery),
                    new Filter("driver", FilterOperator.Contains, sQuery),
                    new Filter("location", FilterOperator.Contains, sQuery)
                ];
                var oCombinedFilter = new Filter(aFilters, false); // OR condition
                oBinding.filter(oCombinedFilter);
            } else {
                oBinding.filter([]);
            }
        },
        
        onRefreshFleet: function () {
            MessageToast.show("Fleet data refreshed");
            // In real implementation, would refresh from backend
        },
        
        onSelectVehicleForBooking: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            var oVehicle = oContext.getObject();
            
            // Store selected vehicle
            var oModel = this.getView().getModel();
            oModel.setProperty("/selectedVehicle", oVehicle);
            
            // Switch to new shipment tab
            this.byId("shipmentTabBar").setSelectedKey("newshipment");
            this._showShipmentTab("newshipment");
            
            // Update selected vehicle text
            this.byId("selectedVehicleText").setText(
                oVehicle.id + " - " + oVehicle.type + " (" + oVehicle.capacity + ")"
            );
            
            MessageToast.show("Vehicle " + oVehicle.id + " selected for booking");
        },
        
        // Vehicle Selection Handlers
        onFilterVehicles: function () {
            var oSelect = this.byId("vehicleTypeFilter");
            var sSelectedKey = oSelect.getSelectedKey();
            var oTable = this.byId("vehicleSelectionTable");
            var oBinding = oTable.getBinding("items");
            
            if (sSelectedKey && sSelectedKey !== "all") {
                var sFilterValue = sSelectedKey === "truck" ? "Truck" :
                                 sSelectedKey === "container" ? "Container" :
                                 sSelectedKey === "tanker" ? "Tanker" : "";
                var oFilter = new Filter("type", FilterOperator.Contains, sFilterValue);
                var oAvailableFilter = new Filter("status", FilterOperator.EQ, "Available");
                oBinding.filter([oFilter, oAvailableFilter]);
            } else {
                // Show only available vehicles
                var oAvailableFilter = new Filter("status", FilterOperator.EQ, "Available");
                oBinding.filter([oAvailableFilter]);
            }
        },
        
        onVehicleSelectionChange: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            if (oSelectedItem) {
                var oContext = oSelectedItem.getBindingContext();
                var oVehicle = oContext.getObject();
                
                // Update selected vehicle text
                this.byId("selectedVehicleText").setText(
                    oVehicle.id + " - " + oVehicle.type + " (" + oVehicle.capacity + ")"
                );
                
                // Store selected vehicle in model
                var oModel = this.getView().getModel();
                oModel.setProperty("/selectedVehicle", oVehicle);
            }
        },
        
        // Shipment Booking Handlers
        onBookShipment: function () {
            var oCustomer = this.byId("customerInput").getValue();
            var oOrigin = this.byId("originShipmentInput").getValue();
            var oDestination = this.byId("destinationShipmentInput").getValue();
            var oSelectedVehicle = this.getView().getModel().getProperty("/selectedVehicle");
            var oCargoWeight = this.byId("cargoWeightInput").getValue();
            var oPickupDate = this.byId("pickupDatePicker").getValue();
            var oDeliveryDate = this.byId("deliveryDatePicker").getValue();
            
            if (!oCustomer || !oOrigin || !oDestination || !oSelectedVehicle || !oCargoWeight || !oPickupDate || !oDeliveryDate) {
                MessageBox.error("Please fill in all required fields and select a vehicle");
                return;
            }
            
            MessageBox.confirm(
                "Book shipment for " + oCustomer + " from " + oOrigin + " to " + oDestination + "?\n\nVehicle: " + oSelectedVehicle.id + " (" + oSelectedVehicle.type + ")\nWeight: " + oCargoWeight + "\nPickup: " + oPickupDate + "\nDelivery: " + oDeliveryDate,
                {
                    title: "Confirm Shipment Booking",
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            // Simulate booking
                            this._createNewBooking(oCustomer, oOrigin, oDestination, oSelectedVehicle);
                        }
                    }.bind(this)
                }
            );
        },
        
        _createNewBooking: function (sCustomer, sOrigin, sDestination, oVehicle) {
            var sNewId = "SHP-2024-00" + (1243 + Math.floor(Math.random() * 100));
            
            // Get form data
            var sCargoType = this.byId("cargoTypeSelect").getSelectedItem()?.getText() || "General Freight";
            var sCargoWeight = this.byId("cargoWeightInput").getValue();
            var sPickupDate = this.byId("pickupDatePicker").getValue();
            var sDeliveryDate = this.byId("deliveryDatePicker").getValue();
            var sPriority = this.byId("prioritySelect").getSelectedItem()?.getText() || "Standard";
            var sInstructions = this.byId("instructionsTextArea").getValue();
            
            // Add new booking to model
            var oModel = this.getView().getModel();
            var aBookedShipments = oModel.getProperty("/bookedShipments");
            
            var oNewBooking = {
                id: sNewId,
                vehicleId: oVehicle.id,
                vehicleType: oVehicle.type,
                customer: sCustomer,
                origin: sOrigin,
                destination: sDestination,
                loadDate: sPickupDate,
                deliveryDate: sDeliveryDate,
                driver: oVehicle.driver,
                status: "Scheduled",
                statusState: "Information",
                cargo: sCargoType,
                weight: sCargoWeight,
                priority: sPriority,
                instructions: sInstructions
            };
            
            aBookedShipments.unshift(oNewBooking);
            oModel.setProperty("/bookedShipments", aBookedShipments);
            
            // Update vehicle status to In Use
            var aFleet = oModel.getProperty("/availableFleet");
            var oVehicleToUpdate = aFleet.find(function(v) { return v.id === oVehicle.id; });
            if (oVehicleToUpdate) {
                oVehicleToUpdate.status = "In Use";
                oVehicleToUpdate.statusState = "Warning";
                oModel.setProperty("/availableFleet", aFleet);
            }
            
            MessageBox.success(
                "🚛 SHIPMENT BOOKED SUCCESSFULLY!\n\n" +
                "Shipment ID: " + sNewId + "\n" +
                "Customer: " + sCustomer + "\n" +
                "Route: " + sOrigin + " → " + sDestination + "\n" +
                "Vehicle: " + oVehicle.id + " (" + oVehicle.type + ")\n" +
                "Driver: " + oVehicle.driver + "\n" +
                "Cargo: " + sCargoType + " (" + sCargoWeight + ")\n" +
                "Pickup: " + sPickupDate + "\n" +
                "Delivery: " + sDeliveryDate + "\n" +
                "Priority: " + sPriority + "\n\n" +
                "Next Steps:\n" +
                "• Driver " + oVehicle.driver + " will be notified\n" +
                "• Vehicle preparation begins\n" +
                "• Tracking will be activated\n" +
                "• Documentation will be generated",
                {
                    title: "✅ Booking Confirmed",
                    actions: ["View Details", "Print Documents", MessageBox.Action.CLOSE],
                    onClose: function (sAction) {
                        if (sAction === "View Details") {
                            this.byId("shipmentTabBar").setSelectedKey("bookedshipments");
                            this._showShipmentTab("bookedshipments");
                        } else if (sAction === "Print Documents") {
                            MessageToast.show("📄 Printing shipment documents and labels...");
                        }
                    }.bind(this)
                }
            );
            
            // Clear form after successful booking
            this.onClearShipmentForm();
        },
        
        onSaveShipmentDraft: function () {
            var oCustomer = this.byId("customerInput").getValue();
            
            if (!oCustomer) {
                MessageToast.show("Please enter at least customer name to save draft");
                return;
            }
            
            MessageToast.show("Draft saved for customer: " + oCustomer);
            // In real implementation, would save to backend
        },
        
        onClearShipmentForm: function () {
            this.byId("customerInput").setValue("");
            this.byId("referenceInput").setValue("");
            this.byId("originShipmentInput").setValue("");
            this.byId("destinationShipmentInput").setValue("");
            this.byId("cargoWeightInput").setValue("");
            this.byId("instructionsTextArea").setValue("");
            this.byId("selectedVehicleText").setText("No vehicle selected");
            this.byId("cargoTypeSelect").setSelectedKey("");
            this.byId("prioritySelect").setSelectedKey("standard");
            this.byId("vehicleTypeFilter").setSelectedKey("all");
            this.byId("pickupDatePicker").setValue("");
            this.byId("deliveryDatePicker").setValue("");
            this.byId("pickupTimePicker").setValue("");
            
            // Reset vehicle selection in model
            var oModel = this.getView().getModel();
            oModel.setProperty("/selectedVehicle", null);
            
            // Clear vehicle selection table
            var oTable = this.byId("vehicleSelectionTable");
            if (oTable) {
                oTable.removeSelections(true);
            }
            
            // Reset vehicle filter
            this.onFilterVehicles();
            
            
        },
        
        // Booked Shipments Handlers
        onSearchBookedShipments: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var oTable = this.byId("bookedShipmentsTable");
            var oBinding = oTable.getBinding("items");
            
            if (sQuery && sQuery.length > 0) {
                var aFilters = [
                    new Filter("id", FilterOperator.Contains, sQuery),
                    new Filter("customer", FilterOperator.Contains, sQuery),
                    new Filter("vehicleId", FilterOperator.Contains, sQuery),
                    new Filter("driver", FilterOperator.Contains, sQuery),
                    new Filter("origin", FilterOperator.Contains, sQuery),
                    new Filter("destination", FilterOperator.Contains, sQuery)
                ];
                var oCombinedFilter = new Filter(aFilters, false);
                oBinding.filter(oCombinedFilter);
            } else {
                oBinding.filter([]);
            }
        },
        
        onNewBookingPress: function () {
            this.byId("shipmentTabBar").setSelectedKey("newshipment");
            this._showShipmentTab("newshipment");
        },
        
        onEditBookedShipment: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            var oShipment = oContext.getObject();
            
            MessageBox.information(
                "Edit Shipment: " + oShipment.id + "\n\nCustomer: " + oShipment.customer + "\nRoute: " + oShipment.origin + " → " + oShipment.destination + "\nVehicle: " + oShipment.vehicleId + "\nDriver: " + oShipment.driver + "\n\nEdit functionality will be implemented in the next phase.",
                {
                    title: "Shipment Details"
                }
            );
        },
        
        onCancelBookedShipment: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            var oShipment = oContext.getObject();
            
            MessageBox.confirm(
                "Cancel shipment " + oShipment.id + " for " + oShipment.customer + "?\n\nThis will:\n• Release vehicle " + oShipment.vehicleId + "\n• Notify driver " + oShipment.driver + "\n• Update customer with cancellation",
                {
                    title: "Cancel Shipment",
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            // Remove from booked shipments
                            var oModel = this.getView().getModel();
                            var aBookedShipments = oModel.getProperty("/bookedShipments");
                            var iIndex = aBookedShipments.findIndex(function(s) { return s.id === oShipment.id; });
                            
                            if (iIndex > -1) {
                                aBookedShipments.splice(iIndex, 1);
                                oModel.setProperty("/bookedShipments", aBookedShipments);
                                
                                // Update vehicle status back to Available
                                var aFleet = oModel.getProperty("/availableFleet");
                                var oVehicleToUpdate = aFleet.find(function(v) { return v.id === oShipment.vehicleId; });
                                if (oVehicleToUpdate) {
                                    oVehicleToUpdate.status = "Available";
                                    oVehicleToUpdate.statusState = "Success";
                                    oModel.setProperty("/availableFleet", aFleet);
                                }
                                
                                MessageToast.show("Shipment " + oShipment.id + " cancelled. Vehicle " + oShipment.vehicleId + " is now available.");
                            }
                        }
                    }.bind(this)
                }
            );
        },
        
        // Tracking & Visibility handlers
        onTrackShipment: function () {
            var sTrackingNumber = this.byId("trackingNumberInput")?.getValue();
            
            if (!sTrackingNumber) {
                MessageBox.error("Please enter a tracking number");
                return;
            }
            
            // Show loading
            this.byId("trackingResultPanel").setBusy(true);
            this.byId("trackingResultPanel").setVisible(true);
            
            // Simulate API call
            setTimeout(function () {
                this.byId("trackingResultPanel").setBusy(false);
                MessageToast.show("Tracking information loaded for: " + sTrackingNumber);
            }.bind(this), 1500);
        },
        
        onTrackingLinkPress: function (oEvent) {
            var sTrackingNumber = oEvent.getSource().getText();
            if (this.byId("trackingNumberInput")) {
                this.byId("trackingNumberInput").setValue(sTrackingNumber);
                this.onTrackShipment();
            }
        },
        
        onViewShipmentDetails: function(oEvent) {
            // Get the selected shipment data (if needed)
            var oBindingContext = oEvent.getSource().getBindingContext();
            var oShipmentData = oBindingContext ? oBindingContext.getObject() : null;
            
            // Hide the shipments list view
            this.byId("shipmentsListView").setVisible(false);
            
            // Show the detailed tracking view
            this.byId("detailedTrackingView").setVisible(true);
            
            // Make the tracking result panel visible
            this.byId("trackingResultPanel").setVisible(true);
            
            // Optional: Update the tracking input with the selected tracking number
            if (oShipmentData && oShipmentData.trackingNumber && this.byId("trackingNumberInput")) {
                this.byId("trackingNumberInput").setValue(oShipmentData.trackingNumber);
            }
        },
        
        onBackToShipmentsList: function() {
            // Hide the detailed tracking view
            this.byId("detailedTrackingView").setVisible(false);
            
            // Show the shipments list view
            this.byId("shipmentsListView").setVisible(true);
            
            // Clear tracking input if exists
            if (this.byId("trackingNumberInput")) {
                this.byId("trackingNumberInput").setValue("");
            }
        },
        
        onQuickTrack: function() {
            var sTrackingNumber = this.byId("quickTrackInput").getValue();
            
            if (!sTrackingNumber) {
                MessageToast.show("Please enter a tracking number");
                return;
            }
            
            // Set the tracking number in the detailed view
            if (this.byId("trackingNumberInput")) {
                this.byId("trackingNumberInput").setValue(sTrackingNumber);
            }
            
            // Navigate to detailed view
            this.onViewShipmentDetails({ getSource: function() { return { getBindingContext: function() { return null; } }; } });
        },
        
        onSearchShipments: function(oEvent) {
            var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue");
            var oTable = this.byId("allShipmentsTable");
            var oBinding = oTable.getBinding("items");
            
            if (sQuery && sQuery.length > 0) {
                var aFilters = [
                    new Filter("trackingNumber", FilterOperator.Contains, sQuery),
                    new Filter("customer", FilterOperator.Contains, sQuery),
                    new Filter("origin", FilterOperator.Contains, sQuery),
                    new Filter("destination", FilterOperator.Contains, sQuery)
                ];
                var oCombinedFilter = new Filter(aFilters, false);
                oBinding.filter(oCombinedFilter);
            } else {
                oBinding.filter([]);
            }
        },
        
        onRefreshShipments: function() {
            MessageToast.show("Shipments refreshed");
        },
        
        onPrintTrackingReport: function() {
            MessageToast.show("Printing tracking report...");
            window.print();
        },
        
        onShareTracking: function() {
            var sTrackingNumber = "SHP-2024-001234"; // Default or get from input
            var sShareUrl = window.location.origin + window.location.pathname + "?tracking=" + sTrackingNumber;
            
            if (navigator.share) {
                navigator.share({
                    title: 'IntelliCarrier - Shipment Tracking',
                    text: 'Track shipment: ' + sTrackingNumber,
                    url: sShareUrl,
                });
            } else {
                navigator.clipboard.writeText(sShareUrl).then(function() {
                    MessageToast.show("Tracking URL copied to clipboard");
                });
            }
        },
        
        onShipmentSelect: function(oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            if (oSelectedItem) {
                this.onViewShipmentDetails({ getSource: function() { return oSelectedItem; } });
            }
        },
        
        onContactCustomer: function() {
            MessageToast.show("Connecting to customer care...");
        },
        
        // Quick Actions
        onQuickShipment: function () {
            this._showView("shipmentexecution");
            this.byId("sideNavigation").setSelectedKey("shipmentexecution");
            this.byId("shipmentTabBar").setSelectedKey("newshipment");
            this._showShipmentTab("newshipment");
            MessageToast.show("Quick shipment mode activated");
        },
        
        onSettings: function () {
            MessageBox.information("Settings panel would open here");
        },
        
        // Mock data generators
        _getMockRecentShipments: function () {
            return [
                {
                    id: "SHP-2024-001234",
                    customer: "Acme Corporation",
                    destination: "New York, NY",
                    service: "Express",
                    status: "In Transit",
                    statusState: "Warning",
                    eta: "2024-01-15"
                },
                {
                    id: "SHP-2024-001233",
                    customer: "Global Tech Inc",
                    destination: "Los Angeles, CA",
                    service: "Standard",
                    status: "Delivered",
                    statusState: "Success",
                    eta: "2024-01-14"
                },
                {
                    id: "SHP-2024-001232",
                    customer: "Smart Solutions",
                    destination: "Chicago, IL",
                    service: "Overnight",
                    status: "Processing",
                    statusState: "Information",
                    eta: "2024-01-16"
                }
            ];
        },
        
        _getMockActiveShipments: function () {
            return [
                {
                    tracking: "TRK-789456123",
                    customer: "Global Tech Inc",
                    route: "LAX → JFK",
                    status: "In Transit",
                    eta: "Jan 15, 5:00 PM"
                },
                {
                    tracking: "TRK-789456124",
                    customer: "Acme Corporation",
                    route: "SFO → ORD",
                    status: "Out for Delivery",
                    eta: "Jan 14, 3:00 PM"
                }
            ];
        },
        
        // NEW: Fleet Mock Data
        _getMockFleetData: function () {
            return [
                {
                    id: "TRK-001",
                    type: "Standard Truck",
                    capacity: "10 tons",
                    dimensions: "20ft x 8ft x 8ft",
                    status: "Available",
                    location: "Houston Hub",
                    driver: "John Smith",
                    fuelType: "Diesel",
                    lastMaintenance: "2024-01-10",
                    statusState: "Success"
                },
                {
                    id: "CNT-045",
                    type: "Container",
                    capacity: "25 tons",
                    dimensions: "40ft x 8ft x 8.5ft",
                    status: "Available",
                    location: "Dallas Terminal",
                    driver: "Maria Garcia",
                    fuelType: "Diesel",
                    lastMaintenance: "2024-01-08",
                    statusState: "Success"
                },
                {
                    id: "TNK-012",
                    type: "Oil Tanker",
                    capacity: "15,000 gallons",
                    dimensions: "35ft x 8ft x 10ft",
                    status: "In Use",
                    location: "Refinery A",
                    driver: "Robert Johnson",
                    fuelType: "Diesel",
                    lastMaintenance: "2024-01-12",
                    statusState: "Warning"
                },
                {
                    id: "TRK-007",
                    type: "Heavy Duty Truck",
                    capacity: "15 tons",
                    dimensions: "25ft x 8ft x 10ft",
                    status: "Available",
                    location: "San Antonio Hub",
                    driver: "Lisa Chen",
                    fuelType: "Diesel",
                    lastMaintenance: "2024-01-09",
                    statusState: "Success"
                },
                {
                    id: "TRK-015",
                    type: "Refrigerated Truck",
                    capacity: "8 tons",
                    dimensions: "18ft x 8ft x 8ft",
                    status: "Maintenance",
                    location: "Service Center",
                    driver: "Not Assigned",
                    fuelType: "Diesel",
                    lastMaintenance: "2024-01-13",
                    statusState: "Error"
                },
                {
                    id: "CNT-052",
                    type: "Container",
                    capacity: "30 tons",
                    dimensions: "45ft x 8ft x 9ft",
                    status: "Available",
                    location: "Port Authority",
                    driver: "Carlos Rodriguez",
                    fuelType: "Diesel",
                    lastMaintenance: "2024-01-11",
                    statusState: "Success"
                },
                {
                    id: "TNK-018",
                    type: "Oil Tanker",
                    capacity: "20,000 gallons",
                    dimensions: "40ft x 8ft x 12ft",
                    status: "Available",
                    location: "Refinery B",
                    driver: "Ahmed Hassan",
                    fuelType: "Diesel",
                    lastMaintenance: "2024-01-07",
                    statusState: "Success"
                },
                {
                    id: "TRK-022",
                    type: "Heavy Duty Truck",
                    capacity: "18 tons",
                    dimensions: "28ft x 8ft x 10ft",
                    status: "Available",
                    location: "Austin Hub",
                    driver: "Jennifer White",
                    fuelType: "Diesel",
                    lastMaintenance: "2024-01-12",
                    statusState: "Success"
                }
            ];
        },
        
        // NEW: Booked Shipments Mock Data
        _getMockBookedShipments: function () {
            return [
                {
                    id: "SHP-2024-001240",
                    vehicleId: "TRK-003",
                    vehicleType: "Standard Truck",
                    customer: "Tech Industries",
                    origin: "Houston, TX",
                    destination: "Austin, TX",
                    loadDate: "2024-01-16",
                    deliveryDate: "2024-01-17",
                    driver: "Mike Wilson",
                    status: "Scheduled",
                    statusState: "Information",
                    cargo: "Electronics",
                    weight: "8.5 tons"
                },
                {
                    id: "SHP-2024-001241",
                    vehicleId: "CNT-047",
                    vehicleType: "Container",
                    customer: "Global Manufacturing",
                    origin: "Dallas, TX",
                    destination: "Phoenix, AZ",
                    loadDate: "2024-01-15",
                    deliveryDate: "2024-01-18",
                    driver: "Sarah Davis",
                    status: "In Transit",
                    statusState: "Warning",
                    cargo: "Industrial Equipment",
                    weight: "22 tons"
                },
                {
                    id: "SHP-2024-001242",
                    vehicleId: "TNK-015",
                    vehicleType: "Oil Tanker",
                    customer: "Energy Solutions",
                    origin: "Refinery B",
                    destination: "Distribution Center",
                    loadDate: "2024-01-14",
                    deliveryDate: "2024-01-16",
                    driver: "David Brown",
                    status: "Loading",
                    statusState: "Warning",
                    cargo: "Petroleum Products",
                    weight: "12,000 gallons"
                },
                {
                    id: "SHP-2024-001243",
                    vehicleId: "TRK-009",
                    vehicleType: "Heavy Duty Truck",
                    customer: "Construction Corp",
                    origin: "San Antonio, TX",
                    destination: "El Paso, TX",
                    loadDate: "2024-01-17",
                    deliveryDate: "2024-01-19",
                    driver: "James Miller",
                    status: "Scheduled",
                    statusState: "Information",
                    cargo: "Construction Materials",
                    weight: "14 tons"
                }
            ];
        }
    });
});