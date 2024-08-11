package rediska1114.plugins.adapty.coders

import com.adapty.models.AdaptyProfile
import com.getcapacitor.JSObject

public fun AdaptyProfile.NonSubscription.toJson(): JSObject {
    val data = JSObject()

    data.put("purchase_id", purchaseId)
    data.put("store", store)
    data.put("vendor_product_id", vendorProductId)
    data.put("vendor_transaction_id", vendorTransactionId)
    data.put("purchased_at", purchasedAt)
    data.put("is_sandbox", isSandbox)
    data.put("is_refund", isRefund)
    data.put("is_consumable", isConsumable)

    return data
}