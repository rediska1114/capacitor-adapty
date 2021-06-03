import Adapty
import Capacitor
import Foundation

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(CapacitorAdapty)
public class CapacitorAdapty: CAPPlugin, AdaptyDelegate {
  // let events = RNAdaptyEvents()

  private var paywalls = [PaywallModel]()
  private var products = [ProductModel]()

  override public func load() {
    let sdkKey = getConfigValue("sdkKey") as! String
    let observerMode = getConfigValue("appId") as? Bool ?? false
    let logLevel = getConfigValue("logLevel") as? String ?? "none"

    Adapty.activate(sdkKey, observerMode: observerMode)
    switch logLevel {
    case "verbose":
      Adapty.logLevel = .verbose
    case "errors":
      Adapty.logLevel = .errors
    default:
      Adapty.logLevel = .none
    }
  }

  // notifyListeners("appUrlOpen", data: makeUrlOpenObject(object), retainUntilConsumed: true)

  private func cachePaywalls(_ paywalls: [PaywallModel]?) {
    self.paywalls.removeAll()
    if let paywalls = paywalls {
      self.paywalls.append(contentsOf: paywalls)
    }
  }

  private func cacheProducts(_ products: [ProductModel]?) {
    self.products.removeAll()
    if let products = products {
      self.products.append(contentsOf: products)
    }
  }

  @objc
  func getPaywalls(_ call: CAPPluginCall) {
    let forceUpdate = call.getBool("forceUpdate") ?? false

    Adapty.getPaywalls(forceUpdate: forceUpdate) { paywalls, products, error in
      if let error = error {
        return call.reject(error.localizedDescription, String(error.adaptyErrorCode.rawValue), error.originalError)
      }

      self.cachePaywalls(paywalls)
      self.cacheProducts(products)

      call.resolve(
        encodeJson(from: GetPaywallsResult(paywalls: paywalls, products: products))
      )
    }
  }

  @objc
  func updateAttribution(_ call: CAPPluginCall) {
    guard let attribution = call.getObject("attribution") else {
      return call.reject("Failed to convert object to [AnyHashable: Any]")
    }
    guard let source = call.getString("source") else {
      return call.reject("Missing source option")
    }
    let networkUserId = call.getString("networkUserId")

    func parseSource(_ str: String) -> AttributionNetwork {
      switch str {
      case "Branch":
        return .branch
      case "Adjust":
        return .adjust
      case "AppsFlyer":
        return .appsflyer
      case "AppleSearchAds":
        return .appleSearchAds
      default:
        return .custom
      }
    }

    Adapty.updateAttribution(attribution, source: parseSource(source), networkUserId: networkUserId) { error in
      if let error = error {
        return call.reject(error.localizedDescription, String(error.adaptyErrorCode.rawValue), error.originalError)
      }

      return call.resolve()
    }
  }

  @objc
  func setExternalAnalyticsEnabled(_ call: CAPPluginCall) {
    guard let isEnabled = call.getBool("isEnabled") else {
      return call.reject("Missing isEnabled option")
    }
    Adapty.setExternalAnalyticsEnabled(isEnabled) { error in
      if let error = error {
        return call.reject(error.localizedDescription, String(error.adaptyErrorCode.rawValue), error.originalError)
      }
      return call.resolve()
    }
  }

  @objc
  func logShowPaywall(_ call: CAPPluginCall) {
    guard let variationId = call.getString("variationId") else {
      return call.reject("Missing variationId option")
    }
    guard let paywall = paywalls.first(where: { $0.variationId == variationId }) else {
      return call.reject("Paywall with such variation ID wasn't found")
    }
    Adapty.logShowPaywall(paywall)
    call.resolve()
  }

  @objc
  func getAPNSToken(_ call: CAPPluginCall) {
    call.resolve([
      "token": Adapty.apnsTokenString as Any,
    ])
  }

  @objc
  func setAPNSToken(_ call: CAPPluginCall) {
    guard let apns = call.getString("apns") else {
      return call.reject("Missing apns option")
    }

    guard let utf8Str = apns.data(using: .utf8) else {
      return call.reject("Invalid APNS Token passed")
    }

    let base64Encoded = utf8Str.base64EncodedString(options: Data.Base64EncodingOptions(rawValue: 0))
    Adapty.apnsToken = Data(base64Encoded: base64Encoded)
    call.resolve()
  }

  @objc
  func identify(_ call: CAPPluginCall) {
    guard let customerUserId = call.getString("customerUserId") else {
      return call.reject("Missing customerUserId option")
    }
    Adapty.identify(customerUserId) { error in
      if let error = error {
        return call.reject(error.localizedDescription, String(error.adaptyErrorCode.rawValue), error.originalError)
      }
      call.resolve()
    }
  }

  @objc 
  func getCustomerUserId(_ call: CAPPluginCall) {
    call.resolve([
        "customerUserId": Adapty.customerUserId as Any
    ])
  }

  @objc
  func logout(_ call: CAPPluginCall) {
    Adapty.logout { error in
      if let error = error {
        return call.reject(error.localizedDescription, String(error.adaptyErrorCode.rawValue), error.originalError)
      }

      call.resolve()
    }
  }

  @objc
  func updateProfile(_ call: CAPPluginCall) {
    let params = ProfileParameterBuilder()

    if let email = call.getString("email") {
      _ = params.withEmail(email)
    }
    if let phoneNumber = call.getString("phoneNumber") {
      _ = params.withPhoneNumber(phoneNumber)
    }
    if let facebookUserId = call.getString("facebookUserId") {
      _ = params.withFacebookUserId(facebookUserId)
    }
    if let facebookAnonymousId = call.getString("facebookAnonymousId") {
      _ = params.withFacebookAnonymousId(facebookAnonymousId)
    }
    if let amplitudeUserId = call.getString("amplitudeUserId") {
      _ = params.withAmplitudeUserId(amplitudeUserId)
    }
    if let amplitudeDeviceId = call.getString("amplitudeDeviceId") {
      _ = params.withAmplitudeDeviceId(amplitudeDeviceId)
    }
    if let mixpanelUserId = call.getString("mixpanelUserId") {
      _ = params.withMixpanelUserId(mixpanelUserId)
    }
    if let appmetricaProfileId = call.getString("appmetricaProfileId") {
      _ = params.withAppmetricaProfileId(appmetricaProfileId)
    }
    if let appmetricaDeviceId = call.getString("appmetricaDeviceId") {
      _ = params.withAppmetricaDeviceId(appmetricaDeviceId)
    }
    if let firstName = call.getString("firstName") {
      _ = params.withFirstName(firstName)
    }
    if let lastName = call.getString("lastName") {
      _ = params.withLastName(lastName)
    }
    if let gender = call.getString("gender") {
      switch gender {
      case "male": _ = params.withGender(Gender.male)
      case "female": _ = params.withGender(Gender.female)
      default: _ = params.withGender(Gender.other)
      }
    }
    if let birthdayStr = call.getString("birthday") {
      let dateFormatter = DateFormatter()
      dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"

      if let birthday = dateFormatter.date(from: birthdayStr) {
        _ = params.withBirthday(birthday)
      }
    }

    if let customObj = call.getObject("customAttributes") as NSDictionary? ?? nil {
      var customAttributes: [String: AnyObject] = [:]

      let keys = customObj.allKeys.compactMap { $0 as? String }
      for key in keys {
        let keyValue = customObj.value(forKey: key) as AnyObject
        customAttributes[key] = keyValue
      }

      _ = params.withCustomAttributes(customAttributes)
    }

    Adapty.updateProfile(params: params) { error in
      if let error = error {
        return call.reject(error.localizedDescription, String(error.adaptyErrorCode.rawValue), error.originalError)
      }
      call.resolve()
    }
  }

  @objc
  func presentCodeRedemptionSheet(_ call: CAPPluginCall) {
    Adapty.presentCodeRedemptionSheet()
    call.resolve()
  }

  @objc
  func setVariationID(_ call: CAPPluginCall) {
    guard let variationId = call.getString("variationId") else {
      return call.reject("Missing variationId option")
    }
    guard let transactionId = call.getString("transactionId") else {
      return call.reject("Missing transactionId option")
    }

    Adapty.setVariationId(variationId, forTransactionId: transactionId) { error in
      if let error = error {
        return call.reject(error.localizedDescription, String(error.adaptyErrorCode.rawValue), error.originalError)
      }
      call.resolve()
    }
  }

  @objc
  func getPromo(_ call: CAPPluginCall) {
    Adapty.getPromo { promo, error in
      if let error = error {
        return call.reject(error.localizedDescription, String(error.adaptyErrorCode.rawValue), error.originalError)
      }
      call.resolve(encodeJson(from: promo))
    }
  }

  @objc
  func restorePurchases(_ call: CAPPluginCall) {
    Adapty.restorePurchases { purchaserInfo, receipt, _, error in
      if let error = error {
        return call.reject(error.localizedDescription, String(error.adaptyErrorCode.rawValue), error.originalError)
      }

      let result = RestorePurchasesResult(purchaserInfo: purchaserInfo,
                                          receipt: receipt)
      call.resolve(encodeJson(from: result))
    }
  }

  @objc
  func getPurchaseInfo(_ call: CAPPluginCall) {
    let forceUpdate = call.getBool("forceUpdate") ?? false
    Adapty.getPurchaserInfo(forceUpdate: forceUpdate) { info, error in
      if let error = error {
        return call.reject(error.localizedDescription, String(error.adaptyErrorCode.rawValue), error.originalError)
      }
      call.resolve(encodeJson(from: info))
    }
  }

  @objc
  func makePurchase(_ call: CAPPluginCall) {
    guard let productId = call.getString("productId") else {
      return call.reject("Missing productId option")
    }
    let variationId = call.getString("variationId")

    guard let product = findProduct(productId: productId, variationId: variationId) else {
      return call.reject("Product with such ID wasn't found")
    }

    Adapty.makePurchase(product: product) {
      purchaserInfo, receipt, _, product, error in
      if let error = error {
        return call.reject(error.localizedDescription, String(error.adaptyErrorCode.rawValue), error.originalError)
      }

      let result = MakePurchaseResult(purchaserInfo: purchaserInfo,
                                      receipt: receipt,
                                      product: product)
      return call.resolve(encodeJson(from: result))
    }
  }

  private func findProduct(productId: String, variationId: String?) -> ProductModel? {
    guard let variationId = variationId,
          let paywall = paywalls.first(where: { $0.variationId == variationId })
    else {
      return products.first(where: { $0.vendorProductId == productId })
    }
    return paywall.products.first(where: { $0.vendorProductId == productId })
  }

  public func didPurchase(product _: ProductModel, purchaserInfo _: PurchaserInfoModel?, receipt _: String?, appleValidationResult _: Parameters?, paywall _: PaywallViewController) {
    print("[] DID PURCHASE")
    notifyListeners("onPurchaseSuccess", data: ["purchase": "success"], retainUntilConsumed: true)
  }

  public func didFailPurchase(product _: ProductModel, error _: Error, paywall _: PaywallViewController) {
    print("[] DID FAIL")
    notifyListeners("onPurchaseFailed", data: ["purchase": "failed"], retainUntilConsumed: true)
  }

  public func didReceiveUpdatedPurchaserInfo(_ purchaserInfo: PurchaserInfoModel) {
    print("[] DID UPDATE")
    notifyListeners("onInfoUpdate", data: ["promo": purchaserInfo], retainUntilConsumed: true)
  }

  public func didReceivePromo(_ promo: PromoModel) {
    notifyListeners("onPromoReceived", data: ["promo": promo], retainUntilConsumed: true)
  }
}

func encodeJson<T: Encodable>(from data: T) -> [String: Any] {
  let encoder = JSONEncoder()

  if let json = try? encoder.encode(data) {
    do {
      return try JSONSerialization.jsonObject(with: json, options: []) as? [String: Any] ?? [:]
    } catch {
      print(error.localizedDescription)
    }
  }
  return [:]
}
