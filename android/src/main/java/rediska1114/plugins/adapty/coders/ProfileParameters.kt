package rediska1114.plugins.adapty.coders


import com.adapty.models.AdaptyProfile
import com.adapty.models.AdaptyProfileParameters
import com.getcapacitor.JSObject


public fun profileParametersFromJson(data: JSObject): AdaptyProfileParameters {
    val builder = AdaptyProfileParameters.Builder()
       
    if(data.has("first_name")) {
        builder.withFirstName(data.getString("first_name"))
    }

    if(data.has("last_name")) {
        builder.withLastName(data.getString("last_name"))
    }

    if(data.has("gender")) {
        val gender = when (data.getString("gender")?.lowercase()) {
            "male" -> AdaptyProfile.Gender.MALE
            "female" -> AdaptyProfile.Gender.FEMALE
            else ->  AdaptyProfile.Gender.OTHER
        }
        builder.withGender(gender)
    }

    if(data.has("birthday")) {
        // YYYY-MM-dd
        val date = data.getString("birthday")?.split("-")
        val year = date?.get(0)?.toInt() ?: 0
        val month = date?.get(1)?.toInt() ?: 0
        val day = date?.get(2)?.toInt() ?: 0

        builder.withBirthday(AdaptyProfile.Date(year = year, month = month, date = day))
    }

    if(data.has("email")) {
        builder.withEmail(data.getString("email"))
    }

    if(data.has("phone_number")) {
        builder.withPhoneNumber(data.getString("phone_number"))
    }

    if(data.has("facebook_anonymous_id")) {
        builder.withFacebookAnonymousId(data.getString("facebook_anonymous_id"))
    }

    if(data.has("amplitude_user_id")) {
        builder.withAmplitudeUserId(data.getString("amplitude_user_id"))
    }

    if(data.has("amplitude_device_id")) {
        builder.withAmplitudeDeviceId(data.getString("amplitude_device_id"))
    }

    if(data.has("mixpanel_user_id")) {
        builder.withMixpanelUserId(data.getString("mixpanel_user_id"))
    }

    if(data.has("appmetrica_profile_id")) {
        builder.withAppmetricaProfileId(data.getString("appmetrica_profile_id"))
    }

    if(data.has("appmetrica_device_id")) {
        builder.withAppmetricaDeviceId(data.getString("appmetrica_device_id"))
    }

   
    if(data.has("analytics_disabled")) {
        builder.withExternalAnalyticsDisabled(data.getBoolean("analytics_disabled"))
    }

    if(data.has("one_signal_player_id")) {
        builder.withOneSignalPlayerId(data.getString("one_signal_player_id"))
    }

    if(data.has("one_signal_subscription_id")) {
        builder.withOneSignalSubscriptionId(data.getString("one_signal_subscription_id"))
    }

    if(data.has("pushwoosh_hwid")) {
        builder.withPushwooshHwid(data.getString("pushwoosh_hwid"))
    }

    if(data.has("firebase_app_instance_id")) {
        builder.withFirebaseAppInstanceId(data.getString("firebase_app_instance_id"))
    }

    if(data.has("airbridge_device_id")) {
        builder.withAirbridgeDeviceId(data.getString("airbridge_device_id"))
    }

    if(data.has("custom_attributes")) {
        val customAttributes = data.getJSObject("custom_attributes")
        customAttributes?.keys()?.forEach { key ->
            val value = customAttributes.get(key)
             if(value is Int || value is Long || value is Float || value is Double){
                builder.withCustomAttribute(key = key, value = customAttributes.getDouble(key))
            } else {
                 builder.withCustomAttribute(
                     key = key,
                     value = customAttributes.getString(key) ?: ""
                 )
             }
        }
    }


    return builder.build()
}
