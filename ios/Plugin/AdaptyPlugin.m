#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(AdaptyPlugin, "Adapty",
           CAP_PLUGIN_METHOD(getPaywalls, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(updateAttribution, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setExternalAnalyticsEnabled, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(logShowPaywall, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getAPNSToken, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setAPNSToken, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(identify, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(logout, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(updateProfile, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(presentCodeRedemptionSheet, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setVariationID, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getPromo, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(restorePurchases, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getPurchaseInfo, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getCustomerUserId, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(makePurchase, CAPPluginReturnPromise);
)
