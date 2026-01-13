sap.ui.define([
    "sap/ui/core/UIComponent",
    "intellicarrier/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("intellicarrier.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            jQuery.sap.includeStyleSheet("css/style.css");

            // enable routing
            this.getRouter().initialize();
        }
    });
});