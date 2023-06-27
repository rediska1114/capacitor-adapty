#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(AdaptyPlugin, "Adapty",
           CAP_PLUGIN_METHOD(getPaywall, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(activate, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(updateAttribution, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getPaywallProducts, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(logShowOnboarding, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(logShowPaywall, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setFallbackPaywalls, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getProfile, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(identify, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(logout, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(updateProfile, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(presentCodeRedemptionSheet, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(restorePurchases, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setLogLevel, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(makePurchase, CAPPluginReturnPromise);
)
