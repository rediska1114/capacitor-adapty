package rediska1114.plugins.adapty

import com.adapty.Adapty
import com.adapty.Adapty.activate
import com.adapty.internal.utils.DEFAULT_PAYWALL_TIMEOUT_MILLIS
import com.adapty.internal.utils.InternalAdaptyApi
import com.adapty.models.AdaptyAttributionSource
import com.adapty.models.AdaptyPaywall
import com.adapty.models.AdaptySubscriptionUpdateParameters
import com.adapty.utils.AdaptyLogLevel
import com.adapty.utils.AdaptyResult
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import rediska1114.plugins.adapty.coders.paywallFromJson
import rediska1114.plugins.adapty.coders.paywallProductFromJson
import rediska1114.plugins.adapty.coders.profileParametersFromJson
import rediska1114.plugins.adapty.coders.toJSArray
import rediska1114.plugins.adapty.coders.toJson

var MEMO_ACTIVATE_ARGS: Boolean = false

@CapacitorPlugin(name = "Adapty")
class AdaptyPlugin : Plugin() {

  @PluginMethod
  fun activate(call: PluginCall) {
    if (MEMO_ACTIVATE_ARGS) {
      call.resolve()
      return
    }

    val apiKey = call.getString("apiKey") ?: return call.reject("apiKey is required")

    val customerUserId = call.getString("customerUserId")
    val logLevelStr = call.getString("logLevel", "none")
    val observerMode = call.getBoolean("observerMode", false)
    //        val libVersion = call.getString("libVersion")

    var logLevel = AdaptyLogLevel.NONE

    if (logLevelStr != null) {
      logLevel =
          when (logLevelStr) {
            "verbose" -> AdaptyLogLevel.VERBOSE
            "info" -> AdaptyLogLevel.INFO
            "warn" -> AdaptyLogLevel.WARN
            "error" -> AdaptyLogLevel.ERROR
            else -> AdaptyLogLevel.NONE
          }
    }

    try {
      Adapty.logLevel = logLevel

      Adapty.activate(
          bridge.activity.applicationContext,
          //             new AdaptyConfig.Builder(apiKey)
          //                    .withObserverMode(observerMode)
          //                    .withCustomerUserId(customerUserId)
          //                    .build());

          apiKey,
          observerMode!!,
          customerUserId,
      )

      MEMO_ACTIVATE_ARGS = true

      call.resolve()
    } catch (e: Exception) {
      call.reject(e.localizedMessage)
    }
  }

  @PluginMethod
  fun updateAttribution(call: PluginCall) {
    val attribution = call.getObject("attribution") ?: return call.reject("attribution is required")
    val sourceStr = call.getString("source") ?: return call.reject("source is required")
    val networkUserId = call.getString("networkUserId")

    val source =
        when (sourceStr) {
          "appsflyer" -> AdaptyAttributionSource.APPSFLYER
          "adjust" -> AdaptyAttributionSource.ADJUST
          "branch" -> AdaptyAttributionSource.BRANCH
          else -> AdaptyAttributionSource.CUSTOM
        }

    Adapty.updateAttribution(attribution, source, networkUserId) { error ->
      if (error != null) {
        call.reject(error.localizedMessage)
      } else {
        call.resolve()
      }
    }
  }

  @InternalAdaptyApi
  @PluginMethod
  fun getPaywall(call: PluginCall) {
    val placementId = call.getString("placementId") ?: return call.reject("placementId is required")
    val locale = call.getString("locale")
    val fetchPolicyStr = call.getString("fetchPolicy", "default")

    try {

      val fetchPolicy =
          when (fetchPolicyStr) {
            "return_cache_data_else_load" ->
                AdaptyPaywall.FetchPolicy.Companion.ReturnCacheDataElseLoad
            "reload_revalidating_cache_data" ->
                AdaptyPaywall.FetchPolicy.Companion.ReloadRevalidatingCacheData
            else -> AdaptyPaywall.FetchPolicy.Companion.Default
          }

      val loadTimeoutMillis =
          call.getDouble("loadTimeout")?.toInt()?.let { it / 1000 }
              ?: DEFAULT_PAYWALL_TIMEOUT_MILLIS

      Adapty.getPaywall(placementId, locale, fetchPolicy, loadTimeoutMillis) { result ->
        when (result) {
          is AdaptyResult.Success -> {

            val data = JSObject()
            data.put("paywall", result.value.toJson())
            call.resolve(data)
          }
          is AdaptyResult.Error -> call.reject(result.error.localizedMessage)
        }
      }
    } catch (e: Exception) {
      call.reject(e.localizedMessage)
    }
  }

  @PluginMethod
  fun getPaywallProducts(call: PluginCall) {
    val paywallData = call.getObject("paywall") ?: return call.reject("paywall is required")

    try {
      val paywall = paywallFromJson(paywallData)

      Adapty.getPaywallProducts(paywall) { result ->
        when (result) {
          is AdaptyResult.Success -> {
            val data = JSObject()
            data.put("products", result.value.map { it.toJson() }.toJSArray())
            call.resolve(data)
          }

          is AdaptyResult.Error -> call.reject(result.error.localizedMessage)
        }
      }
    } catch (e: Exception) {
      call.reject(e.localizedMessage)
    }
  }

  @PluginMethod
  fun getProductsIntroductoryOfferEligibility(call: PluginCall) {
    val data = JSObject()
    call.resolve(data)
  }

  @PluginMethod
  fun logShowOnboarding(call: PluginCall) {
    val name = call.getString("name")
    val screenName = call.getString("screenName")
    val screenOrder = call.getInt("screenOrder") ?: return call.reject("screenOrder is required")

    Adapty.logShowOnboarding(name, screenName, screenOrder) { error ->
      if (error != null) {
        call.reject(error.localizedMessage)
      } else {
        call.resolve()
      }
    }
  }

  @PluginMethod
  fun logShowPaywall(call: PluginCall) {
    val paywallData = call.getObject("paywall") ?: return call.reject("paywall is required")

    try {
      val paywall = paywallFromJson(paywallData)

      Adapty.logShowPaywall(paywall) { error ->
        if (error != null) {
          call.reject(error.localizedMessage)
        } else {
          call.resolve()
        }
      }
    } catch (e: Exception) {
      call.reject(e.localizedMessage)
    }
  }

  @PluginMethod
  fun setFallbackPaywalls(call: PluginCall) {
    val fileName = call.getString("fileName") ?: "android_fallback.json"

    // val location = FileLocation.fromAsset(fileName)

    try {
      Adapty.setFallbackPaywalls(fileName) { error ->
        if (error != null) {
          call.reject(error.localizedMessage)
        } else {
          call.resolve()
        }
      }
    } catch (e: Exception) {
      call.reject(e.localizedMessage)
    }
  }

  @PluginMethod
  fun getProfile(call: PluginCall) {
    Adapty.getProfile() { result ->
      when (result) {
        is AdaptyResult.Success -> {
          val data = JSObject()
          data.put("profile", result.value.toJson())
          call.resolve(data)
        }

        is AdaptyResult.Error -> call.reject(result.error.localizedMessage)
      }
    }
  }

  @PluginMethod
  fun identify(call: PluginCall) {
    val customerUserId =
        call.getString("customerUserId") ?: return call.reject("customerUserId is required")

    Adapty.identify(customerUserId) { error ->
      if (error != null) {
        call.reject(error.localizedMessage)
      } else {
        call.resolve()
      }
    }
  }

  @PluginMethod
  fun logout(call: PluginCall) {
    Adapty.logout() { error ->
      if (error != null) {
        call.reject(error.localizedMessage)
      } else {
        call.resolve()
      }
    }
  }

  @PluginMethod
  fun updateProfile(call: PluginCall) {
    val paramsData = call.getObject("params") ?: return call.reject("params is required")

    val params = profileParametersFromJson(paramsData)

    Adapty.updateProfile(params) { error ->
      if (error != null) {
        call.reject(error.localizedMessage)
      } else {
        call.resolve()
      }
    }
  }

  @PluginMethod
  fun makePurchase(call: PluginCall) {
    val productData = call.getObject("product") ?: return call.reject("product is required")
    val options = call.getObject("android")
    val isOfferPersonalized = options?.getBoolean("is_offer_personalized", false)

    var params: AdaptySubscriptionUpdateParameters? = null
    if (options != null) {
      val replacementModeStr =
          options.getString("replacement_mode")
              ?: return call.reject("replacement_mode is required")
      val oldSubVendorProductId =
          options.getString("old_sub_vendor_product_id")
              ?: return call.reject("old_sub_vendor_product_id is required")

      val replacementMode =
          when (replacementModeStr) {
            "with_time_proration" ->
                AdaptySubscriptionUpdateParameters.ReplacementMode.WITH_TIME_PRORATION
            "charge_prorated_price" ->
                AdaptySubscriptionUpdateParameters.ReplacementMode.CHARGE_PRORATED_PRICE
            "without_proration" ->
                AdaptySubscriptionUpdateParameters.ReplacementMode.WITHOUT_PRORATION
            "deferred" -> AdaptySubscriptionUpdateParameters.ReplacementMode.DEFERRED
            "charge_full_price" ->
                AdaptySubscriptionUpdateParameters.ReplacementMode.CHARGE_FULL_PRICE
            else -> return call.reject("replacement_mode is invalid")
          }

      params =
          AdaptySubscriptionUpdateParameters(
              oldSubVendorProductId,
              replacementMode,
          )
    }

    val product = paywallProductFromJson(productData)

    Adapty.makePurchase(
        activity = bridge.activity,
        product = product,
        subscriptionUpdateParams = params,
        isOfferPersonalized = isOfferPersonalized ?: false) { result ->
          when (result) {
            is AdaptyResult.Success -> {
              val data = JSObject()
              data.put("purchase", result.value?.toJson())
              call.resolve(data)
            }

            is AdaptyResult.Error -> call.reject(result.error.localizedMessage)
          }
        }
  }

  @PluginMethod
  fun presentCodeRedemptionSheet(call: PluginCall) {
    call.resolve()
  }

  @PluginMethod
  fun restorePurchases(call: PluginCall) {
    Adapty.restorePurchases { result ->
      when (result) {
        is AdaptyResult.Success -> {
          val data = JSObject()
          data.put("profile", result.value.toJson())
          call.resolve(data)
        }
        is AdaptyResult.Error -> call.reject(result.error.localizedMessage)
      }
    }
  }

  @PluginMethod
  fun setLogLevel(call: PluginCall) {
    val logLevelStr = call.getString("logLevel") ?: return call.reject("logLevel is required")

    val logLevel =
        when (logLevelStr) {
          "verbose" -> AdaptyLogLevel.VERBOSE
          "info" -> AdaptyLogLevel.INFO
          "warn" -> AdaptyLogLevel.WARN
          "error" -> AdaptyLogLevel.ERROR
          else -> AdaptyLogLevel.NONE
        }

    Adapty.logLevel = logLevel
    call.resolve()
  }

  // didLoadLatestProfile // TODO

  companion object {
    const val TAG: String = "AdaptyPlugin"
  }
}
