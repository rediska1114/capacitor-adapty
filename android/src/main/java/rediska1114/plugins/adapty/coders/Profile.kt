package rediska1114.plugins.adapty.coders

import com.adapty.models.AdaptyProfile
import com.adapty.models.AdaptyProfile.AccessLevel
import com.adapty.models.AdaptyProfile.NonSubscription
import com.adapty.models.AdaptyProfile.Subscription
import com.adapty.utils.ImmutableList
import com.adapty.utils.ImmutableMap
import com.getcapacitor.JSObject

public fun AdaptyProfile.toJson(): JSObject {
    val data = JSObject()
    
    data.put("profile_id", profileId)
    data.put("customer_user_id", customerUserId)
    data.put("segment_hash", "")

    val paidAccessLevelsObj = JSObject()
    accessLevels.forEach { level ->
        paidAccessLevelsObj.put(level.key, level.value.toJson())
    }
    data.put("paid_access_levels", paidAccessLevelsObj)

    val subscriptionsObj = JSObject()
    subscriptions.forEach { subscription ->
        subscriptionsObj.put(subscription.key, subscription.value.toJson())
    }
    data.put("subscriptions", subscriptionsObj)

    val nonSubscriptionsObj = JSObject()
    nonSubscriptions.forEach { nonSubscription ->
        nonSubscriptionsObj.put(nonSubscription.key, nonSubscription.value.map { it.toJson() }.toJSArray())
    }
    data.put("non_subscriptions", nonSubscriptionsObj)

    val customAttributesObj = JSObject()
    customAttributes.forEach { customAttribute ->
        customAttributesObj.put(customAttribute.key, customAttribute.value)
    }
    data.put("custom_attributes", customAttributesObj)

    return data
}