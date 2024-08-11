package rediska1114.plugins.adapty.coders

import android.util.Log
import com.adapty.models.AdaptyPaywall
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import org.json.JSONObject
import rediska1114.plugins.adapty.AdaptyPlugin
import java.lang.reflect.Constructor
import java.util.ArrayList
import com.google.gson.Gson


public fun AdaptyPaywall.toJson(): JSObject {
    val data = JSObject()

    data.put("developer_id", placementId)
    data.put("paywall_id", placementId)
    data.put("revision", revision)
    data.put("variation_id", variationId)
    data.put("ab_test_name", abTestName)
    data.put("paywall_name", name)

    data.put("use_paywall_builder", hasViewConfiguration)

    val remoteConfig = JSObject()
    remoteConfig.put("lang", locale)
    remoteConfig.put("data", remoteConfigString)

    data.put("remote_config", remoteConfig)
    data.put("paywall_updated_at", accessField("updatedAt") as Long)
    data.put("payload_data", remoteConfigString)

    val productList = accessField("products") as List<Any>

    data.put("products", productList.map { product -> backendProductToJson(product) }.toJSArray())
    data.put("vendorProductIds", JSArray.from(vendorProductIds))

    Log.w(AdaptyPlugin.Companion.TAG, "vendorProductIds: $vendorProductIds")

    return data
}


public fun paywallFromJson(data: JSObject): AdaptyPaywall {
   val paywallJson = JSObject()

    paywallJson.put("placementId", data.getString("developer_id"))
    paywallJson.put("name", data.getString("paywall_name"))
    paywallJson.put("abTestName", data.getString("ab_test_name"))
    paywallJson.put("revision", data.getInt("revision"))
    paywallJson.put("variationId", data.getString("variation_id"))
    paywallJson.put("locale", data.getJSObject("remote_config")?.getString("lang"))
    paywallJson.put("remoteConfigString", data.getJSObject("remote_config")?.getString("data"))
    // public val remoteConfig: ImmutableMap<String, Any>?,
    paywallJson.put("hasViewConfiguration", data.getBoolean("use_paywall_builder"))
   
    paywallJson.put("paywallId", data.getString("paywall_id"))
    paywallJson.put("updatedAt", data.getLong("paywall_updated_at"))


    val gson = Gson()
    val paywall = gson.fromJson<AdaptyPaywall>(paywallJson.toString() ,AdaptyPaywall::class.java)
    val products = data.getJSList("products").map { backendProductFromJson(it)!! }
    paywall.setPrivateField("products", products)
    return paywall
}

public fun backendProductToJson(product: Any): JSObject {
    val data = JSObject()

    val type = product.accessField("type").toString()

    val gson = Gson();
    val jsonProduct = JSObject(gson.toJson(product))

    data.put("vendor_product_id", jsonProduct.getString("vendorProductId"))
    data.put("adapty_product_id", jsonProduct.getString("id"))
    data.put("is_consumable", type == "cons")

    if (type == "subs") {
        data.put("base_plan_id", jsonProduct.getJSObject("type")?.getJSObject("subscriptionData")?.getString("basePlanId"))
        data.put("offer_id", jsonProduct.getJSObject("type")?.getJSObject("subscriptionData")?.getString("offerId"))
    }

    return data
}


fun backendProductFromJson(jsObject: JSObject): Any? {
    return try {
        // see com/adapty/internal/domain/models/BackendProduct.kt
        // Reflectively load the classes
        val backendProductClass = Class.forName("com.adapty.internal.domain.models.BackendProduct")
        val subscriptionDataClass = Class.forName("com.adapty.internal.domain.models.BackendProduct\$SubscriptionData")
        val consumableClass = Class.forName("com.adapty.internal.domain.models.ProductType\$Consumable")
        val nonConsumableClass = Class.forName("com.adapty.internal.domain.models.ProductType\$NonConsumable")
        val subscriptionClass = Class.forName("com.adapty.internal.domain.models.ProductType\$Subscription")

        // Get the constructor for SubscriptionData
        val subscriptionDataConstructor: Constructor<*> = subscriptionDataClass.getConstructor(String::class.java, String::class.java)

        // Get the values from the JSObject
        val id = jsObject.getString("adapty_product_id")
        val vendorProductId = jsObject.getString("vendor_product_id")
        val timestamp = System.currentTimeMillis()
        val basePlanId = jsObject.getString("base_plan_id")
        val offerId = jsObject.getString("offer_id")
        val isConsumable = jsObject.getBoolean("is_consumable", false) ?: false

        // Determine the ProductType
        val type: Any? = if (isConsumable) {
            consumableClass.getDeclaredField("INSTANCE").get(null)
        } else {
            if (basePlanId != null || offerId != null) {
                val subscriptionData = subscriptionDataConstructor.newInstance(basePlanId, offerId)
                subscriptionClass.getConstructor(subscriptionDataClass).newInstance(subscriptionData)
            } else {
                nonConsumableClass.getDeclaredField("INSTANCE").get(null)
            }
        }

        // Get the constructor for BackendProduct
        val backendProductConstructor: Constructor<*> = backendProductClass.getConstructor(
            String::class.java,
            String::class.java,
            Long::class.java,
            Class.forName("com.adapty.internal.domain.models.ProductType")
        )

        // Create and return an instance of BackendProduct
        backendProductConstructor.newInstance(id, vendorProductId, timestamp, type)
    } catch (e: Exception) {
        e.printStackTrace()
        null
    }
}
