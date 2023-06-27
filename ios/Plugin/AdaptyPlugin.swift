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
        let logLevel = call.getString("logLevel", "error")
        let observerMode = call.getBool("observerMode", false)
        let enableUsageLogs = call.getBool("enableUsageLogs", false)

        let storeKit2Usage = call.getString("storeKit2Usage", "default")

        guard let libVersion = call.getString("libVersion") else {
            return call.reject("[AdaptyPlugin] Missing libVersion argument")
        }

        Adapty.setCrossPlatformSDK(version: libVersion, name: "capacitor")

        Adapty.activate(
            apiKey,
            observerMode: observerMode,
            customerUserId: customerUserId,
            enableUsageLogs: enableUsageLogs,
            storeKit2Usage: StoreKit2Usage(from: storeKit2Usage)
        ) { result in
            switch result {
            case .none:
                Adapty.logLevel = AdaptyLogLevel(from: logLevel)

                call.resolve()

            case let .some(error):
                call.reject("[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue), error.originalError)
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

        Adapty.updateAttribution(attribution, source: source, networkUserId: networkUserId) { maybeErr in
            if let error = maybeErr {
                return call.reject("[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue), error.originalError)
            }

            call.resolve()
        }
    }

    @objc func getPaywall(_ call: CAPPluginCall) {
        guard let id = call.getString("id") else {
            return call.reject("[AdaptyPlugin] Missing id argument")
        }

        guard let locale = call.getString("locale") else {
            return call.reject("[AdaptyPlugin] Missing locale argument")
        }

        Adapty.getPaywall(id, locale: locale) { result in
            switch result {
            case let .success(paywall):
                call.resolve(JSONHelper.encode(paywall))
            case let .failure(error):
                call.reject("[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue), error.originalError)
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
                call.reject("[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue), error.originalError)
            }
        }
    }

    @objc func logShowOnboarding(_ call: CAPPluginCall) {
        let name = call.getString("name")

        let screenName = call.getString("screenName")

        guard let screenOrder = call.getInt("screenOrder") else {
            return call.reject("[AdaptyPlugin] Missing screenOrder argument")
        }

        Adapty.logShowOnboarding(name: name, screenName: screenName, screenOrder: UInt(screenOrder)) { maybeErr in
            if let error = maybeErr {
                return call.reject("[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue), error.originalError)
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
                return call.reject("[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue), error.originalError)
            }

            call.resolve()
        }
    }

    @objc func setFallbackPaywalls(_ call: CAPPluginCall) {
        guard let paywallsObj = call.getObject("paywalls") else {
            return call.reject("[AdaptyPlugin] Missing paywalls argument")
        }

        guard let paywallsData = try? JSONSerialization.data(withJSONObject: paywallsObj, options: []) else {
            return call.reject("[AdaptyPlugin] Invalid paywalls argument")
        }

        Adapty.setFallbackPaywalls(paywallsData) { maybeErr in
            if let error = maybeErr {
                return call.reject("[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue), error.originalError)
            }

            call.resolve()
        }
    }

    @objc func getProfile(_ call: CAPPluginCall) {
        Adapty.getProfile { result in
            switch result {
            case let .success(profile):
                call.resolve(JSONHelper.encode(profile))
            case let .failure(error):
                call.reject("[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue), error.originalError)
            }
        }
    }

    @objc func identify(_ call: CAPPluginCall) {
        guard let customerUserId = call.getString("customerUserId") else {
            return call.reject("[AdaptyPlugin] Missing customerUserId argument")
        }

        Adapty.identify(customerUserId) { maybeErr in
            if let error = maybeErr {
                return call.reject("[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue), error.originalError)
            }

            call.resolve()
        }
    }

    @objc func logout(_ call: CAPPluginCall) {
        Adapty.logout { maybeErr in
            if let error = maybeErr {
                return call.reject("[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue), error.originalError)
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
                return call.reject("[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue), error.originalError)
            }

            call.resolve()
        }
    }

    @objc func makePurchase(_ call: CAPPluginCall) {
        guard let productObj = call.getObject("product") else {
            return call.reject("[AdaptyPlugin] Missing product argument")
        }

        guard let productData = try? JSONSerialization.data(withJSONObject: productObj, options: []) else {
            return call.reject("[AdaptyPlugin] Invalid product argument")
        }

        Adapty.getPaywallProduct(from: JSONHelper.jsonDecoder, data: productData) { skProduct in
            switch skProduct {
            case let .failure(error):
                return call.reject("[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue), error.originalError)
            case let .success(product):
                Adapty.makePurchase(product: product) { result in
                    switch result {
                    case let .success(profile):
                        call.resolve(JSONHelper.encode(PurchasedInfo(profile: profile.profile, transaction: profile.transaction)))
                    case let .failure(error):
                        call.reject("[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue), error.originalError)
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
                call.resolve(JSONHelper.encode(profile))
            case let .failure(error):
                call.reject("[AdaptyPlugin] \(error.localizedDescription)", String(error.adaptyErrorCode.rawValue), error.originalError)
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

        let body = JSONHelper.encode(profile)

        notifyListeners(EventName.onLatestProfileLoad.rawValue, data: body, retainUntilConsumed: true)
    }
}

struct PurchasedInfo: Encodable {
    let profile: AdaptyProfile
    let transaction: CodableSKPaymentTransaction

    init(profile: AdaptyProfile, transaction: SKPaymentTransaction) {
        self.profile = profile
        self.transaction = CodableSKPaymentTransaction(transaction: transaction)
    }
}

struct CodableSKPayment: Codable {
    let productIdentifier: String
    let quantity: Int
    let requestData: Data?
    let applicationUsername: String?
    let simulatesAskToBuyInSandbox: Bool

    init(payment: SKPayment) {
        productIdentifier = payment.productIdentifier
        quantity = payment.quantity
        requestData = payment.requestData
        applicationUsername = payment.applicationUsername
        simulatesAskToBuyInSandbox = payment.simulatesAskToBuyInSandbox
    }
}

class CodableSKPaymentTransaction: Codable {
    let errorDescription: String?
    let original: CodableSKPaymentTransaction?
    let payment: CodableSKPayment
    let transactionDate: Date?
    let transactionIdentifier: String?
    let transactionState: SKPaymentTransactionState.RawValue // RawValue because SKPaymentTransactionState doesn't conform to Codable

    init(transaction: SKPaymentTransaction) {
        errorDescription = transaction.error?.localizedDescription
        if let originalTransaction = transaction.original {
            original = CodableSKPaymentTransaction(transaction: originalTransaction)
        } else {
            original = nil
        }
        payment = CodableSKPayment(payment: transaction.payment)
        transactionDate = transaction.transactionDate
        transactionIdentifier = transaction.transactionIdentifier
        transactionState = transaction.transactionState.rawValue
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

extension StoreKit2Usage {
    init(from string: String) {
        switch string {
        case "for_intro_eligibility_check":
            self = .forIntroEligibilityCheck
        default:
            self = .disabled
        }
    }
}

extension AdaptyLogLevel {
    init(from string: String) {
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
