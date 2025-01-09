import Adapty
import Capacitor
import Foundation
import StoreKit

public var MEMO_ACTIVATION_ARGS: [AnyHashable: Any] = [:]
public func == <K, L: Any, R: Any>(lhs: [K: L], rhs: [K: R]) -> Bool {
  (lhs as NSDictionary).isEqual(to: rhs)
}

@objc(AdaptyPlugin)
public class AdaptyPlugin: CAPPlugin, AdaptyDelegate {
  @objc func activate(_ call: CAPPluginCall) {
    if call.options == MEMO_ACTIVATION_ARGS {
      return call.resolve()
    } else {
      MEMO_ACTIVATION_ARGS = call.options
    }

    guard let apiKey = call.getString("apiKey") else {
      return call.reject("[AdaptyPlugin] Missing apiKey argument")
    }

    let customerUserId = call.getString("customerUserId")
    let logLevel = call.getString("logLevel")
    let observerMode = call.getBool("observerMode", false)
    let idfaCollectionDisabled = call.getBool("idfaCollectionDisabled", false)

    guard let libVersion = call.getString("libVersion") else {
      return call.reject("[AdaptyPlugin] Missing libVersion argument")
    }

    if let logLevel = logLevel {
      Adapty.logLevel = AdaptyLogLevel(from: logLevel)
    }

    Adapty.setCrossPlatformSDK(version: libVersion, name: "capacitor")
    Adapty.idfaCollectionDisabled = idfaCollectionDisabled

    Adapty.activate(
      apiKey,
      observerMode: observerMode,
      customerUserId: customerUserId
    ) { result in
      switch result {
      case .none:
        call.resolve()

      case let .some(error):
        call.reject(
          "[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue),
          error.originalError)
      }
    }

    Adapty.delegate = self
  }

  @objc func updateAttribution(_ call: CAPPluginCall) {
    guard let attribution = call.getObject("attribution") else {
      return call.reject("[AdaptyPlugin] Missing attribution argument")
    }

    guard let sourceString = call.getString("source") else {
      return call.reject("[AdaptyPlugin] Missing source argument")
    }

    guard let source = AdaptyAttributionSource(rawValue: sourceString) else {
      return call.reject("[AdaptyPlugin] Invalid source argument")
    }

    let networkUserId = call.getString("networkUserId")

    Adapty.updateAttribution(attribution, source: source, networkUserId: networkUserId) {
      result in
      switch result {
      case .none:
        call.resolve()

      case let .some(error):
        return call.reject(
          "[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue),
          error.originalError)

      }
    }
  }

  @objc func getPaywall(_ call: CAPPluginCall) {
    guard let placementId = call.getString("placementId") else {
      return call.reject("[AdaptyPlugin] Missing placementId argument")
    }

    let locale = call.getString("locale")

    let fetchPolicy = call.getString("fetchPolicy")

    let loadTimeout =
      call.getDouble("loadTimeout").map { $0 / 1000.0 } ?? .defaultLoadPaywallTimeout

    Adapty.getPaywall(
      placementId: placementId, locale: locale,
      fetchPolicy: AdaptyPaywall.FetchPolicy(from: fetchPolicy),
      loadTimeout: loadTimeout
    ) { result in
      switch result {
      case let .success(paywall):
        call.resolve(JSONHelper.encode(["paywall": paywall]))
      case let .failure(error):
        call.reject(
          "[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue),
          error.originalError)
      }
    }
  }

  @objc func getPaywallProducts(_ call: CAPPluginCall) {
    guard let paywallData = call.getObject("paywall") else {
      return call.reject("[AdaptyPlugin] Missing paywall argument")
    }

    guard let paywall = JSONHelper.decode(AdaptyPaywall.self, from: paywallData) else {
      return call.reject("[AdaptyPlugin] Invalid paywall argument")
    }

    Adapty.getPaywallProducts(paywall: paywall) { result in
      switch result {
      case let .success(products):
        call.resolve(JSONHelper.encode(["products": products]))
      case let .failure(error):
        call.reject(
          "[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue),
          error.originalError)
      }
    }
  }

  @objc func getProductsIntroductoryOfferEligibility(_ call: CAPPluginCall) {
    guard let vendorProductIds = call.getArray("vendorProductIds", String.self) else {
      return call.reject("[AdaptyPlugin] Missing vendorProductIds argument")
    }

    Adapty.getProductsIntroductoryOfferEligibility(vendorProductIds: vendorProductIds) { result in
      switch result {
      case let .failure(error):
        call.reject(
          "[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue),
          error.originalError)

      case let .success(eligibilities):
        call.resolve(JSONHelper.encode(["eligibilities": eligibilities]))
      }
    }
  }

  @objc func logShowOnboarding(_ call: CAPPluginCall) {

    let name = call.getString("name")

    let screenName = call.getString("screenName")

    guard let screenOrder = call.getInt("screenOrder") else {
      return call.reject("[AdaptyPlugin] Missing screenOrder argument")
    }

    Adapty.logShowOnboarding(name: name, screenName: screenName, screenOrder: UInt(screenOrder)) {
      maybeErr in
      if let error = maybeErr {
        return call.reject(
          "[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue),
          error.originalError)
      }

      call.resolve()
    }
  }

  @objc func logShowPaywall(_ call: CAPPluginCall) {
    guard let paywallData = call.getObject("paywall") else {
      return call.reject("[AdaptyPlugin] Missing paywall argument")
    }

    guard let paywall = JSONHelper.decode(AdaptyPaywall.self, from: paywallData) else {
      return call.reject("[AdaptyPlugin] Invalid paywall argument")
    }

    Adapty.logShowPaywall(paywall) { maybeErr in
      if let error = maybeErr {
        return call.reject(
          "[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue),
          error.originalError)
      }

      call.resolve()
    }
  }

  // TODO implement after update to Adapty SDK >2.11.0
  @objc func setFallbackPaywalls(_ call: CAPPluginCall) {
    call.unimplemented("[AdaptyPlugin] setFallbackPaywalls is not implemented")
    // guard let fileName = call.getString("fileName") else {
    //   return call.reject("[AdaptyPlugin] Missing fileName argument")
    // }

    // let fileNameArr = fileName.components(separatedBy: ".")
    // let forResource = !fileNameArr.isEmpty ? fileNameArr[0] : nil
    // let withExtension = (fileNameArr.count > 1) ? fileNameArr[1] : "json"
    // guard let forResource = forResource,
    //   let fileURL = Bundle.main.url(forResource: forResource, withExtension: withExtension)
    // else {
    //   return call.reject("[AdaptyPlugin] Invalid fileName argument")
    // }

    // do {

    //   Adapty.setFallbackPaywalls(fileURL) { maybeErr in
    //     if let error = maybeErr {
    //       return call.reject(
    //         "[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue),
    //         error.originalError)
    //     }

    //     call.resolve()
    //   }
    // } catch {
    //   return call.reject("[AdaptyPlugin] Error reading file data", error.localizedDescription)
    // }
  }

  @objc func getProfile(_ call: CAPPluginCall) {
    Adapty.getProfile { result in
      switch result {
      case let .success(profile):
        call.resolve(JSONHelper.encode(["profile": profile]))
      case let .failure(error):
        call.reject(
          "[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue),
          error.originalError)
      }
    }
  }

  @objc func identify(_ call: CAPPluginCall) {
    guard let customerUserId = call.getString("customerUserId") else {
      return call.reject("[AdaptyPlugin] Missing customerUserId argument")
    }

    Adapty.identify(customerUserId) { maybeErr in
      if let error = maybeErr {
        return call.reject(
          "[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue),
          error.originalError)
      }

      call.resolve()
    }
  }

  @objc func logout(_ call: CAPPluginCall) {
    Adapty.logout { maybeErr in
      if let error = maybeErr {
        return call.reject(
          "[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue),
          error.originalError)
      }

      call.resolve()
    }
  }

  @objc func updateProfile(_ call: CAPPluginCall) {
    guard let paramsData = call.getObject("params") else {
      return call.reject("[AdaptyPlugin] Missing params argument")
    }

    guard let params = JSONHelper.decode(AdaptyProfileParameters.self, from: paramsData) else {
      return call.reject("[AdaptyPlugin] Invalid params argument")
    }

    Adapty.updateProfile(params: params) { maybeErr in
      if let error = maybeErr {
        return call.reject(
          "[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue),
          error.originalError)
      }

      call.resolve()
    }
  }

  @objc func makePurchase(_ call: CAPPluginCall) {
    guard let productObj = call.getObject("product") else {
      return call.reject("[AdaptyPlugin] Missing product argument")
    }

    guard let productData = try? JSONSerialization.data(withJSONObject: productObj, options: [])
    else {
      return call.reject("[AdaptyPlugin] Invalid product argument")
    }

    Adapty.getPaywallProduct(from: JSONHelper.jsonDecoder, data: productData) { skProduct in
      switch skProduct {
      case let .failure(error):
        return call.reject(
          "[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue),
          error.originalError)
      case let .success(product):
        Adapty.makePurchase(product: product) { result in
          switch result {
          case let .success(purchase):
            call.resolve(
              JSONHelper.encode(
                [
                  "purchase": purchase
                ]
              ))
          case let .failure(error):
            call.reject(
              "[AdaptyPlugin] \(error.localizedDescription)",
              String(error.adaptyErrorCode.rawValue), error.originalError)
          }
        }
      }
    }
  }

  @objc func presentCodeRedemptionSheet(_ call: CAPPluginCall) {
    Adapty.presentCodeRedemptionSheet()
    call.resolve()
  }

  @objc func restorePurchases(_ call: CAPPluginCall) {
    Adapty.restorePurchases { result in
      switch result {
      case let .success(profile):
        call.resolve(JSONHelper.encode(["profile": profile]))
      case let .failure(error):
        call.reject(
          "[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue),
          error.originalError)
      }
    }
  }

  @objc func setLogLevel(_ call: CAPPluginCall) {
    guard let logLevelString = call.getString("logLevel") else {
      return call.reject("[AdaptyPlugin] Missing logLevel argument")
    }

    let logLevel = AdaptyLogLevel(from: logLevelString)

    Adapty.logLevel = logLevel
    call.resolve()
  }

  // @objc func setVariationId(_ call: CAPPluginCall) {
  //     guard let variationId = call.getString("variationId") else {
  //         return call.reject("[AdaptyPlugin] Missing variationId argument")
  //     }

  //     guard let transactionId = call.getString("transactionId") else {
  //         return call.reject("[AdaptyPlugin] Missing transactionId argument")
  //     }

  //     Adapty.setVariationId(variationId, forPurchasedTransaction: transactionId) { maybeErr in
  //         if let err = maybeErr {
  //             return call.reject("[AdaptyPlugin] \(err.localizedDescription)", nil, err)
  //         }

  //         call.resolve()
  //     }
  // }

  public func didLoadLatestProfile(_ profile: AdaptyProfile) {
    if !hasListeners(EventName.onLatestProfileLoad.rawValue) {
      return
    }

    let body = JSONHelper.encode(["profile": profile])

    notifyListeners(EventName.onLatestProfileLoad.rawValue, data: body, retainUntilConsumed: true)
  }
}

extension AdaptyPurchasedInfo: Encodable {
  enum CodingKeys: String, CodingKey {
    case profile
    case transaction
    case vendorTransactionId = "vendor_transaction_id"
    case vendorOriginalTransactionId = "vendor_original_transaction_id"
  }

  public func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    try container.encode(profile, forKey: .profile)
    try container.encode(transaction, forKey: .transaction)
    try container.encode(transaction.transactionIdentifier, forKey: .vendorTransactionId)
    try container.encode(
      transaction.original?.transactionIdentifier, forKey: .vendorOriginalTransactionId)
  }
}

extension SKPaymentTransaction: Encodable {
  enum CodingKeys: String, CodingKey {
    case errorDescription = "error_description"
    case original
    case payment
    case transactionDate = "transaction_date"
    case transactionIdentifier = "transaction_identifier"
    case transactionState = "transaction_state"
  }

  public func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    try container.encodeIfPresent(error?.localizedDescription, forKey: .errorDescription)
    try container.encodeIfPresent(original, forKey: .original)
    try container.encode(payment, forKey: .payment)
    try container.encodeIfPresent(transactionDate, forKey: .transactionDate)
    try container.encodeIfPresent(transactionIdentifier, forKey: .transactionIdentifier)
    try container.encode(transactionState.rawValue, forKey: .transactionState)
  }
}

extension SKPayment: Encodable {
  enum CodingKeys: String, CodingKey {
    case productIdentifier = "product_identifier"
    case quantity
    case requestData = "request_data"
    case applicationUsername = "application_username"
    case simulatesAskToBuyInSandbox = "simulates_ask_to_buy_in_sandbox"
  }

  public func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    try container.encode(productIdentifier, forKey: .productIdentifier)
    try container.encode(quantity, forKey: .quantity)
    try container.encodeIfPresent(requestData, forKey: .requestData)
    try container.encodeIfPresent(applicationUsername, forKey: .applicationUsername)
    try container.encode(simulatesAskToBuyInSandbox, forKey: .simulatesAskToBuyInSandbox)
  }
}

public enum JSONHelper {
  public static var dateFormatter: DateFormatter = {
    let formatter = DateFormatter()
    formatter.calendar = Calendar(identifier: .iso8601)
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z"
    formatter.timeZone = TimeZone(abbreviation: "UTC")
    return formatter
  }()

  public static var jsonDecoder: JSONDecoder = {
    let decoder = JSONDecoder()
    decoder.dateDecodingStrategy = .formatted(dateFormatter)
    decoder.dataDecodingStrategy = .base64
    return decoder
  }()

  public static var jsonEncoder: JSONEncoder = {
    let encoder = JSONEncoder()
    encoder.dateEncodingStrategy = .formatted(dateFormatter)
    encoder.dataEncodingStrategy = .base64
    return encoder
  }()

  public static func encode<T: Encodable>(_ value: T) -> [String: Any] {
    guard let data = try? jsonEncoder.encode(value) else {
      print("[AdaptyPlugin] — encode", "error encoding")

      return [:]
    }

    return (try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]) ?? [:]
  }

  public static func decode<T: Decodable>(_ type: T.Type, from json: [String: Any]) -> T? {
    guard let data = try? JSONSerialization.data(withJSONObject: json, options: []) else {
      print("[AdaptyPlugin] — decode", "error decoding")

      return nil
    }

    return try? jsonDecoder.decode(type, from: data)
  }
}

extension AdaptyLogLevel {
  init(from string: String?) {
    switch string {
    case "error":
      self = .error
    case "warn":
      self = .warn
    case "info":
      self = .info
    case "verbose":
      self = .verbose
    case "debug":
      self = .debug
    default:
      self = .error
    }
  }
}

extension AdaptyPaywall.FetchPolicy {
  init(from string: String?) {
    switch string {
    case "return_cache_data_else_load":
      self = .returnCacheDataElseLoad
    case "reload_revalidating_cache_data":
      self = .reloadRevalidatingCacheData
    default:
      self = .default
    }
  }
}
