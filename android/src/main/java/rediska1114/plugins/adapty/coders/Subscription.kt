package rediska1114.plugins.adapty.coders

import com.adapty.models.AdaptyProfile
import com.getcapacitor.JSObject

public fun AdaptyProfile.Subscription.toJson(): JSObject {
    val data = JSObject()

    data.put("is_active", isActive)
    data.put("vendor_product_id", vendorProductId)
    data.put("vendor_transaction_id", vendorTransactionId)
    data.put("vendor_original_transaction_id", vendorOriginalTransactionId)
    data.put("store", store)
    data.put("activated_at", activatedAt)
    data.put("renewed_at", renewedAt)
    data.put("expires_at", expiresAt)
    data.put("is_lifetime", isLifetime)
    data.put("active_introductory_offer_type", activeIntroductoryOfferType)
    data.put("active_promotional_offer_type", activePromotionalOfferType)
    data.put("offer_id", offerId)
    data.put("will_renew", willRenew)
    data.put("is_in_grace_period", isInGracePeriod)
    data.put("unsubscribed_at", unsubscribedAt)
    data.put("billing_issue_detected_at", billingIssueDetectedAt)
    data.put("starts_at", startsAt)
    data.put("cancellation_reason", cancellationReason)
    data.put("is_refund", isRefund)
    data.put("is_sandbox", isSandbox)

    return data
}