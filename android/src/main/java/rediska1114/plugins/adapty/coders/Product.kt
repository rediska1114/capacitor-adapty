package rediska1114.plugins.adapty.coders

import com.adapty.Adapty
import com.adapty.models.AdaptyPaywallProduct
import com.getcapacitor.JSObject
import com.google.gson.Gson
import java.lang.reflect.Constructor

public fun AdaptyPaywallProduct.toJson(): JSObject {
    val data = JSObject()

    val gson = Gson();
    val jsonPayload = JSObject(gson.toJson(accessField("payloadData")))

    data.put("vendor_product_id", vendorProductId)
    data.put("adapty_product_id", "")
    data.put("localized_title", localizedTitle)
    data.put("localized_description", localizedDescription)
    data.put("paywall_name", paywallName)
    data.put("paywall_ab_test_name", paywallABTestName)
    data.put("paywall_variation_id", variationId)
    data.put("price", price.toJson())
    data.put("subscription_details", subscriptionDetails?.toJson())
    data.put("payload_data", jsonPayload)

    return data
}

public fun paywallProductFromJson(data: JSObject): AdaptyPaywallProduct  {
    val productJson = JSObject()

    productJson.put("vendorProductId", data.getString("vendor_product_id"))
    productJson.put("paywallName", data.getString("paywall_name"))
    productJson.put("paywallABTestName", data.getString("paywall_ab_test_name"))
    productJson.put("variationId", data.getString("paywall_variation_id"))
    productJson.put("localizedTitle", data.getString("adapty_product_id"))
    productJson.put("payloadData", data.getJSObject("payload_data"))

    val gson = Gson()
    val product = gson.fromJson<AdaptyPaywallProduct>(productJson.toString() ,AdaptyPaywallProduct::class.java)

    return product
}