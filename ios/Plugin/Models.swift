//
//  Models.swift
//  Plugin
//
//  Copyright © 2021 Max Lynch. All rights reserved.
//

import Adapty
import Foundation

struct GetPaywallsResult: Codable {
  let paywalls: [PaywallModel]?
  let products: [ProductModel]?
}

struct MakePurchaseResult: Codable {
  let purchaserInfo: PurchaserInfoModel?
  let receipt: String?
  let product: ProductModel?
}

struct RestorePurchasesResult: Codable {
  let purchaserInfo: PurchaserInfoModel?
  let receipt: String?
}
