sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment"
], function (Controller, MessageToast, MessageBox, JSONModel, Filter, FilterOperator, Fragment) {
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
                selectedVehicle: null,
                orders: [
                    {
                        orderId: "FO-2026-0001",
                        coId: "CO-2026-0005",
                        customer: "Express Solutions Co.",
                        from: "Bangkok (Wireless Rd)",
                        to: "Chiang Mai (Nimman)",
                        distance: "685 km",
                        cargoType: "Office Supplies",
                        cargoInfo: "500 kg | 3 m³",
                        deliveryDate: "2026-01-16",
                        priority: "HIGH",
                        priorityState: "Warning",
                        status: "Pending Assignment",
                        statusState: "Warning",
                        value: "฿ 8,500"
                    },
                    {
                        orderId: "FO-2026-0002",
                        coId: "CO-2026-0004",
                        customer: "Innovation Corp",
                        from: "Bangkok (Ratchada)",
                        to: "Hat Yai, Songkhla",
                        distance: "945 km",
                        cargoType: "Medical Equipment",
                        cargoInfo: "1000 kg | 5 m³",
                        deliveryDate: "2026-01-20",
                        priority: "URGENT",
                        priorityState: "Error",
                        status: "Pending Assignment",
                        statusState: "Warning",
                        value: "฿ 125,000"
                    },

                    /* -------- NEW DATA FROM SCREENSHOT -------- */

                    {
                        orderId: "FO-2026-0003",
                        coId: "CO-2026-0007",
                        customer: "Smart Logistics Ltd",
                        from: "Bangkok (Sukhumvit)",
                        to: "Phuket",
                        distance: "867 km",
                        cargoType: "Consumer Electronics",
                        cargoInfo: "1125 kg | 6.5 m³",
                        deliveryDate: "2026-01-18",
                        priority: "NORMAL",
                        priorityState: "Information",
                        status: "Internal Fleet",
                        statusState: "Success",
                        value: "฿ 285,000"
                    },
                    {
                        orderId: "FO-2026-0004",
                        coId: "CO-2026-0010",
                        customer: "Global Trade Corp",
                        from: "Bangkok (Lat Phrao)",
                        to: "Khon Kaen",
                        distance: "448 km",
                        cargoType: "Industrial Parts",
                        cargoInfo: "2500 kg | 12 m³",
                        deliveryDate: "2026-01-17",
                        priority: "HIGH",
                        priorityState: "Warning",
                        status: "External Carrier",
                        statusState: "Information",
                        value: "฿ 75,000"
                    },
                    {
                        orderId: "FO-2026-0006",
                        coId: "CO-2026-0015",
                        sphId: "SHP-2026-001235",
                        customer: "Prime Distribution Co.",
                        from: "Bangkok (Bang Na)",
                        to: "Rayong",
                        distance: "180 km",
                        cargoType: "Automotive Components",
                        cargoInfo: "1,200 kg | 6 m³",
                        deliveryDate: "2026-01-10",
                        priority: "NORMAL",
                        priorityState: "Information",
                        status: "Completed",
                        statusState: "Success",
                        value: "฿ 42,800"
                    },
                    {
                        orderId: "FO-2026-0005",
                        coId: "CO-2026-0012",
                        customer: "Metro Retail Corp",
                        from: "Bangkok (Silom)",
                        to: "Pattaya, Chonburi",
                        distance: "147 km",
                        cargoType: "Retail Goods",
                        cargoInfo: "600 kg | 4 m³",
                        deliveryDate: "2026-01-14",
                        priority: "URGENT",
                        priorityState: "Error",
                        status: "In Transit",
                        statusState: "Warning",
                        value: "฿ 18,750"
                    }
                ],
                InternalFleet: [
                    {
                        vehicleID: "TH-1234",
                        vehicleType: "6-Wheeler Truck",
                        subType: "Medium Truck",
                        status: "Available",
                        statusState: "Success",  // 🟢 Green
                        driver: "Somchai Prasert",
                        driverPhone: "+66 81 234 5678",
                        location: "📍 Bangkok Depot",
                        capacity: "8,000 kg | 25 m³",
                        dailyRate: "฿4,500/day"
                    },
                    {
                        vehicleID: "TH-2345",
                        vehicleType: "10-Wheeler Truck",
                        subType: "Heavy Truck",
                        status: "Available",
                        statusState: "Success",  // 🟢 Green
                        driver: "Wichai Thongsuk",
                        driverPhone: "+66 81 345 6789",
                        location: "📍 Bangkok Depot",
                        capacity: "15,000 kg | 45 m³",
                        dailyRate: "฿6,500/day"
                    },
                    {
                        vehicleID: "TH-3456",
                        vehicleType: "4-Wheeler Van",
                        subType: "Light Van",
                        status: "In Use",
                        statusState: "Warning",  // 🟠 Orange
                        driver: "Narong Somjai",
                        driverPhone: "+66 81 456 7890",
                        location: "📍 Chiang Mai",
                        capacity: "2,000 kg | 8 m³",
                        dailyRate: "฿2,500/day"
                    },
                    {
                        vehicleID: "TH-4567",
                        vehicleType: "6-Wheeler Truck",
                        subType: "Medium Truck",
                        status: "Maintenance",
                        statusState: "Error",    // 🔴 Red
                        driver: "Prasert Chai",
                        driverPhone: "+66 81 567 8901",
                        location: "📍 Service Center",
                        capacity: "8,000 kg | 25 m³",
                        dailyRate: "฿4,500/day"
                    },
                    {
                        vehicleID: "TH-5678",
                        vehicleType: "4-Wheeler Van",
                        subType: "Light Van",
                        status: "In Use",
                        statusState: "Warning",  // 🟠 Orange
                        driver: "Prasit Wongchai",
                        driverPhone: "+66 82 345 6789",
                        location: "📍 En Route to Pattaya",
                        capacity: "2,000 kg | 8 m³",
                        dailyRate: "฿2,500/day"
                    },
                    {
                        vehicleID: "TH-6789",
                        vehicleType: "Refrigerated Truck",
                        subType: "Refrigerated",
                        status: "Available",
                        statusState: "Success",  // 🟢 Green
                        driver: "Surachai Pranee",
                        driverPhone: "+66 82 456 7890",
                        location: "📍 Bangkok Depot",
                        capacity: "5,000 kg | 15 m³",
                        dailyRate: "฿7,500/day"
                    }
                ],
                ExternalCarriers: [
                    {
                        carrierName: "Kerry Express Thailand",
                        ratingValue: 4.8,
                        coverage: "Nationwide",
                        leadTime: "1-2 days",
                        baseRate: "฿35",
                        perKmRate: "฿8/km",
                        capacity: "20,000 kg | 60 m³",
                        tracking: "Available",
                        trackingState: "Success" // Green text
                    },
                    {
                        carrierName: "Flash Express",
                        ratingValue: 4.6,
                        coverage: "Nationwide",
                        leadTime: "1-3 days",
                        baseRate: "฿30",
                        perKmRate: "฿7/km",
                        capacity: "15,000 kg | 45 m³",
                        tracking: "Available",
                        trackingState: "Success"
                    },
                    {
                        carrierName: "DHL Thailand",
                        ratingValue: 4.9,
                        coverage: "International",
                        leadTime: "1-2 days",
                        baseRate: "฿50",
                        perKmRate: "฿12/km",
                        capacity: "30,000 kg | 80 m³",
                        tracking: "Available",
                        trackingState: "Success"
                    },
                    {
                        carrierName: "J&T Express",
                        ratingValue: 4.5,
                        coverage: "Nationwide",
                        leadTime: "2-3 days",
                        baseRate: "฿28",
                        perKmRate: "฿6/km",
                        capacity: "10,000 kg | 30 m³",
                        tracking: "Available",
                        trackingState: "Success"
                    },
                    {
                        carrierName: "SCG Logistics",
                        ratingValue: 4.7,
                        coverage: "Regional",
                        leadTime: "1-2 days",
                        baseRate: "฿45",
                        perKmRate: "฿10/km",
                        capacity: "25,000 kg | 70 m³",
                        tracking: "Available",
                        trackingState: "Success"
                    }
                ],
                Drivers: [
                    {
                        driverId: "DRV-001",
                        name: "Somchai Prasert",
                        contact: "+66 81 234 5678",
                        status: "Available",
                        statusState: "Success", // Green
                        assignedVehicle: "TH-1234",
                        license: "Class 2",
                        rating: 4.8,
                        totalTrips: 342
                    },
                    {
                        driverId: "DRV-002",
                        name: "Wichai Thongsuk",
                        contact: "+66 81 345 6789",
                        status: "Available",
                        statusState: "Success",
                        assignedVehicle: "TH-2345",
                        license: "Class 2",
                        rating: 4.6,
                        totalTrips: 287
                    },
                    {
                        driverId: "DRV-003",
                        name: "Narong Somjai",
                        contact: "+66 81 456 7890",
                        status: "On Duty",
                        statusState: "Warning", // Orange (Busy)
                        assignedVehicle: "TH-3456",
                        license: "Class 3",
                        rating: 4.5,
                        totalTrips: 198
                    },
                    {
                        driverId: "DRV-004",
                        name: "Prasert Chai",
                        contact: "+66 81 567 8901",
                        status: "Off Duty",
                        statusState: "Information", // Blue/Grey
                        assignedVehicle: "TH-4567",
                        license: "Class 2",
                        rating: 4.4,
                        totalTrips: 156
                    },
                    {
                        driverId: "DRV-005",
                        name: "Prasit Wongchai",
                        contact: "+66 82 345 6789",
                        status: "On Duty",
                        statusState: "Warning",
                        assignedVehicle: "TH-5678",
                        license: "Class 3",
                        rating: 4.7,
                        totalTrips: 223
                    },
                    {
                        driverId: "DRV-006",
                        name: "Surachai Pranee",
                        contact: "+66 82 456 7890",
                        status: "Available",
                        statusState: "Success",
                        assignedVehicle: "TH-6789",
                        license: "Class 2 + Refrigerated",
                        rating: 4.9,
                        totalTrips: 312
                    },
                    {
                        driverId: "DRV-007",
                        name: "Anuchit Ploykaew",
                        contact: "+66 83 123 4567",
                        status: "On Duty",
                        statusState: "Warning",
                        assignedVehicle: "-",
                        license: "Class 3",
                        rating: 4.3,
                        totalTrips: 89
                    },
                    {
                        driverId: "DRV-008",
                        name: "Kittisak Boonmee",
                        contact: "+66 83 234 5678",
                        status: "On Duty",
                        statusState: "Warning",
                        assignedVehicle: "-",
                        license: "Class 2",
                        rating: 4.6,
                        totalTrips: 134
                    }
                ], Maintenance: [
                    {
                        vehicleId: "TH-4567",
                        vehicleType: "6-Wheeler Truck",
                        serviceType: "Major Service",
                        scheduledDate: "2026-01-10",
                        duration: "3 days",
                        status: "In Progress",
                        statusState: "Warning", // Orange/Yellow indicating active work
                        serviceCenter: "Toyota Service Center - Bangna"
                    },
                    {
                        vehicleId: "TH-2345",
                        vehicleType: "10-Wheeler Truck",
                        serviceType: "Routine",
                        scheduledDate: "2026-02-20",
                        duration: "1 day",
                        status: "Scheduled",
                        statusState: "Information", // Blue indicating future event
                        serviceCenter: "Isuzu Service Center - Rangsit"
                    },
                    {
                        vehicleId: "TH-3456",
                        vehicleType: "4-Wheeler Van",
                        serviceType: "Routine",
                        scheduledDate: "2026-03-01",
                        duration: "1 day",
                        status: "Scheduled",
                        statusState: "Information",
                        serviceCenter: "Toyota Service Center - Bangna"
                    }
                ],
                Discrepancies: [
                    {
                        id: "SHP-2026-0048",
                        carrier: "FedEx Thailand",
                        issueType: "Price Variance",
                        issueState: "Error",          // Red background
                        contractRate: "12500",
                        invoiced: "14750",
                        difference: "2250",
                        diffState: "Error",           // Red text
                        currency: "฿",
                        details: "Peak season surcharge not in contract"
                    },
                    {
                        id: "SHP-2026-0053",
                        carrier: "DHL Express",
                        issueType: "Weight Mismatch",
                        issueState: "Error",
                        contractRate: "9200",
                        invoiced: "9850",
                        difference: "650",
                        diffState: "Error",
                        currency: "฿",
                        details: "Actual weight 12% higher than booked"
                    },
                    {
                        id: "SHP-2026-0054",
                        carrier: "Kerry Logistics",
                        issueType: "Service Type",
                        issueState: "Error",
                        contractRate: "5500",
                        invoiced: "7200",
                        difference: "1700",
                        diffState: "Error",
                        currency: "฿",
                        details: "Billed as Express, contracted Standard"
                    }
                ],
                ExternalValidation: [
                    {
                        id: "SHP-2026-0050",
                        carrier: "DHL Express",
                        invoiceNo: "DHL-TH-2026-45678",
                        invoiceDate: "2026-01-13",
                        // Storing numbers as formatted strings foreasier binding with "฿" in front
                        invoiceAmt: "15,450",
                        contractRate: "15,450",
                        variance: "0",
                        // OCR Status
                        ocrText: "Verified",
                        ocrState: "Success",       // Green
                        ocrIcon: "sap-icon://accept",
                        // Validation Status
                        valText: "Passed",
                        valState: "Success",       // Green
                        valIcon: "sap-icon://validate",
                        // Action Logic
                        showApprove: true
                    },
                    {
                        id: "SHP-2026-0051",
                        carrier: "Kerry Logistics",
                        invoiceNo: "KRY-2026-78901",
                        invoiceDate: "2026-01-13",
                        invoiceAmt: "8,200",
                        contractRate: "8,200",
                        variance: "0",
                        ocrText: "Verified",
                        ocrState: "Success",
                        ocrIcon: "sap-icon://accept",
                        valText: "Passed",
                        valState: "Success",
                        valIcon: "sap-icon://validate",
                        showApprove: true
                    },
                    {
                        id: "SHP-2026-0052",
                        carrier: "TNT Express",
                        invoiceNo: "TNT-TH-2026-11223",
                        invoiceDate: "2026-01-12",
                        invoiceAmt: "6,500",
                        contractRate: "6,500",
                        variance: "0",
                        ocrText: "Processing",
                        ocrState: "Information",   // Blue (or Warning for Orange)
                        ocrIcon: "sap-icon://process",
                        valText: "Pending",
                        valState: "Warning",       // Orange
                        valIcon: "sap-icon://pending",
                        showApprove: false         // Hide button
                    }
                ],
                InternalPending: [
                    {
                        id: "SHP-2026-0038",
                        customer: "Tech Solutions",
                        driver: "Somchai P.",
                        route: "BKK→CNX",
                        rateId: "RA-TECH-2026-001",
                        baseCharge: "17572",
                        surcharges: "1494",
                        total: "18113",
                        currency: "฿",
                        calculatedAt: "2026-01-14 09:15"
                    },
                    {
                        id: "SHP-2026-0039",
                        customer: "Metro Retail",
                        driver: "Wichai T.",
                        route: "RYG→BKK",
                        rateId: "RR-BKK-CNX-001",
                        baseCharge: "8500",
                        surcharges: "723",
                        total: "9223",
                        currency: "฿",
                        calculatedAt: "2026-01-14 09:20"
                    },
                    {
                        id: "SHP-2026-0040",
                        customer: "Global Corp",
                        driver: "Narong S.",
                        route: "BKK→HKT",
                        rateId: "RA-GLOBAL-2026-001",
                        baseCharge: "15200",
                        surcharges: "1292",
                        total: "15276",
                        currency: "฿",
                        calculatedAt: "2026-01-14 09:30"
                    }
                ],
                PendingShipments: [
                    {
                        id: "SHP-2026-0045",
                        fleetType: "Internal",
                        fleetIcon: "sap-icon://shipping-status", // 🚛
                        fleetState: "Success",       // Green
                        customer: "Tech Solutions",
                        origin: "Bangkok Hub",
                        destination: "Chiang Mai DC",
                        weight: "2,450 kg",
                        distance: "685 km",
                        deliveredAt: "2026-01-14 08:30",
                        rateId: "RA-TECH-2026-001"
                    },
                    {
                        id: "SHP-2026-0046",
                        fleetType: "External",
                        fleetIcon: "sap-icon://building", // 🏢
                        fleetState: "Information",   // Blue
                        customer: "Global Corp",
                        origin: "Bangkok",
                        destination: "Phuket",
                        weight: "890 kg",
                        distance: "862 km",
                        deliveredAt: "2026-01-14 09:15",
                        rateId: "CR-DHL-2026-001"
                    },
                    {
                        id: "SHP-2026-0047",
                        fleetType: "Internal",
                        fleetIcon: "sap-icon://shipping-status",
                        fleetState: "Success",
                        customer: "Metro Retail",
                        origin: "Rayong Plant",
                        destination: "Bangkok DC",
                        weight: "5,200 kg",
                        distance: "180 km",
                        deliveredAt: "2026-01-14 07:45",
                        rateId: "RR-BKK-CNX-001"
                    },
                    {
                        id: "SHP-2026-0048",
                        fleetType: "External",
                        fleetIcon: "sap-icon://building",
                        fleetState: "Information",
                        customer: "Smart Logistics",
                        origin: "Bangkok",
                        destination: "Khon Kaen",
                        weight: "1,250 kg",
                        distance: "450 km",
                        deliveredAt: "2026-01-14 10:00",
                        rateId: "CR-FEDEX-2026-001"
                    }
                ],
                SentToS4: [
                    {
                        id: "SHP-2026-0032",
                        fleetType: "Internal",
                        fleetIcon: "sap-icon://shipping-status", // 🚛
                        fleetState: "Success",       // Green badge
                        customer: "Tech Solutions",
                        chargeAmount: "18250",       // Raw number for formatting
                        currency: "฿",
                        salesOrder: "SO-2026-04521",
                        s4Status: "Processed",
                        s4State: "Success",          // Green text
                        s4Icon: "sap-icon://accept", // ✅
                        sentAt: "2026-01-14 10:30"
                    },
                    {
                        id: "SHP-2026-0033",
                        fleetType: "External",
                        fleetIcon: "sap-icon://building", // 🏢
                        fleetState: "Information",   // Blue badge
                        customer: "Global Corp",
                        chargeAmount: "15450",
                        currency: "฿",
                        salesOrder: "SO-2026-04522",
                        s4Status: "Processed",
                        s4State: "Success",
                        s4Icon: "sap-icon://accept",
                        sentAt: "2026-01-14 10:45"
                    },
                    {
                        id: "SHP-2026-0034",
                        fleetType: "Internal",
                        fleetIcon: "sap-icon://shipping-status",
                        fleetState: "Success",
                        customer: "Metro Retail",
                        chargeAmount: "9800",
                        currency: "฿",
                        salesOrder: "SO-2026-04523",
                        s4Status: "Processed",
                        s4State: "Success",
                        s4Icon: "sap-icon://accept",
                        sentAt: "2026-01-14 11:00"
                    },
                    {
                        id: "SHP-2026-0035",
                        fleetType: "External",
                        fleetIcon: "sap-icon://building",
                        fleetState: "Information",
                        customer: "Innovation Labs",
                        chargeAmount: "6200",
                        currency: "฿",
                        salesOrder: "SO-2026-04524",
                        s4Status: "Pending",
                        s4State: "Warning",          // Orange text
                        s4Icon: "sap-icon://pending", // ⏳
                        sentAt: "2026-01-14 11:15"
                    }
                ]


            });
            this.getView().setModel(oViewModel);

            // Set initial view visibility
            this._showView("dashboard");
            var oSelectionModel = new sap.ui.model.json.JSONModel({
                visible: false,
                text: "",
                price: ""
            });

            this.getView().setModel(oSelectionModel, "selectionModel");
        },
        onAfterRendering: function () {
            this.onFleetCockpitTabSelect({
                getParameter: function () {
                    return "PendingAssignment";
                }
            });
        },

        // Global fragment load function
        loadFragment: function (sPath) {
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
            this.byId("freightOrdersView").setVisible(false);
            this.byId("shipmentExecutionViewsub2").setVisible(false);
            this.byId("bolView").setVisible(false);
            this.byId("rateMasterView").setVisible(false);
            this.byId("priceCalculationView").setVisible(false);



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
                case "freightOrders":
                    this.byId("freightOrdersView").setVisible(true);
                    break;
                case "tracking":
                    this.byId("trackingView").setVisible(true);
                    break;
                case "shipmentExecutionViewsub2":
                    this.byId("shipmentExecutionViewsub2").setVisible(true);
                    break
                case "bol":
                    this.byId("bolView").setVisible(true);
                    break;
                case "rateMaster":
                    this.byId("rateMasterView").setVisible(true);
                    break;
                case "priceCalculation":
                    this.byId("priceCalculationView").setVisible(true);
                    break;
            }
        },


        // Add this to your controller

        onCardPressFreight: function (oEvent) {
            // Get the pressed tile
            var oTile = oEvent.getSource();
            var sHeader = oTile.getHeader();

            // Map tile headers to status values
            var mStatusMapping = {
                "Total Orders": null, // null means show all
                "Pending Review": "Pending Review",
                "Reviewed": "Reviewed",
                "Submitted": "Submitted",
                "Approved": "Approved",
                "Revision": "Revision",
                "Rejected": "Rejected",
                "Confirmed": "Confirmed"
            };

            var sStatusFilter = mStatusMapping[sHeader];

            // Get the table
            var oTable = this.byId("freightOrdersTable");
            var oBinding = oTable.getBinding("items");

            // Clear existing filters
            var aFilters = [];

            // Add status filter if not "Total Orders"
            if (sStatusFilter) {
                aFilters.push(new sap.ui.model.Filter("statusText", sap.ui.model.FilterOperator.EQ, sStatusFilter));
            }

            // Apply the filter
            oBinding.filter(aFilters);

            // Optional: Visual feedback - highlight selected tile
            this._highlightSelectedTile(oTile);
        },

        _highlightSelectedTile: function (oSelectedTile) {
            // Remove highlight from all tiles
            var oView = this.getView();
            var aTiles = oView.findAggregatedObjects(true, function (oControl) {
                return oControl instanceof sap.m.GenericTile;
            });

            aTiles.forEach(function (oTile) {
                oTile.removeStyleClass("selectedTile");
            });

            // Add highlight to selected tile
            oSelectedTile.addStyleClass("selectedTile");
        },

        // Keep your existing search function and combine with tile filter
        onSearchFreight: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var oTable = this.byId("freightOrdersTable");
            var oBinding = oTable.getBinding("items");

            var aFilters = [];

            if (sQuery) {
                // Add search filters
                aFilters.push(new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter("orderId", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("customerName", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("deliveryAddress", sap.ui.model.FilterOperator.Contains, sQuery)
                    ],
                    and: false
                }));
            }

            oBinding.filter(aFilters);
        },

        // Add these methods to your controller

        onManualEntryFreight: function () {
            // Initialize the model with default values
            var oManualOrderModel = new sap.ui.model.json.JSONModel({
                customerName: "",
                email: "",
                phone: "",
                pickupAddress: "",
                deliveryAddress: "",
                products: [
                    {
                        productName: "",
                        quantity: 0,
                        unit: "pcs"
                    }
                ],
                pickupDate: null,
                deliveryDate: null,
                totalWeight: 0,
                volume: 0,
                specialInstructions: ""
            });

            this.getView().setModel(oManualOrderModel, "manualOrder");

            // Load and open the fragment
            if (!this._oManualOrderDialog) {
                this._oManualOrderDialog = sap.ui.xmlfragment(
                    "intellicarrier.view.ManualFreightOrder",
                    this
                );
                this.getView().addDependent(this._oManualOrderDialog);
            }

            this._oManualOrderDialog.open();
        },




        onAddProduct: function () {
            var oModel = this.getView().getModel("manualOrder");
            var aProducts = oModel.getProperty("/products");

            aProducts.push({
                productName: "",
                quantity: 0,
                unit: "pcs"
            });

            oModel.setProperty("/products", aProducts);
        },

        onSaveManualOrder: function () {
            var oModel = this.getView().getModel("manualOrder");
            var oData = oModel.getData();

            // Validate required fields
            if (!oData.customerName || !oData.phone || !oData.pickupAddress ||
                !oData.deliveryAddress || !oData.pickupDate || !oData.deliveryDate) {
                sap.m.MessageBox.error("Please fill all required fields marked with *");
                return;
            }

            // Validate products
            var bValidProducts = oData.products.every(function (product) {
                return product.productName && product.quantity > 0;
            });

            if (!bValidProducts) {
                sap.m.MessageBox.error("Please fill all product details with valid quantities");
                return;
            }

            // Generate order ID
            var sOrderId = "CO-" + new Date().getFullYear() + "-" +
                String(Math.floor(Math.random() * 10000)).padStart(4, "0");

            // Create new order object
            var oNewOrder = {
                orderId: sOrderId,
                sourceIcon: "sap-icon://edit",
                sourceText: "Manual Entry",
                customerName: oData.customerName,
                customerEmail: oData.email,
                deliveryAddress: oData.deliveryAddress,
                productsCount: oData.products.length + " items",
                weight: oData.totalWeight + " kg",
                deliveryDate: this._formatDate(oData.deliveryDate),
                value: "$0", // Can be calculated based on products
                statusText: "Pending Review",
                statusState: "Warning",
                statusIcon: "sap-icon://pending",
                actionButtonText: "Review",
                actionButtonType: "Default",
                ocrConfidence: "Manual",
                // Store full data
                fullData: oData
            };

            // Add to orders list
            var oOrdersModel = this.getView().getModel("orders");
            var aOrders = oOrdersModel.getProperty("/ordersList");
            aOrders.unshift(oNewOrder); // Add to beginning

            // Update summary
            var oSummary = oOrdersModel.getProperty("/summary");
            oSummary.total++;
            oSummary.pendingReview++;

            oOrdersModel.refresh();

            // Show success message
            sap.m.MessageToast.show("Manual order created successfully: " + sOrderId);

            // Close dialog
            this._oManualOrderDialog.close();
        },

        onCancelManualOrder: function () {
            this._oManualOrderDialog.close();
        },

        _formatDate: function (sDate) {
            if (!sDate) return "";
            var oDate = new Date(sDate);
            var sDay = String(oDate.getDate()).padStart(2, "0");
            var sMonth = String(oDate.getMonth() + 1).padStart(2, "0");
            var sYear = oDate.getFullYear();
            return sDay + "/" + sMonth + "/" + sYear;
        },

        // If you want to edit an existing order, add this method
        onEditOrder: function (oEvent) {
            var oItem = oEvent.getSource().getBindingContext("orders").getObject();

            // Load existing order data into the model
            var oManualOrderModel = new sap.ui.model.json.JSONModel(oItem.fullData || {
                customerName: oItem.customerName,
                email: oItem.customerEmail,
                phone: "",
                pickupAddress: "",
                deliveryAddress: oItem.deliveryAddress,
                products: [{
                    productName: "",
                    quantity: 0,
                    unit: "pcs"
                }],
                pickupDate: null,
                deliveryDate: oItem.deliveryDate,
                totalWeight: 0,
                volume: 0,
                specialInstructions: ""
            });

            this.getView().setModel(oManualOrderModel, "manualOrder");

            // Store the order being edited
            this._editingOrderId = oItem.orderId;

            // Open dialog
            if (!this._oManualOrderDialog) {
                this._oManualOrderDialog = sap.ui.xmlfragment(
                    "intellicarrier.view.ManualFreightOrder",
                    this
                );
                this.getView().addDependent(this._oManualOrderDialog);
            }

            this._oManualOrderDialog.setTitle("Edit Freight Order");
            this._oManualOrderDialog.open();
        },


        // Add these methods to your controller

        // Open Review Dialog when Review button is clicked
        onActionPressFreight: function (oEvent) {
            var oBindingContext = oEvent.getSource().getBindingContext("orders");
            var oOrderData = oBindingContext.getObject();

            // Check which action to perform based on button text
            var sButtonText = oEvent.getSource().getText();

            if (sButtonText === "Review") {
                this._openReviewDialog(oOrderData);
            } else if (sButtonText === "View") {
                this.onViewDetailsFreight(oEvent);
            }
        },

        _openReviewDialog: function (oOrderData) {
            // Prepare review model with order data
            var oReviewModel = new sap.ui.model.json.JSONModel({
                orderId: oOrderData.orderId,
                ocrConfidence: oOrderData.ocrConfidence || "N/A",
                customerName: oOrderData.customerName || "",
                email: oOrderData.customerEmail || "",
                phone: oOrderData.fullData?.phone || "",
                language: oOrderData.fullData?.language || "Thai",
                pickupAddress: oOrderData.fullData?.pickupAddress || "",
                deliveryAddress: oOrderData.deliveryAddress || "",
                products: oOrderData.fullData?.products || [
                    {
                        productName: "Electronic Components",
                        quantity: 150,
                        unit: "pcs"
                    },
                    {
                        productName: "Circuit Boards",
                        quantity: 200,
                        unit: "pcs"
                    }
                ],
                pickupDate: oOrderData.fullData?.pickupDate || "2026-01-15",
                deliveryDate: oOrderData.fullData?.deliveryDate || "2026-01-17",
                totalWeight: oOrderData.fullData?.totalWeight || 750,
                volume: oOrderData.fullData?.volume || 2.5,
                specialInstructions: oOrderData.fullData?.specialInstructions || "Handle with care. Temperature controlled.",
                documentName: oOrderData.fullData?.documentName || "PDF not uploaded",
                sourceText: oOrderData.sourceText || "PDF Upload",
                checklist: {
                    customerVerified: false,
                    addressesAccurate: false,
                    productsConfirmed: false,
                    datesFeasible: false
                }
            });

            this.getView().setModel(oReviewModel, "reviewOrder");

            // Store original order ID for updating later
            this._reviewingOrderId = oOrderData.orderId;

            // Load and open the review fragment as a dialog
            if (!this._oReviewDialog) {
                sap.ui.core.Fragment.load({
                    name: "intellicarrier.view.ReviewFreightOrder",
                    controller: this
                }).then(function (oDialog) {
                    this._oReviewDialog = oDialog;
                    this.getView().addDependent(this._oReviewDialog);
                    this._oReviewDialog.open();
                }.bind(this));
            } else {
                this._oReviewDialog.open();
            }
        },

        onBackFromReview: function () {
            if (this._oReviewDialog) {
                this._oReviewDialog.close();
            }
        },

        onAddProductReview: function () {
            var oModel = this.getView().getModel("reviewOrder");
            var aProducts = oModel.getProperty("/products");

            aProducts.push({
                productName: "",
                quantity: 0,
                unit: "pcs"
            });

            oModel.setProperty("/products", aProducts);
        },

        onDownloadOriginal: function () {
            sap.m.MessageToast.show("Downloading original document...");
            // Implement actual download logic here
        },
        onuploadComplete: function (oEvent) {
            debugger
            this.getView().getModel("reviewOrder").setProperty("/documentName", "12345678")
        },

        onCancelReview: function () {
            sap.m.MessageBox.confirm(
                "Are you sure you want to cancel? Any unsaved changes will be lost.",
                {
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.OK) {
                            this.onBackFromReview();
                        }
                    }.bind(this)
                }
            );
        },

        onSaveDraftReview: function () {
            var oModel = this.getView().getModel("reviewOrder");
            var oData = oModel.getData();

            // Update the order in the orders model
            this._updateOrderData(oData, "Pending Review");

            sap.m.MessageToast.show("Draft saved successfully");
            this.onBackFromReview();
        },

        onSubmitReview: function () {
            var oModel = this.getView().getModel("reviewOrder");
            var oData = oModel.getData();
            var oChecklist = oData.checklist;

            // Validate checklist
            if (!oChecklist.customerVerified || !oChecklist.addressesAccurate ||
                !oChecklist.productsConfirmed || !oChecklist.datesFeasible) {
                sap.m.MessageBox.warning(
                    "Please complete all checklist items before submitting for approval."
                );
                return;
            }

            // Validate required fields
            if (!oData.customerName || !oData.pickupAddress || !oData.deliveryAddress ||
                !oData.pickupDate || !oData.deliveryDate) {
                sap.m.MessageBox.error("Please fill all required fields before submitting.");
                return;
            }

            // Update the order status to "Submitted"
            this._updateOrderData(oData, "Submitted");

            sap.m.MessageBox.success(
                "Order " + oData.orderId + " has been submitted for approval.",
                {
                    onClose: function () {
                        this.onBackFromReview();
                    }.bind(this)
                }
            );
        },

        _updateOrderData: function (oReviewData, sNewStatus) {
            var oOrdersModel = this.getView().getModel("orders");
            var aOrders = oOrdersModel.getProperty("/ordersList");
            var oSummary = oOrdersModel.getProperty("/summary");

            // Find and update the order
            var iIndex = aOrders.findIndex(function (order) {
                return order.orderId === this._reviewingOrderId;
            }.bind(this));

            if (iIndex !== -1) {
                var oOrder = aOrders[iIndex];
                var sOldStatus = oOrder.statusText;

                // Update order data
                oOrder.customerName = oReviewData.customerName;
                oOrder.customerEmail = oReviewData.email;
                oOrder.deliveryAddress = oReviewData.deliveryAddress;
                oOrder.deliveryDate = this._formatDate(oReviewData.deliveryDate);
                oOrder.weight = oReviewData.totalWeight + " kg";
                oOrder.productsCount = oReviewData.products.length + " items";
                oOrder.statusText = sNewStatus;

                // Update status styling
                if (sNewStatus === "Submitted") {
                    oOrder.statusState = "None";
                    oOrder.statusIcon = "sap-icon://upload-to-cloud";
                    oOrder.actionButtonText = "View";
                    oOrder.actionButtonType = "Transparent";
                } else if (sNewStatus === "Pending Review") {
                    oOrder.statusState = "Warning";
                    oOrder.statusIcon = "sap-icon://pending";
                    oOrder.actionButtonText = "Review";
                    oOrder.actionButtonType = "Default";
                }

                // Store full data
                oOrder.fullData = oReviewData;

                // Update summary counts
                if (sOldStatus === "Pending Review") {
                    oSummary.pendingReview--;
                }
                if (sNewStatus === "Submitted") {
                    oSummary.submitted++;
                } else if (sNewStatus === "Pending Review") {
                    oSummary.pendingReview++;
                }
            }

            oOrdersModel.refresh();
        },

        onManualEntryFreight: function () {
            // Initialize the model with default values
            var oManualOrderModel = new sap.ui.model.json.JSONModel({
                customerName: "",
                email: "",
                phone: "",
                pickupAddress: "",
                deliveryAddress: "",
                products: [
                    {
                        productName: "",
                        quantity: 0,
                        unit: "pcs"
                    }
                ],
                pickupDate: null,
                deliveryDate: null,
                totalWeight: 0,
                volume: 0,
                specialInstructions: ""
            });

            this.getView().setModel(oManualOrderModel, "manualOrder");

            // Load and open the fragment
            if (!this._oManualOrderDialog) {
                this._oManualOrderDialog = sap.ui.xmlfragment(
                    "intellicarrier.view.ManualFreightOrder",
                    this
                );
                this.getView().addDependent(this._oManualOrderDialog);
            }

            this._oManualOrderDialog.open();
        },

        onAddProduct: function () {
            var oModel = this.getView().getModel("manualOrder");
            var aProducts = oModel.getProperty("/products");

            aProducts.push({
                productName: "",
                quantity: 0,
                unit: "pcs"
            });

            oModel.setProperty("/products", aProducts);
        },

        onSaveManualOrder: function () {
            var oModel = this.getView().getModel("manualOrder");
            var oData = oModel.getData();

            // Validate required fields
            if (!oData.customerName || !oData.phone || !oData.pickupAddress ||
                !oData.deliveryAddress || !oData.pickupDate || !oData.deliveryDate) {
                sap.m.MessageBox.error("Please fill all required fields marked with *");
                return;
            }

            // Validate products
            var bValidProducts = oData.products.every(function (product) {
                return product.productName && product.quantity > 0;
            });

            if (!bValidProducts) {
                sap.m.MessageBox.error("Please fill all product details with valid quantities");
                return;
            }

            // Generate order ID
            var sOrderId = "CO-" + new Date().getFullYear() + "-" +
                String(Math.floor(Math.random() * 10000)).padStart(4, "0");

            // Create new order object
            var oNewOrder = {
                orderId: sOrderId,
                sourceIcon: "sap-icon://edit",
                sourceText: "Manual Entry",
                customerName: oData.customerName,
                customerEmail: oData.email,
                deliveryAddress: oData.deliveryAddress,
                productsCount: oData.products.length + " items",
                weight: oData.totalWeight + " kg",
                deliveryDate: this._formatDate(oData.deliveryDate),
                value: "$0", // Can be calculated based on products
                statusText: "Pending Review",
                statusState: "Warning",
                statusIcon: "sap-icon://pending",
                actionButtonText: "Review",
                actionButtonType: "Default",
                ocrConfidence: "Manual",
                // Store full data
                fullData: oData
            };

            // Add to orders list
            var oOrdersModel = this.getView().getModel("orders");
            var aOrders = oOrdersModel.getProperty("/ordersList");
            aOrders.unshift(oNewOrder); // Add to beginning

            // Update summary
            var oSummary = oOrdersModel.getProperty("/summary");
            oSummary.total++;
            oSummary.pendingReview++;

            oOrdersModel.refresh();

            // Show success message
            sap.m.MessageToast.show("Manual order created successfully: " + sOrderId);

            // Close dialog
            this._oManualOrderDialog.close();
        },

        onCancelManualOrder: function () {
            this._oManualOrderDialog.close();
        },

        _formatDate: function (sDate) {
            if (!sDate) return "";
            var oDate = new Date(sDate);
            var sDay = String(oDate.getDate()).padStart(2, "0");
            var sMonth = String(oDate.getMonth() + 1).padStart(2, "0");
            var sYear = oDate.getFullYear();
            return sDay + "/" + sMonth + "/" + sYear;
        },

        // If you want to edit an existing order, add this method
        onEditOrder: function (oEvent) {
            var oItem = oEvent.getSource().getBindingContext("orders").getObject();

            // Load existing order data into the model
            var oManualOrderModel = new sap.ui.model.json.JSONModel(oItem.fullData || {
                customerName: oItem.customerName,
                email: oItem.customerEmail,
                phone: "",
                pickupAddress: "",
                deliveryAddress: oItem.deliveryAddress,
                products: [{
                    productName: "",
                    quantity: 0,
                    unit: "pcs"
                }],
                pickupDate: null,
                deliveryDate: oItem.deliveryDate,
                totalWeight: 0,
                volume: 0,
                specialInstructions: ""
            });

            this.getView().setModel(oManualOrderModel, "manualOrder");

            // Store the order being edited
            this._editingOrderId = oItem.orderId;

            // Open dialog
            if (!this._oManualOrderDialog) {
                this._oManualOrderDialog = sap.ui.xmlfragment(
                    "intellicarrier.view.ManualFreightOrder",
                    this
                );
                this.getView().addDependent(this._oManualOrderDialog);
            }

            this._oManualOrderDialog.setTitle("Edit Freight Order");
            this._oManualOrderDialog.open();
        },

        // Dashboard handlers
        onNotificationPress: function () {
            MessageToast.show("You have 3 new notifications");
        },

        //--Dashboard formater status
        formatStateStatus: function (sStatus) {
            if (sStatus === "Delivered") {
                return "Success";
            }
            else if (sStatus === "In Transit") {
                return "Warning";
            }
            else {
                return "Error";
            }
        },

        //-- dashboard search.
        onLiveSearch: function (oEvent) {
            let sQuery = oEvent.getParameter("newValue");
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
            this.selectedInputId = oEvent.getParameter("id");

            if (!this._ItemsDialog) {
                this._ItemsDialog = this.loadFragment("intellicarrier.view.LocationValueHelpDialog");
            }
            this._ItemsDialog.then(function (oDialog) {
                oDialog.open();
            });
            this.byId("selectOriginDialog").getBinding("items").filter([]);

        },
        onValueHelpSearch: function (oEvent) {
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
        onOriginSelection: function (oEvent) {
            let oSelectedobject = oEvent.getParameter("listItem").mProperties.title;
            if (this.selectedInputId.includes("originInput")) {
                this.byId("originInput").setValue(oSelectedobject);
                MessageToast.show("Origin Selected Successfully");

            } else if (this.selectedInputId.includes("destinationInput")) {
                this.byId("destinationInput").setValue(oSelectedobject);
                MessageToast.show("Destination Selected Successfully");

            } else if (this.selectedInputId.includes("originShipmentInput")) {
                this.byId("originShipmentInput").setValue(oSelectedobject);
                MessageToast.show("Origin Selected Successfully");

            } else if (this.selectedInputId.includes("destinationShipmentInput")) {
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
        onBookShipment1: function () {
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

        _createNewBooking1: function (sCustomer, sOrigin, sDestination, oVehicle) {
            var sNewId = "SHP-2026-00" + (1243 + Math.floor(Math.random() * 100));

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
            var oVehicleToUpdate = aFleet.find(function (v) { return v.id === oVehicle.id; });
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
                            var iIndex = aBookedShipments.findIndex(function (s) { return s.id === oShipment.id; });

                            if (iIndex > -1) {
                                aBookedShipments.splice(iIndex, 1);
                                oModel.setProperty("/bookedShipments", aBookedShipments);

                                // Update vehicle status back to Available
                                var aFleet = oModel.getProperty("/availableFleet");
                                var oVehicleToUpdate = aFleet.find(function (v) { return v.id === oShipment.vehicleId; });
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

        onViewShipmentDetails: function (oEvent) {
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

        onBackToShipmentsList: function () {
            // Hide the detailed tracking view
            this.byId("detailedTrackingView").setVisible(false);

            // Show the shipments list view
            this.byId("shipmentsListView").setVisible(true);

            // Clear tracking input if exists
            if (this.byId("trackingNumberInput")) {
                this.byId("trackingNumberInput").setValue("");
            }
        },

        onQuickTrack: function () {
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
            this.onViewShipmentDetails({ getSource: function () { return { getBindingContext: function () { return null; } }; } });
        },

        onSearchShipments: function (oEvent) {
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

        onRefreshShipments: function () {
            MessageToast.show("Shipments refreshed");
        },

        onPrintTrackingReport: function () {
            MessageToast.show("Printing tracking report...");
            window.print();
        },

        onShareTracking: function () {
            var sTrackingNumber = "SHP-2026-001234"; // Default or get from input
            var sShareUrl = window.location.origin + window.location.pathname + "?tracking=" + sTrackingNumber;

            if (navigator.share) {
                navigator.share({
                    title: 'IntelliCarrier - Shipment Tracking',
                    text: 'Track shipment: ' + sTrackingNumber,
                    url: sShareUrl,
                });
            } else {
                navigator.clipboard.writeText(sShareUrl).then(function () {
                    MessageToast.show("Tracking URL copied to clipboard");
                });
            }
        },

        onShipmentSelect: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            if (oSelectedItem) {
                this.onViewShipmentDetails({ getSource: function () { return oSelectedItem; } });
            }
        },

        onContactCustomer: function () {
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
                    id: "SHP-2026-001234",
                    customer: "Acme Corporation",
                    destination: "New York, NY",
                    service: "Express",
                    status: "In Transit",
                    statusState: "Warning",
                    eta: "2026-01-15"
                },
                {
                    id: "SHP-2026-001233",
                    customer: "Global Tech Inc",
                    destination: "Los Angeles, CA",
                    service: "Standard",
                    status: "Delivered",
                    statusState: "Success",
                    eta: "2026-01-14"
                },
                {
                    id: "SHP-2026-001232",
                    customer: "Smart Solutions",
                    destination: "Chicago, IL",
                    service: "Overnight",
                    status: "Processing",
                    statusState: "Information",
                    eta: "2026-01-16"
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
                    lastMaintenance: "2026-01-10",
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
                    lastMaintenance: "2026-01-08",
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
                    lastMaintenance: "2026-01-12",
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
                    lastMaintenance: "2026-01-09",
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
                    lastMaintenance: "2026-01-13",
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
                    lastMaintenance: "2026-01-11",
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
                    lastMaintenance: "2026-01-07",
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
                    lastMaintenance: "2026-01-12",
                    statusState: "Success"
                }
            ];
        },

        // NEW: Booked Shipments Mock Data
        _getMockBookedShipments: function () {
            return [
                {
                    id: "SHP-2026-001240",
                    vehicleId: "TRK-003",
                    vehicleType: "Standard Truck",
                    customer: "Tech Industries",
                    origin: "Houston, TX",
                    destination: "Austin, TX",
                    loadDate: "2026-01-16",
                    deliveryDate: "2026-01-17",
                    driver: "Mike Wilson",
                    status: "Scheduled",
                    statusState: "Information",
                    cargo: "Electronics",
                    weight: "8.5 tons"
                },
                {
                    id: "SHP-2026-001241",
                    vehicleId: "CNT-047",
                    vehicleType: "Container",
                    customer: "Global Manufacturing",
                    origin: "Dallas, TX",
                    destination: "Phoenix, AZ",
                    loadDate: "2026-01-15",
                    deliveryDate: "2026-01-18",
                    driver: "Sarah Davis",
                    status: "In Transit",
                    statusState: "Warning",
                    cargo: "Industrial Equipment",
                    weight: "22 tons"
                },
                {
                    id: "SHP-2026-001242",
                    vehicleId: "TNK-015",
                    vehicleType: "Oil Tanker",
                    customer: "Energy Solutions",
                    origin: "Refinery B",
                    destination: "Distribution Center",
                    loadDate: "2026-01-14",
                    deliveryDate: "2026-01-16",
                    driver: "David Brown",
                    status: "Loading",
                    statusState: "Warning",
                    cargo: "Petroleum Products",
                    weight: "12,000 gallons"
                },
                {
                    id: "SHP-2026-001243",
                    vehicleId: "TRK-009",
                    vehicleType: "Heavy Duty Truck",
                    customer: "Construction Corp",
                    origin: "San Antonio, TX",
                    destination: "El Paso, TX",
                    loadDate: "2026-01-17",
                    deliveryDate: "2026-01-19",
                    driver: "James Miller",
                    status: "Scheduled",
                    statusState: "Information",
                    cargo: "Construction Materials",
                    weight: "14 tons"
                }
            ];
        },
        onshipmentExecutionViewselectionChange: function (oEvent) {
            debugger
            if (oEvent.getParameters("item").item.getProperty("key") === "FleetOverview") {
                this.byId("shipmentExecutionViewsub").setVisible(false)
                this.byId("shipmentExecutionViewsub2").setVisible(true)

            }
            else {
                this.byId("shipmentExecutionViewsub").setVisible(true)
                this.byId("shipmentExecutionViewsub2").setVisible(false)
            }

        },
        onFleetCockpitTabSelect: function (oEvent) {
            var sSelectedKey = oEvent.getParameter("key");
            var oTable = this.byId("ordersTable");
            var oBinding = oTable.getBinding("items");

            var aFilters = [];

            switch (sSelectedKey) {

                case "PendingAssignment":
                    aFilters.push(
                        new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "Pending Assignment")
                    );
                    break;

                case "Assigned":
                    aFilters.push(
                        new sap.ui.model.Filter({
                            filters: [
                                new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "Internal Fleet"),
                                new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "External Carrier")
                            ],
                            and: false
                        })
                    );
                    break;

                case "InTransist":
                    aFilters.push(
                        new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "In Transit")
                    );
                    break;

                case "Completed":
                    aFilters.push(
                        new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "Completed")
                    );
                    break;

                default:
                    // no filter
                    break;
            }

            oBinding.filter(aFilters);
        },
        onAnalyzeOrder: function (oEvent) {
            debugger
            var oOrder = oEvent.getSource().getBindingContext().getObject();
            if (!this._oFleetDialog) {
                this._oFleetDialog = this.loadFragment("intellicarrier.view.FleetCockpitAnalysis");
            }

            var oOrderModel = new sap.ui.model.json.JSONModel(oOrder);
            this.getView().setModel(oOrderModel, "selectedOrder");

            this._oFleetDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onBookShipment: function () {
            var oView = this.getView();

            // Selected Order (from Analyze dialog)
            var oSelectedOrder = oView.getModel("selectedOrder")?.getData();

            // Selected Vehicle / Carrier (from selection logic)
            var oSelectedVehicle = oView.getModel("selectionModel").getData();

            if (!oSelectedOrder) {
                sap.m.MessageBox.error("No order selected for booking.");
                return;
            }
            if (!oSelectedVehicle) {
                sap.m.MessageBox.error("No Carrier is Selected for booking.");
                return;
            }


            // Extract order details
            var sCustomer = oSelectedOrder.customer;
            var sOrigin = oSelectedOrder.from;
            var sDestination = oSelectedOrder.to;
            var sDeliveryDate = oSelectedOrder.deliveryDate;
            var sCargoInfo = oSelectedOrder.cargoInfo;
            var sOrderId = oSelectedOrder.orderId;

            // Vehicle / Carrier details
            var sVehicleName = oSelectedVehicle.text
            // Confirmation message
            var sMessage =
                "Confirm booking for the following shipment?\n\n" +
                "Order ID: " + sOrderId + "\n" +
                "Customer: " + sCustomer + "\n" +
                "Route: " + sOrigin + " → " + sDestination + "\n" +
                "Cargo: " + sCargoInfo + "\n" +
                "Delivery Date: " + sDeliveryDate + "\n\n" +
                "Assigned: " + sVehicleName

            sap.m.MessageBox.confirm(sMessage, {
                title: "Confirm Shipment Booking",
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.OK) {
                        this._createNewBooking(oSelectedOrder, oSelectedVehicle);
                    }
                }.bind(this)
            });
        },
        _createNewBooking: function (oOrder, oVehicle) {
            console.log("Booking Created", {
                order: oOrder,
                vehicle: oVehicle
            });

            sap.m.MessageToast.show(
                "Shipment " + oOrder.orderId + " booked successfully"
            );
        },

        onCloseFleetCockpit: function () {

            this._oFleetDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        onConformpres: function () {
            this.onCloseFleetCockpit();
            this.onBookShipment();
        },
        onTrackOrder: function () {
            var oFakeEvent = {
                getParameter: function (sName) {
                    if (sName === "item") {
                        return {
                            getKey: function () {
                                return "tracking";
                            }
                        };
                    }
                }
            };

            this.onItemSelect(oFakeEvent);
        },
        onCarrierListSelected: function (oEvent) {
            var oItem = oEvent.getParameter("listItem");
            if (!oItem) {
                return;
            }

            var oVBox = oItem.getContent()[0]; // VBox inside CustomListItem
            var aItems = oVBox.getItems();

            // Title (first Text)
            var sTitle = aItems[0].getText();

            // Find price (Text with sapUiPositiveText)
            var sPrice = "";
            aItems.forEach(function (oCtrl) {
                if (oCtrl.hasStyleClass && oCtrl.hasStyleClass("sapUiPositiveText")) {
                    sPrice = oCtrl.getText();
                }
            });

            // Update model
            var oModel = this.getView().getModel("selectionModel");
            oModel.setProperty("/visible", true);
            oModel.setProperty("/text", sTitle);
            oModel.setProperty("/price", sPrice);
        },




        //===============Chandan's code

        _openPreviewDialog: function (sType, oData, sTitle) {
            var oView = this.getView();

            // Create preview model
            var oPreviewModel = new JSONModel({
                type: sType,
                title: sTitle,
                data: oData
            });

            oView.setModel(oPreviewModel, "previewModel");

            // Load dialog if not already loaded
            if (!this._oPreviewDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "intellicarrier.view.DocumentPreview",
                    controller: this
                }).then(function (oDialog) {
                    this._oPreviewDialog = oDialog;
                    oView.addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            } else {
                this._oPreviewDialog.open();
            }
        },

        onClosePreview: function () {
            if (this._oPreviewDialog) {
                this._oPreviewDialog.close();
            }
        },

        onPreviewLabel: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("logistics");
            var oShipment = oContext.getObject();

            this._openPreviewDialog("label", oShipment, "Shipping Label - " + oShipment.id);
        },

        onPrintLabel: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("logistics");
            var oShipment = oContext.getObject();
            // MessageToast.show("Printing label for " + oShipment.id);
            // Update status to 'printed'
            var oModel = this.getView().getModel();
            var sPath = oContext.getPath();
            oModel.setProperty(sPath + "/status", "printed");
            this._openPreviewDialog("label", oShipment, "Shipping Label - " + oShipment.id);
        },

        onBOLPress: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("logistics");
            var oBOL = oContext.getObject();

            MessageBox.information("BOL Details:\n\n" +
                "BOL No: " + oBOL.id + "\n" +
                "Shipment: " + oBOL.shipmentId + "\n" +
                "Shipper: " + oBOL.shipper + "\n" +
                "Consignee: " + oBOL.consignee
            );
        },

        onPreviewBOL: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("logistics");
            var oBOL = oContext.getObject();

            this._openPreviewDialog("bol", oBOL, "Bill of Lading - " + oBOL.id);
        },

        onPrintBOL: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("logistics");
            var oBOL = oContext.getObject();

            MessageToast.show("Printing BOL: " + oBOL.id);
        },

        onEditBOL: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("logistics");
            var oBOL = oContext.getObject();

            MessageToast.show("Editing BOL: " + oBOL.id);
        },



        /**
         * Handler for selecting rate type
         */
        onSelectRateType: function (oEvent) {
            const rateType = oEvent.getSource().data("rateType");
            const model = this.getView().getModel();
            const newRate = model.getProperty("/newRate");

            // Update rate type
            newRate.type = rateType;
            model.setProperty("/newRate", newRate);

            // Generate appropriate ID
            const prefixes = {
                customer: "RA",
                route: "RR",
                carrier: "CR",
                surcharge: "SR"
            };
            newRate.id = this._generateRateId(prefixes[rateType]);
            model.setProperty("/newRate/id", newRate.id);

            // Show/hide sections based on rate type
            const basicInfoSection = sap.ui.core.Fragment.byId("intellicarrier.view.AddRateDialog", "basicInfoSection");
            const routeSection = sap.ui.core.Fragment.byId("intellicarrier.view.AddRateDialog", "routeSection");
            const pricingSection = sap.ui.core.Fragment.byId("intellicarrier.view.AddRateDialog", "pricingSection");
            const surchargesSection = sap.ui.core.Fragment.byId("intellicarrier.view.AddRateDialog", "surchargesSection");
            const serviceTypesSection = sap.ui.core.Fragment.byId("intellicarrier.view.AddRateDialog", "serviceTypesSection");
            const notesSection = sap.ui.core.Fragment.byId("intellicarrier.view.AddRateDialog", "notesSection");

            const customerLabel = sap.ui.core.Fragment.byId("intellicarrier.view.AddRateDialog", "customerLabel");
            const customerSelect = sap.ui.core.Fragment.byId("intellicarrier.view.AddRateDialog", "customerSelect");
            const carrierLabel = sap.ui.core.Fragment.byId("intellicarrier.view.AddRateDialog", "carrierLabel");
            const carrierSelect = sap.ui.core.Fragment.byId("intellicarrier.view.AddRateDialog", "carrierSelect");

            // Show all relevant sections
            basicInfoSection.setVisible(true);
            pricingSection.setVisible(rateType !== "surcharge");
            surchargesSection.setVisible(true);
            serviceTypesSection.setVisible(true);
            notesSection.setVisible(true);

            // Show/hide customer vs carrier fields
            if (rateType === "customer") {
                customerLabel.setVisible(true);
                customerSelect.setVisible(true);
                carrierLabel.setVisible(false);
                carrierSelect.setVisible(false);
                routeSection.setVisible(false);
            } else if (rateType === "carrier") {
                customerLabel.setVisible(false);
                customerSelect.setVisible(false);
                carrierLabel.setVisible(true);
                carrierSelect.setVisible(true);
                routeSection.setVisible(false);
            } else if (rateType === "route") {
                customerLabel.setVisible(false);
                customerSelect.setVisible(false);
                carrierLabel.setVisible(false);
                carrierSelect.setVisible(false);
                routeSection.setVisible(true);
            } else {
                customerLabel.setVisible(false);
                customerSelect.setVisible(false);
                carrierLabel.setVisible(false);
                carrierSelect.setVisible(false);
                routeSection.setVisible(false);
            }
        },

        /**
         * Generate unique rate ID
         */
        _generateRateId: function (prefix) {
            const year = new Date().getFullYear();
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            return `${prefix}-NEW-${year}-${random}`;
        },


        _validateRate: function (rate) {
            if (!rate.name) {
                sap.m.MessageBox.error("Please enter an agreement name");
                return false;
            }

            if (rate.type === "customer" && !rate.customerId) {
                sap.m.MessageBox.error("Please select a customer");
                return false;
            }

            if (rate.type === "carrier" && !rate.carrierId) {
                sap.m.MessageBox.error("Please select a carrier");
                return false;
            }

            if (rate.type === "route" && (!rate.originZone || !rate.destZone)) {
                sap.m.MessageBox.error("Please select origin and destination zones");
                return false;
            }

            if (!rate.validFrom || !rate.validTo) {
                sap.m.MessageBox.error("Please specify validity period");
                return false;
            }

            return true;
        },




        onAddRatePress: function () {

             // Load dialog if not already loaded
            if (!this._oPreviewDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "intellicarrier.view.AddRateDialog",
                    controller: this
                }).then(function (oDialog) {
                    this._oPreviewDialog = oDialog;
                    oView.addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            } else {
                this._oPreviewDialog.open();
            }

            if (!this._addRateDialog) {
                sap.ui.core.Fragment.load({
                    id: this.getView().getId(),
                    name: "intellicarrier.view.AddRateDialog",
                    controller: this
                }).then(function (oDialog) {
                    this._addRateDialog = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            } else {
                this._addRateDialog.open();
            }

            const newRateModel = new sap.ui.model.json.JSONModel({
                newRate: {
                    id: this._generateRateId("RA"),
                    type: "",
                    name: "",
                    customerId: "",
                    carrierId: "",
                    baseKm: 18.5,
                    weightKg: 2.0,
                    fuel: 8.5,
                    discount: 5.0,
                    markup: 0,
                    minCharge: 500,
                    validFrom: new Date().toISOString().split("T")[0],
                    validTo: new Date(
                        new Date().setFullYear(new Date().getFullYear() + 1)
                    ).toISOString().split("T")[0],
                    status: "ACTIVE",
                    currency: "THB",
                    notes: "",
                    termsRef: "",
                    serviceTypes: []
                }
            });

            this.getView().setModel(newRateModel);
        },
        onCloseAddDialog: function () {
            if (this._addRateDialog) {
                this._addRateDialog.close();
            }
        },
        // onViewRatePress: function (oEvent) {
        //     const bindingContext = oEvent.getSource().getBindingContext("RateMasterData");
        //     const rateData = bindingContext.getObject();

        //     sap.m.MessageBox.information(
        //         `Rate ID: ${rateData.id}\nName: ${rateData.name}\nBase Rate: ฿${rateData.baseKm}/km\nWeight Rate: ฿${rateData.weightKg}/kg\nStatus: ${rateData.status}`,
        //         {
        //             title: "Rate Details"
        //         }
        //     );
        // },
        onViewRatePress: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext("RateMasterData");

            if (!this._oRateDialog) {
                this._oRateDialog = sap.ui.xmlfragment(
                    "intellicarrier.view.RateDetailsDialog",
                    this
                );
                this.getView().addDependent(this._oRateDialog);
            }

            this._oRateDialog.setBindingContext(oContext, "RateMasterData");
            this._oRateDialog.open();
        },


        onCloseRateDialog: function () {
            if (this._oRateDialog) {
                this._oRateDialog.close();
            }
        },

        /**
         * Handler for editing rate
         */
        onEditRatePress: function (oEvent) {
            sap.m.MessageToast.show("Edit functionality to be implemented");
        },

        /**
         * Handler for duplicating rate
         */
        onDuplicateRatePress: function (oEvent) {
            sap.m.MessageToast.show("Duplicate functionality to be implemented");
        },

        /**
         * Handler for rate selection
         */
        onRateSelect: function (oEvent) {
            const selectedItem = oEvent.getParameter("listItem");
            if (selectedItem) {
                const bindingContext = selectedItem.getBindingContext("RateMasterData");
                const rateData = bindingContext.getObject();
                console.log("Selected rate:", rateData);
            }
        },










        formatter: {
            // Rate Type Formatters
            getRateTypeIcon: function (type) {
                const icons = {
                    customer: "sap-icon://customer",
                    route: "sap-icon://map-2",
                    carrier: "sap-icon://supplier",
                    surcharge: "sap-icon://money-bills"
                };
                return icons[type] || "sap-icon://document";
            },

            getRateTypeColor: function (type) {
                const colors = {
                    customer: "#2e7d32",
                    route: "#e65100",
                    carrier: "#1565c0",
                    surcharge: "#c2185b"
                };
                return colors[type] || "#6a6d70";
            },

            getRateTypeText: function (type) {
                const texts = {
                    customer: "Customer",
                    route: "Route",
                    carrier: "Carrier",
                    surcharge: "Surcharge"
                };
                return texts[type] || type;
            },

            getRateTypeState: function (type) {
                const states = {
                    customer: "Success",
                    route: "Warning",
                    carrier: "Information",
                    surcharge: "Error"
                };
                return states[type] || "None";
            },  // Status Formatters
            getStatusText: function (status) {
                const texts = {
                    ACTIVE: "✅ Active",
                    EXPIRING: "⚠️ Expiring",
                    EXPIRED: "❌ Expired",
                    DRAFT: "📝 Draft",
                    PENDING_APPROVAL: "⏳ Pending"
                };
                return texts[status] || status;
            },

            getStatusState: function (status) {
                const states = {
                    ACTIVE: "Success",
                    EXPIRING: "Warning",
                    EXPIRED: "Error",
                    DRAFT: "Information",
                    PENDING_APPROVAL: "None"
                };
                return states[status] || "None";
            },

            // Format Currency
            formatCurrency: function (value) {
                if (!value || value === 0) return "-";
                return parseFloat(value).toFixed(2);
            },

            // Format Date
            formatDate: function (date) {
                if (!date) return "";
                const d = new Date(date);
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                return d.toLocaleDateString('en-US', options);
            }
        },




    });
});