package rediska1114.plugins.adapty.coders

import com.adapty.models.AdaptyProductSubscriptionPeriod
import com.getcapacitor.JSObject


public fun AdaptyProductSubscriptionPeriod.toJson(): JSObject {
    val data = JSObject()

    data.put("unit", unit.name.toLowerCase())
    data.put("number_of_units", numberOfUnits)

    return data
}