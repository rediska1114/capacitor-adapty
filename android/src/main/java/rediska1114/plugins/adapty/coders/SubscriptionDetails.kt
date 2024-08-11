package rediska1114.plugins.adapty.coders

import com.adapty.models.AdaptyProductDiscountPhase
import com.adapty.models.AdaptyProductSubscriptionDetails
import com.adapty.models.AdaptyProductSubscriptionDetails.RenewalType
import com.adapty.models.AdaptyProductSubscriptionPeriod
import com.adapty.utils.ImmutableList
import com.getcapacitor.JSObject

public fun AdaptyProductSubscriptionDetails.toJson(): JSObject {
    val data = JSObject()

    data.put("android_offer_id", offerId)
    data.put("android_base_plan_id", basePlanId)
    data.put("introductory_offer_eligibility", introductoryOfferEligibility)

    data.put("android_offer_tags", offerTags.toJSArray())
    data.put("android_renewal_type", renewalType)
    data.put("subscription_period", subscriptionPeriod.toJson())

    data.put("localized_subscription_period", localizedSubscriptionPeriod)
    data.put("introductory_offer_phases", introductoryOfferPhases.map { it.toJson() }.toJSArray())
    return data
}