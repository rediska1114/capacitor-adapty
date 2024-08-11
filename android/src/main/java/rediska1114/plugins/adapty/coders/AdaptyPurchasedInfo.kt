package rediska1114.plugins.adapty.coders

import com.adapty.models.AdaptyProfile
import com.adapty.models.AdaptyPurchasedInfo
import com.getcapacitor.JSObject
import com.android.billingclient.api.Purchase

public fun AdaptyPurchasedInfo.toJson(): JSObject {
    val data = JSObject()

    val purchaseJs = JSObject()
    purchaseJs.put("acknowledged", purchase.isAcknowledged)
    purchaseJs.put("autoRenewing", purchase.isAutoRenewing)
    purchaseJs.put("orderId", purchase.orderId)
    purchaseJs.put("packageName", purchase.packageName)
    purchaseJs.put("productIds", purchase.products.toJSArray())
    purchaseJs.put("purchaseState", purchase.purchaseState)
    purchaseJs.put("purchaseTime", purchase.purchaseTime)
    purchaseJs.put("purchaseToken", purchase.purchaseToken)
    purchaseJs.put("quantity", purchase.quantity)


    data.put("profile", profile.toJson())
    data.put("purchase", purchaseJs)
    data.put("vendor_transaction_id", purchase.orderId)
    data.put("vendor_original_transaction_id", purchase.orderId)

    return data
}
