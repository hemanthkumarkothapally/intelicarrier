sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/VBox",
    "sap/m/Text",
    "sap/m/Label",
    "sap/ui/core/Icon"
], function (Controller, MessageToast, MessageBox, JSONModel, Filter, FilterOperator, Fragment, VBox, Text, Label, Icon) {
    "use strict";

    return Controller.extend("intellicarrier.controller.Home", {

        onInit: function () {

this.selectedTiletype;
            // Initialize tracking data model
            var oTrackingData = {
                events: [],
                newEvent: {
                    status: "",
                    statusText: "",
                    date: "",
                    time: "",
                    location: "",
                    notes: ""
                }
            };

            var oModel = new JSONModel(oTrackingData);
            this.getView().setModel(oModel, "trackingModel");

            // Icon and color mapping for different statuses
            this.statusConfig = {
                "pickup": {
                    icon: "sap-icon://inventory",
                    iconColor: "#2196F3",
                    stepId: "step1"
                },
                "intransit": {
                    icon: "sap-icon://shipping-status",
                    iconColor: "#FF9800",
                    stepId: "step2"
                },
                "processing": {
                    icon: "sap-icon://process",
                    iconColor: "#9C27B0",
                    stepId: "step3"
                },
                "outfordelivery": {
                    icon: "sap-icon://employee",
                    iconColor: "#4CAF50",
                    stepId: "step4"
                },
                "delivered": {
                    icon: "sap-icon://complete",
                    iconColor: "#4CAF50",
                    stepId: "step5"
                }
            };


            var oDriverModel = new sap.ui.model.json.JSONModel({
                selectedDriverId: "",
                driverDetails: "",
                cost: {
                    base: "",
                    fuel: "",
                    surcharge: "",
                    serviceFee: "",
                    total: ""
                }
            });

            this.getView().setModel(oDriverModel, "driverModel");
            var oFormModel = new JSONModel({
                productType: "",
                routeCode: "",

                distance: "",
                duration: "",
                baseRate: "",
                zlsdeScreen: ""
            });

            this.getView().setModel(oFormModel, "formModel");
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
                        sphId: "8062225001",
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
                ],


                cashAdvanceRequests: [
                    {
                        requestId: "REQ-2026-0006",
                        driver: "Somchai Prasert",
                        driverId: "DRV-001",
                        amount: "฿5,000",
                        purpose: "Trip Expenses",
                        requestDate: "2026-01-13",
                        status: "Pending",
                        statusState: "Warning",
                        disbursement: "-"
                    },
                    {
                        requestId: "REQ-2026-0007",
                        driver: "Wichai Thongsuk",
                        driverId: "DRV-002",
                        amount: "฿8,000",
                        purpose: "Trip Expenses",
                        requestDate: "2026-01-13",
                        status: "Pending",
                        statusState: "Warning",
                        disbursement: "-"
                    },
                    {
                        requestId: "REQ-2026-0008",
                        driver: "Narong Somjai",
                        driverId: "DRV-003",
                        amount: "฿3,500",
                        purpose: "Fuel Only",
                        requestDate: "2026-01-13",
                        status: "Pending",
                        statusState: "Warning",
                        disbursement: "-"
                    },
                    {
                        requestId: "REQ-2026-0009",
                        driver: "Prasit Wongchai",
                        driverId: "DRV-005",
                        amount: "฿6,000",
                        purpose: "Trip Expenses",
                        requestDate: "2026-01-12",
                        status: "Pending",
                        statusState: "Warning",
                        disbursement: "-"
                    },
                    {
                        requestId: "REQ-2026-0010",
                        driver: "Surachai Pranee",
                        driverId: "DRV-006",
                        amount: "฿10,000",
                        purpose: "Trip Expenses",
                        requestDate: "2026-01-12",
                        status: "Pending",
                        statusState: "Warning",
                        disbursement: "-"
                    },
                    {
                        requestId: "REQ-2026-0005",
                        driver: "Somchai Prasert",
                        driverId: "DRV-001",
                        amount: "฿8,000",
                        purpose: "Trip Expenses",
                        requestDate: "2026-01-10",
                        status: "Disbursed",
                        statusState: "Success",
                        disbursement: "Bank"
                    },
                    {
                        requestId: "REQ-2026-0004",
                        driver: "Wichai Thongsuk",
                        driverId: "DRV-002",
                        amount: "฿5,000",
                        purpose: "Fuel",
                        requestDate: "2026-01-09",
                        status: "Disbursed",
                        statusState: "Success",
                        disbursement: "PromptPay"
                    }
                ],
                activeAdvances: [
                    {
                        advanceId: "ADV-2026-0001",
                        driver: "Somchai Prasert",
                        driverId: "DRV-001",
                        advance: "฿8,000",
                        expenses: "฿5,850",
                        remaining: "฿2,150",
                        usagePercent: 73,
                        usageState: "Success",
                        days: "3d",
                        status: "Active",
                        statusState: "Success"
                    },
                    {
                        advanceId: "ADV-2026-0002",
                        driver: "Wichai Thongsuk",
                        driverId: "DRV-002",
                        advance: "฿5,000",
                        expenses: "฿4,200",
                        remaining: "฿800",
                        usagePercent: 84,
                        usageState: "Warning",
                        days: "4d",
                        status: "Active",
                        statusState: "Success"
                    },
                    {
                        advanceId: "ADV-2026-0003",
                        driver: "Prasit Wongchai",
                        driverId: "DRV-005",
                        advance: "฿6,500",
                        expenses: "฿6,500",
                        remaining: "฿0",
                        usagePercent: 100,
                        usageState: "Warning",
                        days: "5d",
                        status: "Ready",
                        statusState: "Information"
                    },
                    {
                        advanceId: "ADV-2026-0004",
                        driver: "Surachai Pranee",
                        driverId: "DRV-006",
                        advance: "฿10,000",
                        expenses: "฿3,200",
                        remaining: "฿6,800",
                        usagePercent: 32,
                        usageState: "Success",
                        days: "2d",
                        status: "Active",
                        statusState: "Success"
                    },
                    {
                        advanceId: "ADV-2026-0005",
                        driver: "Narong Somjai",
                        driverId: "DRV-003",
                        advance: "฿4,500",
                        expenses: "฿5,100",
                        remaining: "-฿600",
                        usagePercent: 113,
                        usageState: "Error",
                        days: "6d",
                        status: "Overspent",
                        statusState: "Error"
                    }
                ],
                expenseSubmissions: [
                    {
                        expenseId: "EXP-0045",
                        driver: "Somchai Prasert",
                        driverId: "DRV-001",
                        category: "Fuel",
                        categoryIcon: "sap-icon://gas-station",
                        vendor: "Shell #1234",
                        amount: "฿2,450",
                        date: "2026-01-11",
                        ocrStatus: "Verified",
                        ocrState: "Success",
                        validationStatus: "Passed",
                        validationState: "Success"
                    },
                    {
                        expenseId: "EXP-0046",
                        driver: "Somchai Prasert",
                        driverId: "DRV-001",
                        category: "Toll",
                        categoryIcon: "sap-icon://road",
                        vendor: "E-ZPass Toll",
                        amount: "฿350",
                        date: "2026-01-11",
                        ocrStatus: "Verified",
                        ocrState: "Success",
                        validationStatus: "Passed",
                        validationState: "Success"
                    },
                    {
                        expenseId: "EXP-0047",
                        driver: "Wichai Thongsuk",
                        driverId: "DRV-002",
                        category: "Fuel",
                        categoryIcon: "sap-icon://gas-station",
                        vendor: "PTT Rangsit",
                        amount: "฿1,850",
                        date: "2026-01-12",
                        ocrStatus: "Verified",
                        ocrState: "Success",
                        validationStatus: "Passed",
                        validationState: "Success"
                    },
                    {
                        expenseId: "EXP-0048",
                        driver: "Narong Somjai",
                        driverId: "DRV-003",
                        category: "Meal",
                        categoryIcon: "sap-icon://meal",
                        vendor: "Restaurant",
                        amount: "฿450",
                        date: "2026-01-12",
                        ocrStatus: "Review",
                        ocrState: "Warning",
                        validationStatus: "Warning",
                        validationState: "Warning"
                    },
                    {
                        expenseId: "EXP-0049",
                        driver: "Prasit Wongchai",
                        driverId: "DRV-005",
                        category: "Parking",
                        categoryIcon: "sap-icon://parking",
                        vendor: "Central Parking",
                        amount: "฿280",
                        date: "2026-01-12",
                        ocrStatus: "Processing",
                        ocrState: "Information",
                        validationStatus: "Pending",
                        validationState: "Information"
                    }
                ],
                reconciliationQueue: [
                    {
                        advanceId: "ADV-0003",
                        driver: "Prasit Wongchai",
                        driverId: "DRV-005",
                        advance: "฿6,500",
                        expenses: "฿6,500",
                        balance: "฿0",
                        settlementType: "Zero",
                        settlementState: "Information",
                        issues: "None",
                        issuesState: "Success"
                    },
                    {
                        advanceId: "ADV-0005",
                        driver: "Narong Somjai",
                        driverId: "DRV-003",
                        advance: "฿4,500",
                        expenses: "฿5,100",
                        balance: "-฿600",
                        settlementType: "Reimburse",
                        settlementState: "Warning",
                        issues: "1",
                        issuesState: "Warning"
                    },
                    {
                        advanceId: "ADV-0006",
                        driver: "Anuchit Ploykaew",
                        driverId: "DRV-007",
                        advance: "฿3,000",
                        expenses: "฿2,100",
                        balance: "+฿900",
                        settlementType: "Refund",
                        settlementState: "Success",
                        issues: "None",
                        issuesState: "Success"
                    }
                ],
                completedSettlements: [
                    {
                        settlementId: "STL-0023",
                        driver: "Somchai Prasert",
                        advance: "฿6,000",
                        expenses: "฿5,800",
                        settlement: "-฿200",
                        type: "Refund",
                        typeState: "Success",
                        date: "2026-01-08",
                        sapDoc: "FI-00456"
                    },
                    {
                        settlementId: "STL-0022",
                        driver: "Wichai Thongsuk",
                        advance: "฿4,000",
                        expenses: "฿4,350",
                        settlement: "+฿350",
                        type: "Reimburse",
                        typeState: "Warning",
                        date: "2026-01-07",
                        sapDoc: "FI-00445"
                    },
                    {
                        settlementId: "STL-0021",
                        driver: "Narong Somjai",
                        advance: "฿5,500",
                        expenses: "฿5,500",
                        settlement: "฿0",
                        type: "Zero",
                        typeState: "Information",
                        date: "2026-01-06",
                        sapDoc: "FI-00432"
                    }
                ],
                "tiers": [
                    {
                        "minWeight": 0,
                        "maxWeight": 100,
                        "cost": 2.50
                    },
                    {
                        "minWeight": 101,
                        "maxWeight": 500,
                        "cost": 2.00
                    },
                    {
                        "minWeight": 501,
                        "maxWeight": 1000,
                        "cost": 1.50
                    }
                ],



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
            if (!this._oFleetDialog) {
                this._oFleetDialog = this.loadFragment("intellicarrier.view.FleetCockpitAnalysis");
            }
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
            this.byId("CashAdvanceandReimbursement").setVisible(false);
            this.byId("vehicleChecklist").setVisible(false);
            this.byId("gateLogs").setVisible(false);




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
                case "vehicleChecklist":
                    this.byId("vehicleChecklist").setVisible(true);
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
                case "CashAdvanceandReimbursement":
                    this.byId("CashAdvanceandReimbursement").setVisible(true);
                    break
                case "gateLogs":
                    this.byId("gateLogs").setVisible(true);
                    break
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

        onManualEntryFreight: function (oExtractedData) {
            if (oExtractedData && oExtractedData.getSource) {
                oExtractedData = null;
            }

            var oManualOrderModel = new sap.ui.model.json.JSONModel(
                oExtractedData || {
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
                }
            );

            this.getView().setModel(oManualOrderModel, "manualOrder");

            if (!this._oManualOrderDialog) {
                this._oManualOrderDialog = this.loadFragment("intellicarrier.view.ManualFreightOrder");
            }
            this._oManualOrderDialog.then(function (oDialog) {
                oDialog.open();

                // ✅ Wait until dialog is rendered
                oDialog.attachAfterOpen(function () {
                    this.onCompartmentChange();
                }.bind(this));
            }.bind(this));
        },
        onManualEntryFreight1: function () {
            if (!this._oManualOrderDialog1) {
                this._oManualOrderDialog1 = this.loadFragment("intellicarrier.view.CreateFreightOrderChannel");
            }
            this._oManualOrderDialog1.then(function (oDialog) {
                oDialog.open();
            });
            this.byId("companyCB").setSelectedKey("");
            this.byId("productCB").setSelectedKey("");
            this.onSelectionChange();

        },
        onCloseChannelDialog: function () {
            this._oManualOrderDialog1.then(function (oDialog) {
                oDialog.close();
            });
        },
        onSelectionChange: function () {
            const oCompanyCB = this.byId("companyCB");
            const oProductCB = this.byId("productCB");

            const sCompany = oCompanyCB.getSelectedKey();
            const sProduct = oProductCB.getSelectedKey();

            const aItems = oProductCB.getItems();

            // If company changed → reset product & filter
            if (oCompanyCB === sap.ui.getCore().byId(oCompanyCB.getId())) {
                oProductCB.setSelectedKey("");
                oProductCB.setEnabled(!!sCompany);

                // Hide all items first
                aItems.forEach(function (oItem) {
                    oItem.setEnabled(false);
                });

                let aAllowed = [];
                switch (sCompany) {
                    case "SCC":
                        aAllowed = ["LPG", "CHEM", "FUEL", "NGV"];
                        break;
                    case "SCA":
                        aAllowed = ["CAR"];
                        break;
                    case "SPL":
                        aAllowed = ["CONT"];
                        break;
                }

                // Show only allowed items
                aItems.forEach(function (oItem) {
                    if (aAllowed.includes(oItem.getKey())) {
                        oItem.setEnabled(true);
                    }
                });
            }
            [
                "tilePdf",
                "tileStandardForm",
                "tileLineMessage",
                "tileEmail",
                "tileTms",
                "tileManual",
                "tileExcel",
                "tileForecast"
            ].forEach(id => this.byId(id).setVisible(false));
            // ✅ SINGLE SOURCE OF TRUTH
            const bShowFlex = !!oCompanyCB.getSelectedKey() && !!sProduct;
            var oChannelSelectionModel = new sap.ui.model.json.JSONModel(
                {
                    company: sCompany,
                    product: sProduct
                });
            this.getView().setModel(oChannelSelectionModel, "ChannelSelectionModel");
            if (bShowFlex) {
                if (sCompany === "SPL" && sProduct === "CONT") {
                    this.byId("tileManual").setVisible(true)
                }
                if (sCompany === "SCA" && sProduct === "CAR") {
                    this.byId("tileManual").setVisible(true)
                    this.byId("tileExcel").setVisible(true)

                }
                if (sCompany === "SCC" && sProduct === "NGV") {
                    this.byId("tileLineMessage").setVisible(true)
                    this.byId("tileStandardForm").setVisible(true)
                    this.byId("tileExcel").setVisible(true)
                }
                if (sCompany === "SCC" && sProduct === "FUEL") {
                    this.byId("tilePdf").setVisible(true)
                    this.byId("tileExcel").setVisible(true)
                    this.byId("tileTms").setVisible(true)
                    this.byId("tileEmail").setVisible(true)
                    this.byId("tileLineMessage").setVisible(true)
                }
                if (sCompany === "SCC" && sProduct === "CHEM") {
                    this.byId("tileManual").setVisible(true)
                    this.byId("tileEmail").setVisible(true)
                    this.byId("tileStandardForm").setVisible(true)


                }
                if (sCompany === "SCC" && sProduct === "LPG") {
                    this.byId("tilePdf").setVisible(true)
                    this.byId("tileExcel").setVisible(true)
                }
            }
            this.byId("channelFlex").setVisible(bShowFlex);
        },
        onPdfUploadPress: function (oEvent) {
            this.selectedTiletype = oEvent.getSource().getProperty("header");

            this._openDialog("PdfUploadDialog", "intellicarrier.view.PdfUpload");
        },
        onCompartmentChange: function () {
            const aCompartments = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const aProducts = ["P1", "P2", "P3"]; // 3 forms

            aCompartments.forEach(cNo => {
                let iSum = 0;

                aProducts.forEach(p => {
                    const oInput = this.byId(`C${cNo}_${p}`);
                    if (oInput) {
                        iSum += Number(oInput.getValue()) || 0;
                    }
                });

                const oText = this.byId(`sumC${cNo}`);
                if (oText) {
                    oText.setText(iSum > 0 ? iSum + "K" : "-");
                }
            });
        },
        onExcelUploadPress: function () {
            this._openDialog("ExcelUploadDialog", "intellicarrier.view.ExcelUpload");
        },

        _openDialog: function (sDialogId, sFragmentPath) {

            this.onCloseChannelDialog();
            if (!this[sDialogId]) {
                this[sDialogId] = this.loadFragment(sFragmentPath);
            }
            this[sDialogId].then(function (oDialog) {
                oDialog.open();
            });
            this.byId("extractBtn").setVisible(true);

        },

        onCloseDialog1: function (oEvent) {
            const oDialog = oEvent.getSource().getParent();

            oDialog.close();
            this.byId("CustomContentBox").setVisible(false)
            this.byId("uploadFrightVBox").setVisible(true)
            this.byId("uploadFlowHBox").setVisible(true)
            this.byId("uploadFlowHBoxReview").setVisible(false)
        },
        onFileSelected: function (oEvent) {
            const aFiles = oEvent.getParameter("files");
            this.getView().byId("extractBtn").setVisible(false);
            if (aFiles && aFiles.length) {
                // File selected successfully
                this.getView().byId("extractBtn").setVisible(true);

                // (Optional) store file reference for OCR
                this._uploadedFile = aFiles[0];
            }
        },
        onUploadFreightPress: function () {

            // 🔹 Simulated extracted data (replace with OCR response)
            var oExtractedData = {
                customerName: "ABC Industries",
                email: "contact@abc.com",
                phone: "9876543210",
                pickupAddress: "Chennai Port",
                deliveryAddress: "Bangalore Warehouse",
                products: [
                    {
                        productName: "LPG",
                        quantity: 20,
                        unit: "MT"
                    }
                ],
                pickupDate: new Date(),
                deliveryDate: new Date(),
                totalWeight: 20000,
                volume: 45,
                specialInstructions: "Handle with care"
            };

            // Open manual entry with extracted data
            this.onManualEntryFreight(oExtractedData);

            this.PdfUploadDialog.then(function (oDialog) {
                oDialog.close();
            });
            // this.PdfUploadDialog.then(function (oDialog) {
            //     oDialog.close();
            // });
        },
        onUploadPress: function () {
            this.byId("CustomContentBox").setVisible(true)
            this.byId("uploadFrightVBox").setVisible(false)
            this.byId("uploadFlowHBox").setVisible(false)
            this.byId("uploadFlowHBoxReview").setVisible(true)
            this.byId("extractBtn").setVisible(false)


        },
        onSelectAll: function (oEvent) {
            const bSelected = oEvent.getParameter("selected");
            const oList = this.byId("freightList");

            oList.getItems().forEach(function (oItem) {
                oList.setSelectedItem(oItem, bSelected);
            });
        },
        onConfirmSelection: function () {
            const oList = this.byId("freightList");
            const aSelectedItems = oList.getSelectedItems();

            if (!aSelectedItems.length) {
                sap.m.MessageToast.show("Please select at least one draft");
                return;
            }

            const iCount = aSelectedItems.length;
            let sourcetext=this.selectedTiletype;
            sap.m.MessageBox.confirm(
                "Confirm " + iCount + " draft(s)?\n\nStatus will change: Draft → Open",
                {
                    title: "Confirm Drafts",
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    emphasizedAction: sap.m.MessageBox.Action.OK,

                    onClose: function (sAction) {
                        if (sAction !== sap.m.MessageBox.Action.OK) {
                            return;
                        }

                        // 🔹 Orders model
                        const oOrdersModel = this.getView().getModel("orders");
                        const aOrders = oOrdersModel.getProperty("/ordersList") || [];

                        // 🔹 Loop selected list items
                        aSelectedItems.forEach(function (oItem) {

                            // ---- Extract data from static CustomListItem ----
                            const oRootHBox = oItem.getContent()[0];      // Main HBox
                            const oLeftVBox = oRootHBox.getItems()[0];   // Left VBox

                            // Header row
                            const oHeaderHBox = oLeftVBox.getItems()[0];
                            const sOrderId = oHeaderHBox.getItems()[0].getText(); // FO-DRAFT-xxxx

                            // Meta rows
                            const oMetaRow1 = oLeftVBox.getItems()[1];
                            const sCustomerName = oMetaRow1.getItems()[1].getText();

                            const oMetaRow2 = oLeftVBox.getItems()[2];
                            const sProductText = oMetaRow2.getItems()[1].getText(); // D:12K + G95:7K
                            const sDeliveryDate = oMetaRow2.getItems()[3].getText();

                            // ---- Create new order object ----
                            const oNewOrder = {
                                orderId: sOrderId.replace("DRAFT", "OPEN"),

                                sourceIcon: "sap-icon://document-text",
                                sourceText: sourcetext,

                                customerName: sCustomerName,
                                customerEmail: "",

                                deliveryAddress: "456 Chang Klan Road, Mueang, Chiang Mai 50100",

                                productsCount: sProductText,
                                weight: "19,000 kg",
                                deliveryDate: sDeliveryDate,

                                // ✅ NON-ZERO VALUE
                                value: "฿125,000",

                                statusText: "Open",
                                statusState: "Success",
                                statusIcon: "sap-icon://accept",

                                actionButtonText: "View",
                                actionButtonType: "Default",

                                ocrConfidence: "94.4%",

                                fullData: {
                                    orderId: sOrderId,
                                    customerName: sCustomerName,
                                    deliveryAddress: "456 Chang Klan Road, Mueang, Chiang Mai 50100",
                                    products: sProductText,
                                    deliveryDate: sDeliveryDate,
                                    value: "฿125,000"
                                }
                            };

                            // Add to top of list
                            aOrders.unshift(oNewOrder);
                        });

                        // Update model
                        oOrdersModel.setProperty("/ordersList", aOrders);

                        // UI cleanup
                        oList.removeSelections(true);
                        this.byId("CustomContentBox").setVisible(false);
                        this.byId("uploadFrightVBox").setVisible(true);
                        this.byId("uploadFlowHBox").setVisible(true);
                        this.byId("uploadFlowHBoxReview").setVisible(false);

                        sap.m.MessageBox.success(
                            "All drafts confirmed!\nStatus: OPEN",
                            { title: "Success" }
                        );

                    }.bind(this)
                }
            );
            this.PdfUploadDialog.then(function (oDialog) {
                oDialog.close();
            });
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
                actionButtonText: "View",
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
            this.onCancelManualOrder();

        },

        onCancelManualOrder: function () {
            this._oManualOrderDialog.then(function (oDialog) {
                oDialog.close();

            });
            this._oManualOrderDialog1.then(function (oDialog) {
                oDialog.close();
            })
        },
        onCreateShipment: function () {
            this.onCloseOrderDetails();
            const oOrder = this.getView().getModel("orderDetails").getData();

            // const sConfirmText =
            //     "Create Shipment for " + oOrder.orderId + "?\n\n" +
            //     "BU: " + oOrder.bu + "\n" +
            //     "Type: " + oOrder.product + "\n" +
            //     "Route: " + oOrder.route + "\n\n" +
            //     "This will open the Create Shipment screen.";

            const sConfirmText =
                "Create Shipment for " + oOrder.orderId + "?\n\n" +
                "BU: " + "SCC" + "\n" +
                "Type: " + "Fule" + "\n" +
                "Route: " + "130H-CUST" + "\n\n" +
                "This will open the Create Shipment screen.";
            sap.m.MessageBox.confirm(
                sConfirmText,
                {
                    title: "Create Shipment",
                    icon: sap.m.MessageBox.Icon.QUESTION,
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    emphasizedAction: sap.m.MessageBox.Action.OK,

                    onClose: function (sAction) {
                        if (sAction === sap.m.MessageBox.Action.OK) {

                            // 🔹 Simulate backend shipment creation
                            const sShipmentNo = "SH-2026-003420";

                            sap.m.MessageBox.success(
                                "Shipment " + sShipmentNo + " created!\n\n" +
                                "→ In production, this opens CreateShipment_AllTypes.html\n" +
                                "pre-filled with FO data for: " + oOrder.bu + " / " + oOrder.product + "\n\n" +
                                "Next step: Assign driver/vehicle → Dispatch",
                                {
                                    title: "Shipment Created",
                                    actions: [sap.m.MessageBox.Action.OK],

                                    onClose: function () {
                                        // 🔹 Real navigation would go here
                                        // window.location.href = "CreateShipment_AllTypes.html?fo=" + oOrder.orderId;

                                        sap.m.MessageToast.show("Proceed to shipment assignment");
                                    }
                                }
                            );
                        }
                    }.bind(this)
                }
            );
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

            if (sButtonText === "Validate") {
                this._openReviewDialog(oOrderData);
            } else if (sButtonText === "View") {
                // this._openReviewDialog(oOrderData);

                this.onViewDetailsFreight(oEvent);
            }
            else {
                this._openReviewDialog(oOrderData);
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
                pickupAddress: oOrderData.fullData?.pickupAddress || "Amata Nakorn Industrial Estate, 700/705 Moo 1, Tambol Panthong, Amphur Panthong, Chonburi 20160",
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
                sourceText: "uploaded pdf",//oOrderData.sourceText ,
                checklist: {
                    customerVerified: true,
                    addressesAccurate: true,
                    productsConfirmed: true,
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
                "Order " + oData.orderId + " has been created.",
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
                actionButtonText: "View",
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
            this.onCancelManualOrder();
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
                        service: "TH-4567",
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
                            this._createNewBooking1(oCustomer, oOrigin, oDestination, oSelectedVehicle);
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

        onCloseDocDialog: function () {
            if (this._oDocDialog) {
                this._oDocDialog.close();
            }
        },

        // ===========================================

        onOpenUpdateForm: function () {
            console.log("onOpenUpdateForm - Update button clicked");
            var oView = this.getView();

            // Reset form data
            this._resetFormData();

            // Create dialog if not exists
            if (!this.oUpdateDialog) {
                console.log("Creating new dialog fragment...");
                Fragment.load({
                    id: oView.getId(),
                    name: "intellicarrier.view.UpdateTrackingFragment",
                    controller: this
                }).then(function (oDialog) {
                    console.log("Dialog fragment loaded successfully");
                    this.oUpdateDialog = oDialog;
                    oView.addDependent(this.oUpdateDialog);
                    this.oUpdateDialog.open();
                    console.log("Dialog opened");
                }.bind(this)).catch(function (error) {
                    console.error("Error loading fragment:", error);
                });
            } else {
                console.log("Dialog already exists, opening it");
                this.oUpdateDialog.open();
            }
        },

        _resetFormData: function () {
            console.log("_resetFormData - Resetting form data");
            var oModel = this.getView().getModel("trackingModel");
            oModel.setProperty("/newEvent", {
                status: "",
                statusText: "",
                date: "",
                time: "",
                location: "",
                notes: ""
            });
            console.log("Form data reset complete");
        },

        onStatusChange: function (oEvent) {
            console.log("onStatusChange - Status changed");
            var oComboBox = oEvent.getSource();
            var sSelectedKey = oComboBox.getSelectedKey();
            var sSelectedText = oComboBox.getValue();

            console.log("Selected Status Key:", sSelectedKey);
            console.log("Selected Status Text:", sSelectedText);

            var oModel = this.getView().getModel("trackingModel");

            // If user selected from dropdown
            if (sSelectedKey) {
                oModel.setProperty("/newEvent/status", sSelectedKey);
                oModel.setProperty("/newEvent/statusText", sSelectedText);
            } else {
                // If user typed custom text
                oModel.setProperty("/newEvent/status", "");
                oModel.setProperty("/newEvent/statusText", sSelectedText);
            }

            console.log("Status updated in model");
        },

        onAddEvent: function () {
            console.log("onAddEvent - Add Event button clicked");
            var oModel = this.getView().getModel("trackingModel");
            var oNewEvent = oModel.getProperty("/newEvent");

            console.log("New Event Data:", oNewEvent);

            // Validate required fields
            if (!oNewEvent.status || !oNewEvent.statusText || !oNewEvent.date ||
                !oNewEvent.time || !oNewEvent.location) {
                console.warn("Validation failed - Missing required fields");
                MessageToast.show("Please fill all required fields");
                return;
            }

            console.log("Validation passed");

            // Add event to the events array
            var aEvents = oModel.getProperty("/events");
            console.log("Current events array:", aEvents);

            var newEventData = {
                status: oNewEvent.status,
                statusText: oNewEvent.statusText,
                date: oNewEvent.date,
                time: oNewEvent.time,
                location: oNewEvent.location,
                notes: oNewEvent.notes || "No additional notes"
            };

            aEvents.push(newEventData);
            console.log("Event added to array:", newEventData);
            console.log("Updated events array:", aEvents);

            oModel.setProperty("/events", aEvents);
            console.log("Model updated with new events");

            // Update the corresponding wizard step
            console.log("Calling _updateWizardStep...");
            this._updateWizardStep(newEventData);

            // Close dialog
            this.oUpdateDialog.close();
            console.log("Dialog closed");
            MessageToast.show("Tracking event added successfully!");
        },

        onCancelUpdate: function () {
            console.log("onCancelUpdate - Cancel button clicked");
            this.oUpdateDialog.close();
            console.log("Dialog closed without saving");
        },

        _updateWizardStep: function (oEvent) {
            console.log("_updateWizardStep - Starting update");
            console.log("Event data received:", oEvent);

            var sStepId = this.statusConfig[oEvent.status] ?
                this.statusConfig[oEvent.status].stepId : null;

            console.log("Status from event:", oEvent.status);
            console.log("Mapped Step ID:", sStepId);

            if (!sStepId) {
                console.error("Step ID not found for status:", oEvent.status);
                return;
            }

            var oStep = this.byId(sStepId);
            console.log("Step object retrieved:", oStep);

            if (!oStep) {
                console.error("Step not found with ID:", sStepId);
                return;
            }

            var sIcon = this.statusConfig[oEvent.status].icon;
            var sIconColor = this.statusConfig[oEvent.status].iconColor;

            console.log("Icon:", sIcon);
            console.log("Icon Color:", sIconColor);

            // Create content for the step
            console.log("Creating VBox content...");

            try {
                var oIcon = new Icon({
                    src: sIcon,
                    size: "3rem",
                    color: sIconColor
                });
                oIcon.addStyleClass("sapUiSmallMarginBottom");
                console.log("Icon created successfully");

                var oStatusVBox = new VBox({
                    items: [
                        new Label({ text: "Status:", design: "Bold" }),
                        new Text({ text: oEvent.statusText }).addStyleClass("sapUiSmallMarginBottom")
                    ]
                });
                oStatusVBox.addStyleClass("sapUiSmallMarginTop");
                console.log("Status VBox created");

                var oDateTimeVBox = new VBox({
                    items: [
                        new Label({ text: "Date & Time:", design: "Bold" }),
                        new Text({ text: oEvent.date + " at " + oEvent.time }).addStyleClass("sapUiSmallMarginBottom")
                    ]
                });
                oDateTimeVBox.addStyleClass("sapUiSmallMarginTop");
                console.log("DateTime VBox created");

                var oLocationVBox = new VBox({
                    items: [
                        new Label({ text: "Location:", design: "Bold" }),
                        new Text({ text: oEvent.location }).addStyleClass("sapUiSmallMarginBottom")
                    ]
                });
                oLocationVBox.addStyleClass("sapUiSmallMarginTop");
                console.log("Location VBox created");

                var oNotesVBox = new VBox({
                    items: [
                        new Label({ text: "Notes:", design: "Bold" }),
                        new Text({ text: oEvent.notes })
                    ]
                });
                oNotesVBox.addStyleClass("sapUiSmallMarginTop");
                console.log("Notes VBox created");

                var oContent = new VBox({
                    items: [
                        oIcon,
                        oStatusVBox,
                        oDateTimeVBox,
                        oLocationVBox,
                        oNotesVBox
                    ]
                });
                oContent.addStyleClass("sapUiSmallMargin");
                console.log("Main content VBox created successfully");

                // Remove old content and add new content
                console.log("Removing old content from step...");
                oStep.removeAllContent();
                console.log("Adding new content to step...");
                oStep.addContent(oContent);

                // Mark step as validated (completed)
                console.log("Setting step as validated...");
                oStep.setValidated(true);

                // Navigate to the updated step
                var oWizard = this.byId("trackingDisplayWizard");
                console.log("Wizard object:", oWizard);

                if (oWizard) {
                    console.log("Current wizard step before navigation:", oWizard.getCurrentStep());
                    console.log("Navigating to step:", sStepId);

                    // Get all steps
                    var aAllSteps = oWizard.getSteps();
                    console.log("All wizard steps:", aAllSteps);

                    var iTargetStepIndex = -1;
                    for (var i = 0; i < aAllSteps.length; i++) {
                        if (aAllSteps[i].getId() === oStep.getId()) {
                            iTargetStepIndex = i;
                            break;
                        }
                    }
                    console.log("Target step index:", iTargetStepIndex);

                    // Validate all steps up to and including the current one
                    for (var j = 0; j <= iTargetStepIndex; j++) {
                        console.log("Validating step index:", j, "Step ID:", aAllSteps[j].getId());
                        aAllSteps[j].setValidated(true);
                    }

                    // Reset wizard progress to first step, then navigate
                    console.log("Discarding wizard progress...");
                    oWizard.discardProgress(aAllSteps[0]);

                    // Now navigate step by step to the target
                    console.log("Navigating step by step to index:", iTargetStepIndex);
                    for (var k = 0; k < iTargetStepIndex; k++) {
                        console.log("Moving to next step, current index:", k);
                        oWizard.nextStep();
                    }

                    // Force re-render
                    setTimeout(function () {
                        console.log("Current wizard step after navigation:", oWizard.getCurrentStep());
                    }, 200);

                    console.log("Navigation complete");
                } else {
                    console.error("Wizard not found!");
                }

                console.log("_updateWizardStep - Update completed successfully");

            } catch (error) {
                console.error("Error in _updateWizardStep:", error);
                console.error("Error stack:", error.stack);
            }
        },

        // ==============================================


        onGenTilePress: function (oEvent) {
            var sHeader = oEvent.getSource().getHeader();

            if (!this._oDocDialog) {
                this._oDocDialog = sap.ui.xmlfragment(
                    "intellicarrier.view.OpenDoc",
                    this
                );
                this.getView().addDependent(this._oDocDialog);
            }

            // Optional: pass header to fragment (for title)
            this._oDocDialog.setTitle(sHeader);

            this._oDocDialog.open();
        },

        onViewShipmentDetails: function (oEvent) {


            var oButton = oEvent.getSource();
            var oRow = oButton.getParent();
            var aCells = oRow.getCells();

            var sStatusText = aCells[5].getText();

            var oDetailModel = this.getView().getModel("detailModel");

            if (!oDetailModel) {
                oDetailModel = new sap.ui.model.json.JSONModel({
                    showDocs: false
                });
                this.getView().setModel(oDetailModel, "detailModel"); // ✅ FIX
            }

            oDetailModel.setProperty("/showDocs", sStatusText === "Delivered");

            console.log("detailModel:", oDetailModel.getData());


            var oBindingContext = oEvent.getSource().getBindingContext();
            var oShipmentData = oBindingContext ? oBindingContext.getObject() : null;
            console.log(oShipmentData)

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
            this.byId("contactCustomerDialog").open();
        },
        onContactCloseDialog: function () {
            this.byId("contactCustomerDialog").close();
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
                    destination: "Bangkok, NY",
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
        onCreateOrder: function () {
            debugger
            if (!this._oFleetDialog) {
                this._oFleetDialog = this.loadFragment("intellicarrier.view.FleetCockpitAnalysis");
            }
            var oModel = this.getView().getModel("OrdersD");
            console.log(oModel)
            oModel.setProperty("/editData", {

            });
            oModel.setProperty("/isEdit", false);

            // var oOrderModel = new sap.ui.model.json.JSONModel(oOrder);
            // this.getView().setModel(oOrderModel, "selectedOrder");

            this._oFleetDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onFleetSuggest: function () {
            debugger
            if (!this._oFleetSDialog) {
                this._oFleetSDialog = this.loadFragment("intellicarrier.view.fleetSuggestDialog");
            }

            // var oOrderModel = new sap.ui.model.json.JSONModel(oOrder);
            // this.getView().setModel(oOrderModel, "selectedOrder");

            this._oFleetSDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onCloseFleetModal: function () {

            this._oFleetSDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        onConfirmFleetSelection: function () {

            this._oFleetSDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        onAddStage: function () {
            sap.m.MessageToast.show("Open Stage Selection Dialog");

        },
        onSwapStage: function () {

            // Create and open the Swap Confirmation Dialog
            if (!this._oSwapDialog) {
                this._oSwapDialog = new sap.m.Dialog({
                    title: "Stage Order Changed",
                    type: "Message",
                    state: "Warning",
                    content: new sap.m.Text({
                        text: "Stage order has been changed. System will auto-search for matching route. If no match is found, a dummy route will be created."
                    }),
                    beginButton: new sap.m.Button({
                        type: "Emphasized",
                        text: "Confirm & Search Route",
                        press: function () {
                            // Implement logic to reorder items in your model and update total distance
                            this._oSwapDialog.close();
                            sap.m.MessageToast.show("Route matched! Distance updated.");
                        }.bind(this)
                    }),
                    endButton: new sap.m.Button({
                        text: "Cancel",
                        press: function () {
                            this._oSwapDialog.close();
                        }.bind(this)
                    })
                });
            }

            this._oSwapDialog.open();
        },

        onAnalyzeOrder: function (oEvent) {
            debugger
            var oOrder = oEvent.getSource().getBindingContext().getObject();
            if (!this._oFleetDialog) {
                this._oFleetDialog = this.loadFragment("intellicarrier.view.FleetCockpitAnalysis");
            }

            // var oOrderModel = new sap.ui.model.json.JSONModel(oOrder);
            // this.getView().setModel(oOrderModel, "selectedOrder");
            var oModel = this.getView().getModel("OrdersD");
            console.log(oModel)
            oModel.setProperty("/editData", {
                "bu": "SCC — SC Carrier",
                "productType": "LPG",
                "site": "060C — ATLAS-LPG-BPK",
                "shipmentNo": "SHP-2026-0208-01",
                "shipmentType": "0602 — SCC-LPG",
                "shippingType": "01 — Truck",
                "buSiteDisplay": "SCC / 060C",
                "routeID": "010005 — BTC → ไทยเบฟ → BTC",
                "wbs": "08S.26CF.BPK.001",
                "contractDate": "2026-02-04",
                "plannedDateTime": "2026-02-08T14:30:00",
                "truckPlate": "83-0569",
                "trailerPlate": "83-1069",
                "vehicleNo": "VH-830569",
                "truckTypeDisplay": "LPG Tanker 18T",
                "driver1Id": "EMP001",
                "driver1Name": "สมชาย ใจดี",
                "driver1Phone": "081-123-4567",
                "driver1Intern": false,
                "totalDistance": "311",
                "transportFee": "เก็บ",
                "tripPay": "จ่าย",
                "brokenMiles": false,
                "stages": [
                    {
                        "stageIdx": "0",
                        "statusState": "Information",
                        "typeName": "First",
                        "depName": "—",
                        "depCode": "—",
                        "destName": "ท่าเรือบางปะกง",
                        "destCode": "010007",
                        "distance": "—",
                        "arrivalDT": "2026-02-08T14:30:00",
                        "departureDT": "2026-02-08T15:00:00"
                    },
                    {
                        "stageIdx": "1",
                        "statusState": "Warning",
                        "typeName": "Transport",
                        "depName": "ท่าเรือบางปะกง",
                        "depCode": "010007",
                        "destName": "ไทยเบฟ (บางบาล)",
                        "destCode": "010025",
                        "distance": "151 km",
                        "arrivalDT": "2026-02-08T17:30:00",
                        "departureDT": "2026-02-08T18:30:00"
                    }
                ]
            });
            oModel.setProperty("/isEdit", true);



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

            // ✅ Generate new Shipment ID
            var sNewId = new Date().getFullYear() + Math.floor(100000 + Math.random() * 900000);

            // ✅ Extract order details safely
            var sCustomer = oOrder.customer || "-";
            var sOrigin = oOrder.from || "-";
            var sDestination = oOrder.to || "-";
            var sDeliveryDate = oOrder.deliveryDate || "-";
            var sCargoInfo = oOrder.cargoInfo || "-";
            var sOrderId = oOrder.orderId || "-";
            var sPriority = oOrder.priority || "-";

            // ✅ Vehicle/Carrier selected name
            var sAssignedTo = oVehicle.text || oVehicle.vehicle || oVehicle.name || "Assigned Carrier";

            // ✅ Decide Status based on selection type
            // (you can adjust based on your selectionModel structure)
            var sStatusText = "Assigned";
            if (sAssignedTo.includes("Express") || sAssignedTo.includes("Carrier")) {
                sStatusText = "External Carrier";
            } else {
                sStatusText = "Internal Fleet";
            }

            // ✅ Update order status in orders model
            var oOrdersModel = this.getView().getModel("orders");
            if (oOrdersModel) {
                var aOrders = oOrdersModel.getProperty("/orders") || [];

                aOrders.forEach(function (oItem) {
                    if (oItem.orderId === sOrderId) {
                        oItem.status = "Assigned";
                        oItem.statusState = "Success";
                        oItem.statusText = sStatusText;
                        oItem.shipmentId = sNewId;
                    }
                });

                oOrdersModel.setProperty("/orders", aOrders);
                oOrdersModel.refresh(true);
            }

            // ✅ Booking created log
            console.log("✅ Booking Created", {
                shipmentId: sNewId,
                order: oOrder,
                assignedTo: oVehicle
            });

            // ✅ Success MessageBox
            sap.m.MessageBox.success(
                "🚛 SHIPMENT BOOKED SUCCESSFULLY!\n\n" +
                "Shipment ID: " + sNewId + "\n" +
                "Order ID: " + sOrderId + "\n" +
                "Customer: " + sCustomer + "\n" +
                "Route: " + sOrigin + " → " + sDestination + "\n" +
                "Cargo: " + sCargoInfo + "\n" +
                "Delivery: " + sDeliveryDate + "\n" +
                "Priority: " + sPriority + "\n\n" +
                "Assigned: " + sAssignedTo + "\n\n" +
                "Next Steps:\n" +
                "• Assignment confirmed\n" +
                "• Driver/Carrier will be notified\n" +
                "• Tracking will be activated\n" +
                "• Documentation will be generated",
                {
                    title: "✅ Booking Confirmed"
                }
            );
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
                "Shipment 800000334 created successfully"
            );
        },

        onCloseFleetCockpit: function () {

            this._oFleetDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        onConformpres: function () {
            this.onCloseFleetCockpit();
            var oModel = this.getView().getModel();
            var dModel = this.getView().getModel("OrdersD");
            var f = dModel.getProperty("/isEdit");
            if (!f) {

                if (oModel) {
                    var aOrders = oModel.getProperty("/orders");
                    if (!aOrders) {
                        aOrders = [];
                    }
                    var l = aOrders.length;
                    var oNewRecord = {
                        orderId: `FO-2026-000${l}`,
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
                    };
                    aOrders.push(oNewRecord);
                    oModel.setProperty("/orders", aOrders);
                    console.log("Record added successfully!");
                } else {
                    console.error("Model not found. Please check your model name in manifest.json");
                }
            }
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




        // onAddRatePress: function () {
        //     var oView = this.getView();

        //     // 1. Create the data model for the new rate
        //     const newRateModel = new sap.ui.model.json.JSONModel({
        //         newRate: {
        //             id: this._generateRateId("RA"),
        //             type: "",
        //             name: "",
        //             customerId: "",
        //             carrierId: "",
        //             baseKm: 18.5,
        //             weightKg: 2.0,
        //             fuel: 8.5,
        //             discount: 5.0,
        //             markup: 0,
        //             minCharge: 500,
        //             validFrom: new Date().toISOString().split("T")[0],
        //             validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
        //             status: "ACTIVE",
        //             currency: "THB",
        //             notes: "",
        //             termsRef: "",
        //             serviceTypes: []
        //         }
        //     });

        //     // Set the model to the view (or specific dialog if preferred)
        //     // It is best practice to give the model a name (e.g., "rateModel") to avoid overwriting the default model
        //     oView.setModel(newRateModel, "rateModel");

        //     // 2. Load and Open the Dialog
        //     if (!this._addRateDialog) {
        //         sap.ui.core.Fragment.load({
        //             id: oView.getId(),
        //             name: "intellicarrier.view.AddRateDialog",
        //             controller: this
        //         }).then(function (oDialog) {
        //             this._addRateDialog = oDialog;
        //             oView.addDependent(oDialog);
        //             oDialog.open();
        //         }.bind(this));
        //     } else {
        //         this._addRateDialog.open();
        //     }
        // },

        // onCloseAddDialog: function () {
        //     if (this._addRateDialog) {
        //         this._addRateDialog.close();
        //     }
        // },
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
        // Open Calculate Modal with Data Binding
        onOpenCalculateModal: function (oEvent) {
            var oView = this.getView();

            // 1. GET THE DATA from the row that was clicked
            var oContext = oEvent.getSource().getBindingContext();

            if (!this._oCalcDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "intellicarrier.view.CalculatePrice", // Ensure this matches your file path/name
                    controller: this
                }).then(function (oDialog) {
                    this._oCalcDialog = oDialog;
                    oView.addDependent(oDialog);

                    // 2. Add Data & Open
                    this._bindCalcData(oDialog, oContext);
                    oDialog.open();
                }.bind(this));
            } else {
                // 2. Add Data & Open (if already loaded)
                this._bindCalcData(this._oCalcDialog, oContext);
                this._oCalcDialog.open();
            }
        },

        // Helper to bind the Row Data + Static Calculation Data
        _bindCalcData: function (oDialog, oContext) {
            // A. Bind the specific shipment data (Customer, Origin, Weight, etc.)
            oDialog.setBindingContext(oContext);

            // B. Set Static Calculation Data (Populates the price breakdown)
            var oStaticData = {
                distCost: "12,672.50",
                wgtCost: "4,900.00",
                subtotal: "17,572.50",
                fuelCost: "1,493.66",
                discCost: "953.31",
                total: "18,112.85"
            };

            // Create a named model "calc" for these specific values
            var oCalcModel = new JSONModel(oStaticData);
            oDialog.setModel(oCalcModel, "calc");
        },
        // Close the Calculate Price Dialog
        onCloseCalculatePrice: function () {
            if (this._oCalcDialog) {
                this._oCalcDialog.close();
            }
        },
        // Handler for "Confirm" button in Calculate Price Dialog
        onConfirmCalculation: function () {
            // 1. Close the Calculation Dialog first
            if (this._oCalcDialog) {
                this._oCalcDialog.close();
            }

            // 2. Show Success Message Box (Matches your screenshot)
            sap.m.MessageBox.success(
                "Shipment moved to \"Internal Fleet — Pending Approval\" tab.\n\nNext step: Review and send to S/4HANA.",
                {
                    title: "Price Calculated!",
                    actions: [sap.m.MessageBox.Action.OK],
                    onClose: function (oAction) {
                        // Optional: Auto-switch to the "Internal Fleet" tab
                        var oTabBar = this.byId("priceTabBar");
                        if (oTabBar) {
                            oTabBar.setSelectedKey("Internal");
                        }
                    }.bind(this)
                }
            );
        },
        // Handle "Override Price" Button Click
        onOverridePrice: function () {
            var that = this; // Keep reference to controller

            // 1. Create the Input Field
            var oInput = new sap.m.Input({
                type: "Number",
                placeholder: "e.g. 18000",
                submit: function () { oDialog.getBeginButton().firePress(); } // Submit on Enter key
            });

            // 2. Create the Dialog dynamically
            var oDialog = new sap.m.Dialog({
                title: "✏️ Override Price",
                type: "Message",
                contentWidth: "300px",
                content: [
                    new sap.m.VBox({
                        class: "sapUiSmallMargin",
                        items: [
                            new sap.m.Label({ text: "Enter override price (THB):", labelFor: oInput, design: "Bold" }),
                            oInput
                        ]
                    }).addStyleClass("sapUiSmallMargin")
                ],
                beginButton: new sap.m.Button({
                    text: "Update",
                    type: "Emphasized",
                    press: function () {
                        var sValue = oInput.getValue();

                        // Basic Validation
                        if (!sValue) {
                            sap.m.MessageToast.show("Please enter a valid price.");
                            return;
                        }

                        // 3. Update the Calculate Dialog's Model
                        if (that._oCalcDialog) {
                            var oCalcModel = that._oCalcDialog.getModel("calc");

                            // Format the number nicely (e.g. "15,000.00")
                            var fPrice = parseFloat(sValue);
                            var sFormatted = fPrice.toLocaleString('en-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                            // Update the property that the view is bound to
                            oCalcModel.setProperty("/total", sFormatted);

                            sap.m.MessageToast.show("Price updated to ฿" + sFormatted);
                        }

                        oDialog.close();
                    }
                }),
                endButton: new sap.m.Button({
                    text: "Cancel",
                    press: function () {
                        oDialog.close();
                    }
                }),
                afterClose: function () {
                    oDialog.destroy(); // Cleanup
                }
            });

            oDialog.open();
        },

        // ============================================================
        // 2. APPROVE INTERNAL DIALOG
        // ============================================================

        // Open the Approval Dialog
        onApproveInternal: function (oEvent) {
            var oView = this.getView();
            var oContext = oEvent.getSource().getBindingContext(); // Get row data (Customer, Route, Total, etc.)

            if (!this._oApproveDialog) {
                sap.ui.core.Fragment.load({
                    id: oView.getId(),
                    name: "intellicarrier.view.ApproveInternal",
                    controller: this
                }).then(function (oDialog) {
                    this._oApproveDialog = oDialog;
                    oView.addDependent(oDialog);

                    // Bind data and open
                    oDialog.setBindingContext(oContext);
                    oDialog.open();
                }.bind(this));
            } else {
                // Dialog already loaded, just rebind and open
                this._oApproveDialog.setBindingContext(oContext);
                this._oApproveDialog.open();
            }
        },

        // Action: Send to S/4HANA
        onSendToS4: function (oEvent) {
            // 1. Close Dialog
            if (this._oApproveDialog) {
                this._oApproveDialog.close();
            }

            // 2. Show Success Message
            sap.m.MessageBox.success(
                "Sales Order triggered in S/4HANA (Type: ZFRT).\n\nDocument ID: SO-2026-" + Math.floor(Math.random() * 10000),
                {
                    title: "Integration Success",
                    actions: [sap.m.MessageBox.Action.OK]
                }
            );
        },

        // Close Handler
        onCloseApproveInternal: function () {
            if (this._oApproveDialog) {
                this._oApproveDialog.close();
            }
        },
        // Handler for "Rate Master" Tile/Button
        onRateMasterPress: function () {
            sap.m.MessageBox.information(
                "Navigating to: Masters → Rate Master\n\n" +
                "This is a separate screen where you can:\n" +
                "• View all rate agreements\n" +
                "• Add/Edit customer rates\n" +
                "• Configure route-based pricing\n" +
                "• Manage carrier contracts",
                {
                    title: "📄 Opening Rate Master", // Custom Title with Icon
                    actions: [sap.m.MessageBox.Action.OK],
                    onClose: function (oAction) {
                        // Navigate to the Rate Master View

                    }.bind(this)
                }
            );
        },
        // Handler for "Approve & Send All" Button
        onApproveAllInternal: function () {
            sap.m.MessageBox.success(
                "✅ Approving All...\n\n" +
                "3 shipments sent to S/4HANA.\n\n" +
                "View status in \"Sent to S/4\" tab.",
                {
                    title: "Batch Approval Complete",
                    actions: [sap.m.MessageBox.Action.OK],
                    onClose: function (oAction) {
                        // Optional: Switch to the Sent to S/4 tab automatically
                        /* var oTabBar = this.byId("priceTabBar");
                        if (oTabBar) {
                            oTabBar.setSelectedKey("SentToS4");
                        }
                        */
                    }.bind(this)
                }
            );
        },
        // Handler for "Auto-Calculate All" Button
        onAutoCalculateAllPress: function () {
            sap.m.MessageBox.success(
                "⚡ Auto-Calculating All Pending Shipments\n\n" +
                "✅ 2 Internal shipments → Moved to 'Internal Fleet' tab\n" +
                "✅ 2 External shipments → Awaiting invoice upload\n\n" +
                "Rate Master applied automatically.",
                {
                    title: "Auto-Calculation Complete",
                    actions: [sap.m.MessageBox.Action.OK],
                    onClose: function (oAction) {
                        // Optional: Refresh the tables or switch tabs
                        MessageToast.show("Dashboard updated.");
                    }
                }
            );
        },
        // ============================================================
        // 4. RESOLVE DISCREPANCY DIALOG
        // ============================================================

        // Open Discrepancy Dialog
        onResolveDiscrepancy: function (oEvent) {
            var oView = this.getView();
            var oContext = oEvent.getSource().getBindingContext(); // Get the row with the error

            if (!this._oDiscDialog) {
                sap.ui.core.Fragment.load({
                    id: oView.getId(),
                    name: "intellicarrier.view.ResolveDiscrepancy",
                    controller: this
                }).then(function (oDialog) {
                    this._oDiscDialog = oDialog;
                    oView.addDependent(oDialog);
                    this._bindDiscrepancyData(oDialog, oContext);
                    oDialog.open();
                }.bind(this));
            } else {
                this._bindDiscrepancyData(this._oDiscDialog, oContext);
                this._oDiscDialog.open();
            }
        },

        // Helper to bind data and set defaults
        _bindDiscrepancyData: function (oDialog, oContext) {
            oDialog.setBindingContext(oContext);

            // Optional: Create a local model for the "Resolution Reason" input
            var oReasonModel = new sap.ui.model.json.JSONModel({
                reason: "",
                comment: ""
            });
            oDialog.setModel(oReasonModel, "resolution");
        },

        // ACTION: Accept the discrepancy (Pay the full invoiced amount)
        onResolveDiscrepancyAction: function (oEvent) {
            var oModel = this._oDiscDialog.getModel("resolution");
            var sReason = oModel ? oModel.getProperty("/reason") : "Manual Approval";

            sap.m.MessageBox.success(
                "Exception Approved.\n\nReason: " + sReason + "\nInvoice posted for payment.",
                {
                    title: "Discrepancy Resolved",
                    onClose: function () {
                        this.onCloseResolveDiscrepancy();
                    }.bind(this)
                }
            );
        },

        // ACTION: Reject the invoice (Send back to carrier)
        onRejectInvoice: function (oEvent) {
            sap.m.MessageBox.error(
                "Invoice Rejected. Notification sent to carrier for correction.",
                {
                    title: "Invoice Rejected",
                    onClose: function () {
                        this.onCloseResolveDiscrepancy();
                    }.bind(this)
                }
            );
        },

        // Close Handler
        onCloseResolveDiscrepancy: function () {
            if (this._oDiscDialog) {
                this._oDiscDialog.close();
            }
        },
        // ============================================================
        // 3. VALIDATE EXTERNAL INVOICE DIALOG
        // ============================================================

        // Open the Validation Dialog
        onOpenValidateModal: function (oEvent) {
            var oView = this.getView();
            var oContext = oEvent.getSource().getBindingContext(); // Get the row data (Invoice #, Amount, etc.)

            if (!this._oValidateDialog) {
                sap.ui.core.Fragment.load({
                    id: oView.getId(),
                    name: "intellicarrier.view.ValidateExternal",
                    controller: this
                }).then(function (oDialog) {
                    this._oValidateDialog = oDialog;
                    oView.addDependent(oDialog);

                    // Bind data and open
                    oDialog.setBindingContext(oContext);
                    oDialog.open();
                }.bind(this));
            } else {
                // Rebind and open
                this._oValidateDialog.setBindingContext(oContext);
                this._oValidateDialog.open();
            }
        },

        // Action: Approve & Post to S/4HANA
        onApproveExternal: function (oEvent) {
            sap.m.MessageToast.show("Invoice Approved. Posted to S/4HANA Finance.");
            this.onCloseValidateExternal();
        },

        // Action: Flag Discrepancy (Closes this dialog, opens Discrepancy dialog)
        onFlagDiscrepancy: function (oEvent) {
            this.onCloseValidateExternal();

            // Pass the event forward to the Discrepancy dialog so it knows which item to flag
            this.onResolveDiscrepancy(oEvent);
        },

        // Close Handler
        onCloseValidateExternal: function () {
            if (this._oValidateDialog) {
                this._oValidateDialog.close();
            }
        },
        onAddRatePress: function () {
            var oView = this.getView();

            // Setup Data Model
            var oData = {
                newRate: {
                    id: "RA-" + new Date().getTime(), // Simple ID generator
                    name: "",
                    customerId: "",
                    carrierId: "",
                    baseKm: 18.5,
                    weightKg: 2.0,
                    validFrom: new Date(),
                    validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                    currency: "THB",
                    status: "ACTIVE"
                },
                tiers: [
                    { minWeight: 0, maxWeight: 100, cost: 0 },
                    {
                        minWeight: 101,
                        maxWeight: 500,
                        cost: 2.00
                    },
                    {
                        minWeight: 501,
                        maxWeight: 1000,
                        cost: 1.50
                    }
                ],
            };
            var oModel = new JSONModel(oData);
            // oView.setModel(oModel); // Setting as default model for this example
            oView.setModel(oModel, "RateMaster");
            if (!this._addRateDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "intellicarrier.view.AddRateDialog",
                    controller: this
                }).then(function (oDialog) {
                    this._addRateDialog = oDialog;
                    oView.addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            } else {
                this._addRateDialog.open();
            }
        },
        // Add a new empty row to the tier table
        onAddTier: function () {
            var oModel = this.getOwnerComponent().getModel("RateMasterData");
            // var oModel = this.getView().getModel("RateMaster");
            console.log(oModel)
            var aTiers = oModel.getProperty("/tiers");

            // Add default empty object
            aTiers.push({ minWeight: 0, maxWeight: 0, cost: 0 });

            oModel.setProperty("/tiers", aTiers);
            oModel.refresh(true);
        },
        onAddSurcharge: function () {
            var oModel = this.getView().getModel("RateMasterData"); // <--- Use correct name
            var aList = oModel.getProperty("/surcharges");
            aList.push({ type: "", value: 0, unit: "PCT" });
            oModel.setProperty("/surcharges", aList);
        },

        onRemoveSurcharge: function (oEvent) {
            var oModel = this.getView().getModel("RateMasterData"); // <--- Use correct name
            var sPath = oEvent.getSource().getBindingContext("RateMasterData").getPath();
            var aList = oModel.getProperty("/surcharges");
            aList.splice(parseInt(sPath.split("/").pop()), 1);
            oModel.setProperty("/surcharges", aList);
        },
        onCalculatePreview: function () {
            // 1. Get the Model
            var oModel = this.getView().getModel("RateMasterData");
            if (!oModel) return;

            // 2. Get Input Values
            var data = oModel.getProperty("/newRate"); // Rate Rules
            var prev = oModel.getProperty("/preview"); // User Inputs

            // Helper to safely parse numbers
            var parse = function (v) { return parseFloat(v) || 0; };

            var dist = parse(prev.dist);
            var wgt = parse(prev.wgt);
            var baseKm = parse(data.baseKm);
            var weightKg = parse(data.weightKg);
            var fuelPct = parse(data.fuel);
            var discPct = parse(data.discount);

            // 3. Perform Calculation
            var distCost = dist * baseKm;
            var wgtCost = wgt * weightKg;
            var subtotal = distCost + wgtCost;
            var fuelCost = subtotal * (fuelPct / 100);
            var discCost = subtotal * (discPct / 100); // Discount usually applies to subtotal or (sub+fuel) depending on business rule

            // Total = Subtotal + Fuel - Discount
            var total = subtotal + fuelCost - discCost;

            // 4. Update Model (This triggers the XML to update)
            oModel.setProperty("/preview/distCost", distCost.toFixed(2));
            oModel.setProperty("/preview/wgtCost", wgtCost.toFixed(2));
            oModel.setProperty("/preview/subtotal", subtotal.toFixed(2));
            oModel.setProperty("/preview/fuelCost", fuelCost.toFixed(2));
            oModel.setProperty("/preview/discCost", discCost.toFixed(3));
            oModel.setProperty("/preview/total", total.toFixed(3));
        },
        // 1. Specific Button Handler

        // Remove the specific row clicked
        onRemoveTier: function (oEvent) {

            var oModel = this.getView().getModel("RateMasterData");

            var sPath = oEvent.getSource().getBindingContext("RateMasterData").getPath(); // e.g., "/tiers/2"

            var iIndex = parseInt(sPath.split("/").pop());



            var aTiers = oModel.getProperty("/tiers");

            aTiers.splice(iIndex, 1);



            oModel.setProperty("/tiers", aTiers);

        },

        // 2. HANDLE RATE TYPE SELECTION (The Magic Logic)
        onSelectRateType: function (oEvent) {
            // Get the button that was clicked
            var oButton = oEvent.getSource();

            // Extract the custom data key (customer, route, carrier, etc.)
            var sRateType = oButton.data("rateType"); // Short for oButton.getCustomData()...

            // Get references to the form sections by ID
            var oView = this.getView();
            var oBasicInfo = oView.byId("basicInfoSection");
            var oPricing = oView.byId("pricingSection");
            var oSurchargesSection = oView.byId("surchargesSection");
            var oServices = oView.byId("serviceTypesSection");
            var oNotesSection = oView.byId("notesSection");
            var oRatePreview = oView.byId("ratePreview");


            // Get references to specific inputs to toggle
            var oCustLabel = oView.byId("customerLabel");
            var oCustInput = oView.byId("customerSelect");
            var oCarrLabel = oView.byId("carrierLabel");
            var oCarrInput = oView.byId("carrierSelect");

            // Logic: Show the hidden sections
            oBasicInfo.setVisible(true);
            oPricing.setVisible(true);
            oServices.setVisible(true);
            oSurchargesSection.setVisible(true);
            oNotesSection.setVisible(true);
            oRatePreview.setVisible(true);


            // Logic: Toggle Customer vs Carrier fields based on selection
            if (sRateType === "carrier") {
                // Hide Customer, Show Carrier
                oCustLabel.setVisible(false);
                oCustInput.setVisible(false);
                oCarrLabel.setVisible(true);
                oCarrInput.setVisible(true);
            } else {
                // Default: Show Customer, Hide Carrier
                oCustLabel.setVisible(true);
                oCustInput.setVisible(true);
                oCarrLabel.setVisible(false);
                oCarrInput.setVisible(false);
            }
        },

        // 3. CLOSE DIALOG
        onCloseAddDialog: function () {
            if (this._addRateDialog) {
                this._addRateDialog.close();
            }
        },

        // 4. SAVE ACTIONS
        onSaveAndActivate: function () {
            var oModel = this.getView().getModel();
            var oData = oModel.getProperty("/newRate");
            console.log("Saving Data:", oData);
            // Add your backend/OData save logic here
            this.onCloseAddDialog();
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

        // // Title (first Text)
        // var sTitle = aItems[0].getText();

        // // Find price (Text with sapUiPositiveText)
        // var sPrice = "";
        // aItems.forEach(function (oCtrl) {
        //     if (oCtrl.hasStyleClass && oCtrl.hasStyleClass("sapUiPositiveText")) {
        //         sPrice = oCtrl.getText();
        //     }
        // });

        // // Update model
        // var oModel = this.getView().getModel("selectionModel");
        // oModel.setProperty("/visible", true);
        // oModel.setProperty("/text", sTitle);
        // oModel.setProperty("/price", sPrice);
        // },
        onReviewRequest: function (oEvent) {
            var oRowData = oEvent.getSource()
                .getBindingContext()
                .getObject();

            // Build review model (map row → dialog)
            var oReviewData = {
                requestId: oRowData.requestId,
                driver: oRowData.driver,
                driverId: oRowData.driverId,
                initials: oRowData.driver.split(" ").map(w => w[0]).join(""),
                amount: oRowData.amount,
                purpose: oRowData.purpose,
                trip: "BKK-HKT",
                dates: "Jan 15–17, 2026",
                history: "2 advances this month (฿13,000) | Outstanding: ฿0 | 100% on-time"
            };
            if (!this._oAdvanceApprovalDialog) {
                this._oAdvanceApprovalDialog = this.loadFragment("intellicarrier.view.AdvanceApproval");
            }
            var oModel = new sap.ui.model.json.JSONModel(oReviewData);
            this.getView().setModel(oModel, "reviewModel");
            this._oAdvanceApprovalDialog.then(function (oDialog) {
                oDialog.open();
            });

        },
        onCloseAdvanceApproval: function () {
            this._oAdvanceApprovalDialog.then(function (oDialog) {
                oDialog.close();
            });
        },

        onApproveAdvance: function () {
            sap.m.MessageToast.show("Advance Approved");
            this.onCloseAdvanceApproval();
        },

        onRejectAdvance: function () {
            sap.m.MessageToast.show("Advance Rejected");
            this.onCloseAdvanceApproval();
        },
        onOpenNewAdvanceDialog: function () {

            if (!this._oNewAdvanceDialog) {
                this._oNewAdvanceDialog = this.loadFragment("intellicarrier.view.NewCashAdvanceRequest");
            }
            this._oNewAdvanceDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        onCloseNewAdvanceDialog: function () {
            this._oNewAdvanceDialog.then(function (oDialog) {
                oDialog.close();
            });
        },

        onSubmitAdvanceRequest: function () {
            sap.m.MessageToast.show("Advance Request Submitted for Approval");
            this.onCloseNewAdvanceDialog();
        },
        onOpenDocPrintDialog: function () {


            if (!this._oDocPrintDialog) {
                this._oDocPrintDialog = this.loadFragment("intellicarrier.view.DocPrintDialog");
            }
            var oModel = new sap.ui.model.json.JSONModel({
                shipmentId: "FO-2026-00001",
                customer: "Customer Name",
                fleetType: "🚛 Internal Fleet",
                origin: "Bangkok",
                destination: "Chiang Mai",
                vehicle: "TK-001",
                driver: "Somchai P."
            });

            this.getView().setModel(oModel, "docModel");
            this._oDocPrintDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        onCloseDocPrintDialog: function () {
            this._oDocPrintDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        onProductOrRouteChange: function () {
            var oModel = this.getView().getModel("formModel");

            var sProduct = oModel.getProperty("/productType");
            var sRoute = oModel.getProperty("/routeCode");

            if (sProduct && sRoute) {
                // Lookup example data based on Product + Route combination
                var oRateMap = {
                    "RT-CONT-001": {
                        distance: "120 km",
                        duration: "2-3 hrs",
                        baseRate: "฿0.4/kg",
                        zlsdeScreen: "ZLSDE015"
                    },
                    "RT-CONT-002": {
                        distance: "685 km",
                        duration: "1-2 days",
                        baseRate: "฿1.2/kg",
                        zlsdeScreen: "ZLSDE025"
                    },
                    "RT-LPG-001": {
                        distance: "147 km",
                        duration: "3-4 hrs",
                        baseRate: "฿0.8/kg",
                        zlsdeScreen: "ZLSDE035"
                    }
                };

                var sKey = sRoute;
                var oData = oRateMap[sKey];

                if (oData) {
                    oModel.setProperty("/distance", oData.distance);
                    oModel.setProperty("/duration", oData.duration);
                    oModel.setProperty("/baseRate", oData.baseRate);
                    oModel.setProperty("/zlsdeScreen", oData.zlsdeScreen);
                } else {
                    // fallback if mapping not available
                    oModel.setProperty("/distance", "N/A");
                    oModel.setProperty("/duration", "N/A");
                    oModel.setProperty("/baseRate", "N/A");
                    oModel.setProperty("/zlsdeScreen", "N/A");
                }
            } else {
                // Clear when one dropdown removed
                oModel.setProperty("/distance", "");
                oModel.setProperty("/duration", "");
                oModel.setProperty("/baseRate", "");
                oModel.setProperty("/zlsdeScreen", "");
            }
        },

        onOpenZlsdeScreen: function () {
            MessageToast.show("Opening ZLSDE Screen...");
        },
        onDriverChange: function (oEvent) {
            var sDriverId = oEvent.getSource().getSelectedKey();
            var oModel = this.getView().getModel("driverModel");

            if (!sDriverId) {
                // Clear everything
                oModel.setProperty("/selectedDriverId", "");
                oModel.setProperty("/driverDetails", "");
                oModel.setProperty("/cost", {
                    base: "",
                    fuel: "",
                    surcharge: "",
                    serviceFee: "",
                    total: ""
                });
                return;
            }

            // Store selected driver
            oModel.setProperty("/selectedDriverId", sDriverId);

            // Demo driver details + costs (you can replace with backend)
            var oDriverDataMap = {
                "DRV-003": {
                    details: "📞 081-456-7890 | 🧾 Class 2 + Fuel | ⭐ 4.5",
                    cost: {
                        base: "฿5,500",
                        fuel: "฿420",
                        surcharge: "฿0",
                        serviceFee: "฿275",
                        total: "฿6,195"
                    }
                },
                "DRV-001": {
                    details: "📞 081-111-2222 | 🧾 Class 1 | ⭐ 4.8",
                    cost: {
                        base: "฿5,200",
                        fuel: "฿380",
                        surcharge: "฿50",
                        serviceFee: "฿250",
                        total: "฿5,880"
                    }
                },
                "DRV-002": {
                    details: "📞 089-333-4444 | 🧾 Class 2 | ⭐ 4.6",
                    cost: {
                        base: "฿5,350",
                        fuel: "฿410",
                        surcharge: "฿25",
                        serviceFee: "฿260",
                        total: "฿6,045"
                    }
                }
            };

            var oSelectedData = oDriverDataMap[sDriverId];

            oModel.setProperty("/driverDetails", oSelectedData.details);
            oModel.setProperty("/cost", oSelectedData.cost);

        },
        onDocSelect: function (oEvent) {
            oEvent.getSource().toggleStyleClass("selected");
        },
        onViewDetailsFreight: function (oEvent) {
            var oRowData = oEvent.getSource().getBindingContext("orders").getObject();
            if (!this._oOrderDetailsDialog) {
                this._oOrderDetailsDialog = this.loadFragment("intellicarrier.view.OrderDetails");
            }
            // Map row data into dialog model
            var oDetailsData = {
                orderId: oRowData.orderId,
                customerName: oRowData.customerName,
                customerEmail: oRowData.customerEmail || "orders@" + (oRowData.customerName || "customer") + ".com",
                customerPhone: oRowData.customerPhone || "+66 2 567 8901",
                statusText: oRowData.statusText || "Confirmed",
                statusState: oRowData.statusState || "Success",

                sourceText: oRowData.sourceText || "Email BOT",
                createdOn: oRowData.createdOn || "2026-01-08 08:45",
                createdBy: oRowData.createdBy || "System (BOT)",
                ocrConfidence: oRowData.ocrConfidence || "98.1%",

                pickupDate: oRowData.pickupDate || "2026-01-13",
                deliveryDate: oRowData.deliveryDate,
                weight: oRowData.weight || "500 kg",
                value: oRowData.value || "High",


            };

            var oModel = new sap.ui.model.json.JSONModel(oDetailsData);
            this.getView().setModel(oModel, "orderDetails");

            this._oOrderDetailsDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onCloseOrderDetails: function () {

            this._oOrderDetailsDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        onViewExpense: function (oEvent) {
            var oRowData = oEvent.getSource().getBindingContext().getObject();

            if (!this._oOCRReceiptDialog) {
                this._oOCRReceiptDialog = this.loadFragment("intellicarrier.view.OCRReceiptProcessing");
            }
            // ✅ set dialog model based on clicked row
            var oOcrData = {
                vendor: oRowData.vendor || "Shell #1234",
                amount: oRowData.amount || "2450.00",
                date: oRowData.date || "2026-01-11",
                category: oRowData.category || "FUEL",
                gallons: oRowData.gallons || "62.5",

                vendorConf: "98%",
                amountConf: "99%",
                dateConf: "97%",
                categoryConf: "96%",
                gallonsConf: "94%"
            };

            var oModel = new sap.ui.model.json.JSONModel(oOcrData);
            this.getView().setModel(oModel, "ocrModel");

            this._oOCRReceiptDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onCloseOCRReceiptDialog: function () {
            this._oOCRReceiptDialog.then(function (oDialog) {
                oDialog.close();
            });
        },

        onConfirmOCRReceipt: function () {
            sap.m.MessageToast.show("✅ OCR Confirmed Successfully");
            this.onCloseOCRReceiptDialog();
        },
        onReconcile: function (oEvent) {
            var oRow = oEvent.getSource().getBindingContext().getObject();


            if (!this._oReconcileDialog) {
                this._oReconcileDialog = this.loadFragment("intellicarrier.view.ReconciliationSettlement");
            }
            // Convert balance to "To Return" (example logic)
            // If balance = "฿2,150" then toReturn = same
            var sAdvance = oRow.advance || "฿0";
            var sExpenses = oRow.expenses || "฿0";
            var sToReturn = oRow.balance || "฿0";

            var oRecModel = new sap.ui.model.json.JSONModel({
                advanceId: oRow.advanceId,
                driver: oRow.driver,
                driverId: oRow.driverId,

                advance: sAdvance,
                expenses: sExpenses,
                toReturn: sToReturn,

                settlementType: "EXCESS",
                recoveryMethod: "PAYROLL",
                recoveryMethodText: "Payroll Deduction"
            });

            this.getView().setModel(oRecModel, "recModel");
            this._oReconcileDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        onCloseReconcileDialog: function () {
            this._oReconcileDialog.then(function (oDialog) {
                oDialog.close();
            });
        },

        onProcessSettlement: function () {
            this.onCloseReconcileDialog();

            // Example generated Settlement ID
            var sSettlementId = "806222";

            // Get values from model
            var oRecData = this.getView().getModel("recModel").getData();
            var sRefundAmount = oRecData.toReturn || "฿0";

            sap.m.MessageBox.information(
                "✅ Settlement Processed!\n\n" +
                "• " + sSettlementId + "\n" +
                "• " + sRefundAmount + " Refund\n" +
                "• Posted to S/4HANA",
                {
                    title: "This page says"
                }
            );

        },
        onViewActiveAdvance: function (oEvent) {

            // get selected row data
            var oRowData = oEvent.getSource().getBindingContext().getObject();

            // create fragment o
            if (!this._oAdvanceDetailsDialog) {
                this._oAdvanceDetailsDialog = this.loadFragment("intellicarrier.view.AdvanceDetails");
            }
            // bind selected data to dialog model
            var oModel = new sap.ui.model.json.JSONModel({
                advanceId: oRowData.advanceId,
                advance: oRowData.advance,
                expenses: oRowData.expenses,
                remaining: oRowData.remaining,
                usagePercent: oRowData.usagePercent,
                status: oRowData.status,
                statusState: oRowData.statusState
            });

            this.getView().setModel(oModel, "advDetails");
            this._oAdvanceDetailsDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onCloseAdvanceDetails: function () {
            this._oAdvanceDetailsDialog.then(function (oDialog) {
                oDialog.close();
            });
        },
        onReconcile1: function () {

            this.onCloseAdvanceDetails();


            // ✅ get selected advance data from dialog model
            var oAdvData = this.getView().getModel("advDetails").getData();

            if (!this._oReconcileDialog) {
                this._oReconcileDialog = this.loadFragment("intellicarrier.view.ReconciliationSettlement");
            }

            // ✅ Bind selected advance values to reconcile dialog model
            var oRecModel = new sap.ui.model.json.JSONModel({
                advanceId: oAdvData.advanceId,
                advance: oAdvData.advance,
                expenses: oAdvData.expenses,
                toReturn: oAdvData.remaining,

                settlementType: "EXCESS",
                recoveryMethod: "PAYROLL",
                recoveryMethodText: "Payroll Deduction"
            });

            this.getView().setModel(oRecModel, "recModel");
            this._oReconcileDialog.then(function (oDialog) {
                oDialog.open();
            });
        },


        onViewMaintenance: function (oEvent) {
            var oContext = oEvent.getSource()
                .getParent()
                .getBindingContext("vehicleDataModel");

            this._openWorkOrderDetailsDialog(oContext);
        },

        onCreateMaintenance: function () {
            var oView = this.getView();

            if (!this.CreateMaintenanceDialog) {
                this.CreateMaintenanceDialog = Fragment.load({
                    id: oView.getId(),
                    name: "intellicarrier.view.CreateWorkOrder",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this.CreateMaintenanceDialog.then(function (oDialog) {
                // oDialog.setBindingContext(oContext, "vehicleDataModel");
                oDialog.open();
            });
        },
        _openWorkOrderDetailsDialog: function (oContext) {
            var oView = this.getView();

            if (!this._pWorkOrderDetailsDialog) {
                this._pWorkOrderDetailsDialog = Fragment.load({
                    id: oView.getId(),
                    name: "intellicarrier.view.WorkOrderDetails",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pWorkOrderDetailsDialog.then(function (oDialog) {
                oDialog.setBindingContext(oContext, "vehicleDataModel");
                oDialog.open();
            });
        },

        onCreateTemplate: function () {
            var oView = this.getView();

            if (!this.onCreateTemplateDialog) {
                this.onCreateTemplateDialog = Fragment.load({
                    id: oView.getId(),
                    name: "intellicarrier.view.CreateChecklistTemplate",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this.onCreateTemplateDialog.then(function (oDialog) {
                // oDialog.setBindingContext(oContext, "vehicleDataModel");
                oDialog.open();
            });
        },



        onMarkComplete: function () {
            var oDialog = this.byId("workOrderDetailsDialog");
            var oContext = oDialog.getBindingContext("vehicleDataModel");
            var oModel = oContext.getModel();
            var sPath = oContext.getPath();

            oModel.setProperty(sPath + "/maintStatus", "Completed");
            oModel.setProperty(sPath + "/maintStatusState", "Success");

            sap.m.MessageToast.show("Work order marked as complete");
            this.onCloseDialog();
        },

        onCloseDialog: function () {
            // Close all dialogs
            if (this._pWorkOrderDetailsDialog) {
                this._pWorkOrderDetailsDialog.then(function (oDialog) {
                    oDialog.close();
                });
            }
            if (this.CreateMaintenanceDialog) {
                this.CreateMaintenanceDialog.then(function (oDialog) {
                    oDialog.close();
                });
            }
            if (this.onCreateTemplateDialog) {
                this.onCreateTemplateDialog.then(function (oDialog) {
                    oDialog.close();
                });
            }
        },
        onOpenShippingPointDialog: function () {
            if (!this._oShippingPointDialog) {
                this._oShippingPointDialog = sap.ui.xmlfragment(
                    this.getView().getId(),
                    "intellicarrier.view.ShippingPointMaster",
                    this
                );
                this.getView().addDependent(this._oShippingPointDialog);
            }
            this._oShippingPointDialog.open();
        },

        onCloseShippingPointDialog: function () {
            this._oShippingPointDialog.close();
        },

        onOpenDriverHistoryDialog: function () {
            if (!this._oDriverHistoryDialog) {
                this._oDriverHistoryDialog = sap.ui.xmlfragment(
                    this.getView().getId(),
                    "intellicarrier.view.DriverGateScanHistory",
                    this
                );
                this.getView().addDependent(this._oDriverHistoryDialog);
            }
            this._oDriverHistoryDialog.open();
        },

        onCloseDriverHistoryDialog: function () {
            this._oDriverHistoryDialog.close();
        }



    });
});