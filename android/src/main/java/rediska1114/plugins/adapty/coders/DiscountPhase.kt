package rediska1114.plugins.adapty.coders

import com.adapty.models.AdaptyPaywallProduct.Price
import com.adapty.models.AdaptyProductDiscountPhase
import com.adapty.models.AdaptyProductDiscountPhase.PaymentMode
import com.adapty.models.AdaptyProductSubscriptionPeriod
import com.getcapacitor.JSObject

public fun AdaptyProductDiscountPhase.toJson(): JSObject {
    val data = JSObject()

    data.put("price", price.toJson())
    data.put("number_of_periods", numberOfPeriods)
    data.put("payment_mode", paymentMode)
    data.put("subscription_period", subscriptionPeriod.toJson())
    data.put("localized_subscription_period", localizedSubscriptionPeriod)


    return data
}
