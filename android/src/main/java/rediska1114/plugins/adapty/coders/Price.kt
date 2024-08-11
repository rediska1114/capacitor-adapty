package rediska1114.plugins.adapty.coders

import com.adapty.models.AdaptyPaywallProduct
import com.getcapacitor.JSObject
import java.math.BigDecimal

public fun AdaptyPaywallProduct.Price.toJson(): JSObject {
      val data = JSObject()

    data.put("amount", amount)
    data.put("localized_string", localizedString)
    data.put("currency_code", currencyCode)
    data.put("currency_symbol", currencySymbol)

return data
}