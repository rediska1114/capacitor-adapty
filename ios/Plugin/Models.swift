//
//  Models.swift
//  Plugin
//
//  Created by Степан Котов on 16.05.2021.
//  Copyright © 2021 Max Lynch. All rights reserved.
//

import Foundation
import Adapty


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

