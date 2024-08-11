export const VendorStore = Object.freeze({
  AppStore: 'app_store',
  PlayStore: 'play_store',
  Adapty: 'adapty',
});
export type VendorStore = typeof VendorStore[keyof typeof VendorStore];

export const OfferType = Object.freeze({
  FreeTrial: 'free_trial',
  PayAsYouGo: 'pay_as_you_go',
  PayUpFront: 'pay_up_front',
  Unknown: 'unknown',
});
export type OfferType = typeof OfferType[keyof typeof OfferType];

export const CancellationReason = Object.freeze({
  VolountarilyCancelled: 'voluntarily_cancelled',
  BillingError: 'billing_error',
  Refund: 'refund',
  PriceIncrease: 'price_increase',
  ProductWasNotAvailable: 'product_was_not_available',
  Unknown: 'unknown',
});
export type CancellationReason =
  typeof CancellationReason[keyof typeof CancellationReason];

export const Gender = Object.freeze({
  Female: 'f',
  Male: 'm',
  Other: 'o',
});
export type Gender = typeof Gender[keyof typeof Gender];

export const AppTrackingTransparencyStatus = Object.freeze({
  NotDetermined: 0,
  Restricted: 1,
  Denied: 2,
  Authorized: 3,
  Unknown: 4,
});
export type AppTrackingTransparencyStatus =
  typeof AppTrackingTransparencyStatus[keyof typeof AppTrackingTransparencyStatus];

export const ProductPeriod = Object.freeze({
  Day: 'day',
  Week: 'week',
  Month: 'month',
  Year: 'year',
  Unknown: 'unknown',
});
export type ProductPeriod = typeof ProductPeriod[keyof typeof ProductPeriod];

export const OfferEligibility = Object.freeze({
  Eligible: 'eligible',
  Ineligible: 'ineligible',
  NotApplicable: 'not_applicable',
});
export type OfferEligibility =
  typeof OfferEligibility[keyof typeof OfferEligibility];

export const LogLevel = Object.freeze({
  error: 'error',
  warn: 'warn',
  info: 'info',
  verbose: 'verbose',
  debug: 'debug',
});
export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

export const PaywallFetchPolicy = Object.freeze({
  returnCacheDataElseLoad: 'return_cache_data_else_load',
  reloadRevalidatingCacheData: 'reload_revalidating_cache_data',
  default: 'default',
});
export type PaywallFetchPolicy =
  typeof PaywallFetchPolicy[keyof typeof PaywallFetchPolicy];

export const AttributionNetwork = Object.freeze({
  appsflyer: 'appsflyer',
  adjust: 'adjust',
  branch: 'branch',
  custom: 'custom',
  appleSearchAds: 'apple_search_ads',
});
export type AttributionNetwork =
  typeof AttributionNetwork[keyof typeof AttributionNetwork];

export const SKPaymentTransactionState = Object.freeze({
  purchasing: 0, // Transaction is being added to the server queue.
  purchased: 1, // Transaction is in queue, user has been charged.  Client should complete the transaction.
  failed: 2, // Transaction was cancelled or failed before being added to the server queue.
  restored: 3, // Transaction was restored from user's purchase history.  Client should complete the transaction.
  deferred: 4, // The transaction is in the queue, but its final status is pending external action.
});

export type SKPaymentTransactionState =
  typeof SKPaymentTransactionState[keyof typeof SKPaymentTransactionState];

export const AdaptyAndroidSubscriptionUpdateReplacementMode = Object.freeze({
  ChargeFullPrice: 'charge_full_price',
  Deferred: 'deferred',
  WithoutProration: 'without_proration',
  ChargeProratedPrice: 'charge_prorated_price',
  WithTimeProration: 'with_time_proration',
});

export type AdaptyAndroidSubscriptionUpdateReplacementMode =
  typeof AdaptyAndroidSubscriptionUpdateReplacementMode[keyof typeof AdaptyAndroidSubscriptionUpdateReplacementMode];

export interface AdaptyPrice {
  /**
   * Price as number
   */
  amount: number;
  /**
   * The currency code of the locale
   * used to format the price of the product.
   * The ISO 4217 (USD, EUR).
   */
  currencyCode?: string;
  /**
   * The currency symbol of the locale
   * used to format the price of the product.
   * ($, €).
   */
  currencySymbol?: string;
  /**
   * A price’s language is determined
   * by the preferred language set on the device.
   * On Android, the formatted price from Google Play as is.
   */
  localizedString?: string;
}

/**
 * Describes an object that represents a paywall.
 * Used in {@link Adapty.getPaywall} method.
 * @public
 */
export interface AdaptyPaywall {
  /**
   * Parent A/B test name.
   * @readonly
   */
  abTestName: string;
  /**
   * ID of a placement configured in Adapty Dashboard.
   * @readonly
   */
  placementId: string;
  /**
   * Identifier of a paywall locale.
   * @readonly
   */
  locale: string;
  /**
   * If `true`, it is possible to fetch the view object
   * and use it with AdaptyUI library.
   */
  hasViewConfiguration: boolean;

  /**
   * A paywall name.
   * @readonly
   */
  name: string;
  /**
   * A custom JSON string configured in Adapty Dashboard for this paywall.
   * @readonly
   */
  remoteConfig?: string;
  /**
   * Current revision (version) of a paywall.
   * Every change within a paywall creates a new revision.
   * @readonly
   */
  revision: number;
  /**
   * An identifier of a variation,
   * used to attribute purchases to this paywall.
   * @readonly
   */
  variationId: string;
  /**
   * Array of initial products info
   * @readonly
   */
  products: ProductReference[];

  instanceIdentity: string;
  version: number;
}

/**
 * Interface representing a user profile in Adapty,
 * including details about the user's subscriptions and consumable products.
 * @public
 */
export interface AdaptyProfile {
  /**
   * Object that maps access level identifiers (configured by you in Adapty Dashboard)
   * to the corresponding access level details. The value can be `null`
   * if the user does not have any access levels.
   * @readonly
   */
  accessLevels?: Record<string, AdaptyAccessLevel>;

  segmentHash: string;

  /**
   * Object representing custom attributes set for the user using
   * the {@link Adapty.updateProfile} method.
   * @readonly
   */
  customAttributes?: Record<string, any>;

  /**
   * The identifier for a user in your system.
   * @readonly
   */
  customerUserId?: string;

  /**
   * Object that maps product ids from the store to an array of
   * information about the user's non-subscription purchases.
   * The value can be `null` if the user does not have any purchases.
   * @readonly
   */
  nonSubscriptions?: Record<string, AdaptyNonSubscription[]>;

  /**
   * The identifier for a user in Adapty.
   */
  profileId: string;

  /**
   * Object that maps product ids from a store to
   * information about the user's subscriptions.
   * The value can be `null` if the user does not have any subscriptions.
   * @readonly
   */
  subscriptions?: Record<string, AdaptySubscription>;
}

/**
 * Interface representing access level details of a user.
 * @public
 */
export interface AdaptyAccessLevel {
  /**
   * The date and time when the access level was activated.
   * @readonly
   */
  activatedAt: Date;

  /**
   * Type of active introductory offer, if any.
   * @readonly
   */
  activeIntroductoryOfferType?: OfferType;

  /**
   * Identifier of the active promotional offer, if any.
   * @readonly
   */
  activePromotionalOfferId?: string;

  /**
   * Type of the active promotional offer, if any.
   * @readonly
   */
  activePromotionalOfferType?: OfferType;

  /**
   * The date and time when a billing issue was detected.
   * @readonly
   */
  billingIssueDetectedAt?: Date;

  /**
   * The reason for the cancellation of the subscription.
   * @readonly
   */
  cancellationReason?: CancellationReason;

  /**
   * The expiration date of the access level, if applicable.
   * @readonly
   */
  expiresAt?: Date;

  /**
   * Unique identifier of the access level
   * configured by you in Adapty Dashboard.
   * @readonly
   */
  id: string;

  /**
   * Flag indicating whether the access level is currently active.
   * @readonly
   */
  isActive: boolean;

  /**
   * Flag indicating whether this auto-renewable subscription is in the grace period.
   * @readonly
   */
  isInGracePeriod: boolean;

  /**
   * Flag indicating whether this access level is active for a lifetime.
   * @readonly
   */
  isLifetime: boolean;

  /**
   * Flag indicating whether this purchase was refunded.
   * @readonly
   */
  isRefund: boolean;

  /**
   * The date and time when the access level was renewed.
   * @readonly
   */
  renewedAt?: Date;

  /**
   * The start date of this access level.
   * @readonly
   */
  startsAt?: Date;

  /**
   * The store where the purchase that unlocked this access level was made.
   * @readonly
   */
  store: VendorStore;

  /**
   * The date and time when the auto-renewable subscription was cancelled.
   * @readonly
   */
  unsubscribedAt?: Date;

  /**
   * The identifier of the product in the store that unlocked this access level.
   * @readonly
   */
  vendorProductId: string;

  /**
   * Flag indicating whether this auto-renewable subscription is set to renew.
   * @readonly
   */
  willRenew: boolean;

  android?: {
    offerId?: string;
  };
}

/**
 * Interface representing a consumable or non-subscription purchase made by the user.
 * @public
 */
export interface AdaptyNonSubscription {
  /**
   * Flag indicating whether the product is consumable.
   * @readonly
   */
  isConsumable: boolean;

  /**
   * Flag indicating whether the purchase was refunded.
   * @readonly
   */
  isRefund: boolean;

  /**
   * Flag indicating whether the product was purchased in a sandbox environment.
   * @readonly
   */
  isSandbox: boolean;

  /**
   * The date and time when the purchase was made.
   * @readonly
   */
  purchasedAt: Date;

  /**
   * The identifier of the product in the store that was purchased.
   * @readonly
   */
  vendorProductId: string;
  /**
   * The identifier of the product in the store that was purchased.
   * @readonly
   */
  vendorTransactionId?: string;

  /**
   * The store where the purchase was made.
   * @readonly
   */
  store: VendorStore;

  /**
   * An identifier of the purchase in Adapty.
   * You can use it to ensure that you've already processed this purchase
   * (for example tracking one time products).
   * @readonly
   */
  purchaseId: string;
}

/**
 * Interface representing details about a user's subscription.
 * @public
 */
export interface AdaptySubscription {
  /**
   * The date and time when the subscription was activated.
   * @readonly
   */
  activatedAt: Date;

  /**
   * Type of active introductory offer, if any.
   * @readonly
   */
  activeIntroductoryOfferType?: OfferType;

  /**
   * Identifier of the active promotional offer, if any.
   * @readonly
   */
  activePromotionalOfferId?: string;

  /**
   * Type of the active promotional offer, if any.
   * @readonly
   */
  activePromotionalOfferType?: OfferType;

  /**
   * The date and time when a billing issue was detected.
   * @readonly
   */
  billingIssueDetectedAt?: Date;

  /**
   * The reason for the cancellation of the subscription.
   * @readonly
   */
  cancellationReason?: CancellationReason;

  /**
   * The expiration date of the subscription, if applicable.
   * @readonly
   */
  expiresAt?: Date;

  /**
   * Flag indicating whether the subscription is currently active.
   * @readonly
   */
  isActive: boolean;

  /**
   * Flag indicating whether the subscription is in the grace period.
   * @readonly
   */
  isInGracePeriod: boolean;

  /**
   * Flag indicating whether the subscription is set for a lifetime.
   * @readonly
   */
  isLifetime: boolean;

  /**
   * Flag indicating whether the subscription was refunded.
   * @readonly
   */
  isRefund: boolean;

  /**
   * Flag indicating whether the subscription was purchased in a sandbox environment.
   * @readonly
   */
  isSandbox: boolean;

  /**
   * The date and time when the subscription was renewed.
   * @readonly
   */
  renewedAt?: Date;

  /**
   * The date and time when the subscription starts.
   * @readonly
   */
  startsAt?: Date;

  /**
   * The store where the subscription was made.
   * @readonly
   */
  store: VendorStore;

  /**
   * The date and time when the subscription was cancelled.
   * @readonly
   */
  unsubscribedAt?: Date;

  /**
   * The identifier of the product in the store that was subscribed to.
   * @readonly
   */
  vendorProductId: string;

  /**
   * The identifier of the product in the store that was subscribed to.
   * @readonly
   */
  vendorTransactionId: string;
  /**
   * An original transaction id of the purchase in a store that unlocked this subscription.
   * For auto-renewable subscription, this will be an id of the first transaction in this subscription.
   * @readonly
   */
  vendorOriginalTransactionId: string;
  /**
   * Flag indicating whether the subscription is set to auto-renew.
   * @readonly
   */
  willRenew: boolean;
}

/**
 * Describes an object that represents a product.
 * Used in {@link Adapty.getPaywallProducts} method and in {@link Adapty.makePurchase} method.
 * @public
 */
export interface AdaptyPaywallProduct {
  /**
   * A description of the product.
   */
  localizedDescription: string;
  /**
   * The region code of the locale used to format the price of the product.
   * ISO 3166 ALPHA-2 (US, DE)
   */
  regionCode?: string;
  /**
   * The name of the product.
   */
  localizedTitle: string;
  /**
   * Same as `abTestName` property of the parent {@link AdaptyPaywall}.
   */
  paywallAbTestName: string;
  /**
   * Same as `name` property of the parent {@link AdaptyPaywall}.
   */
  paywallName: string;
  /**
   * The cost of the product in the local currency
   */
  price?: AdaptyPrice;
  /**
   * A description of the product.
   */
  adaptyProductId: string;
  /**
   * Same as `variationId` property of the parent {@link AdaptyPaywall}.
   */
  paywallVariationId: string;
  /**
   * Unique identifier of a product
   * from App Store Connect or Google Play Console
   */
  vendorProductId: string;
  payloadData?: Object;
  subscriptionDetails?: AdaptySubscriptionDetails;
  ios?: {
    /**
     * Boolean value that indicates
     * whether the product is available for family sharing
     * in App Store Connect.
     * Will be `false` for iOS version below 14.0 and macOS version below 11.0.
     * @see {@link https://developer.apple.com/documentation/storekit/skproduct/3564805-isfamilyshareable}
     */
    isFamilyShareable: boolean;
  };
}

export interface AdaptySubscriptionDetails {
  /**
   * The period details for products that are subscriptions.
   * Will be `null` for iOS version below 11.2 and macOS version below 10.14.4.
   */
  subscriptionPeriod: AdaptySubscriptionPeriod;
  /**
   * The period’s language is determined
   * by the preferred language set on the device.
   */
  localizedSubscriptionPeriod?: string;
  /**
   * An array of subscription offers available for the auto-renewable subscription.
   * Will be empty for iOS version below 12.2
   * and macOS version below 10.14.4.
   */
  introductoryOffers?: AdaptyDiscountPhase[];

  ios?: {
    promotionalOffer?: AdaptyDiscountPhase;
    /**
     * An identifier of the subscription group
     * to which the subscription belongs.
     * Will be `null` for iOS version below 12.0 and macOS version below 10.14.
     */
    subscriptionGroupIdentifier?: string;
  };

  android?: {
    /**
     * An object containing free trial information for the given product.
     * @see {@link https://developer.android.com/google/play/billing/subscriptions#free-trial}
     */
    // freeTrialPeriod?: AdaptySubscriptionPeriod;
    /**
     * The period’s language is determined
     * by the preferred language set on the device.
     */
    // localizedFreeTrialPeriod?: string;
    offerId?: string;
    basePlanId: string;
    introductoryOfferEligibility: OfferEligibility;
    offerTags?: string[];
    renewalType?: 'prepaid' | 'autorenewable';
  };
}

/**
 * Discount model to products
 * @see {@link https://doc.adapty.io/docs/rn-api-reference#adaptyproductdiscount}
 */
export interface AdaptyDiscountPhase {
  /**
   * A formatted number of periods of a discount for a user’s locale.
   * @readonly
   */
  localizedNumberOfPeriods?: string;
  /**
   * A formatted subscription period of a discount for a user’s locale.
   * @readonly
   */
  localizedSubscriptionPeriod?: string;
  /**
   * A number of periods this product discount is available.
   * @readonly
   */
  numberOfPeriods: number;
  /**
   * Discount price of a product in a local currency.
   * @readonly
   */
  price: AdaptyPrice;
  /**
   * An information about period for a product discount.
   * @readonly
   */
  subscriptionPeriod: AdaptySubscriptionPeriod;

  /**
   * A payment mode for this product discount.
   * @readonly
   */
  paymentMode: OfferType;
  ios?: {
    /**
     * Unique identifier of a discount offer for a product.
     * @see {@link https://developer.apple.com/documentation/storekit/skpaymentdiscount/3043528-identifier}
     * @readonly
     */
    identifier?: string;
  };
}

/**
 * An object containing information about a subscription period.
 * @public
 */
export interface AdaptySubscriptionPeriod {
  /**
   * A number of period units.
   * @readonly
   */
  numberOfUnits: number;
  /**
   * A unit of time that a subscription period is specified in.
   * @readonly
   */
  unit: ProductPeriod;
}

export interface AdaptyProfileParameters {
  analyticsDisabled?: boolean;
  customAttributes?: { [key: string]: any };
  appTrackingTransparencyStatus?: AppTrackingTransparencyStatus;
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  birthday?: Date;
  email?: string;
  phoneNumber?: string;
  facebookAnonymousId?: string;
  amplitudeUserId?: string;
  amplitudeDeviceId?: string;
  mixpanelUserId?: string;
  appmetricaProfileId?: string;
  appmetricaDeviceId?: string;
  oneSignalPlayerId?: string;
  oneSignalSubscriptionId?: string;
  pushwooshHWID?: string;
  firebaseAppInstanceId?: string;
  airbridgeDeviceId?: string;
}

export interface ProductReference {
  vendorId: string;
  adaptyProductId: string;

  ios?: {
    promotionalOfferId?: string;
  };

  android?: {
    isConsumable: boolean;
    basePlanId?: string;
    offerId?: string;
  };
}

export interface SKPayment {
  productIdentifier: string;
  quantity: number;
  requestData: string;
  applicationUsername?: string;
  simulatesAskToBuyInSandbox: boolean;
}

export interface SKPaymentTransaction {
  errorDescription: string;
  original?: Omit<SKPaymentTransaction, 'original'>;
  payment: SKPayment;
  transactionDate: string;
  transactionIdentifier: string;
  transactionState: SKPaymentTransactionState;
}

export interface AndroidPurchase {}

export interface AdaptyPurchasedInfo {
  profile: AdaptyProfile;

  /**
   * iOS purchase object
   */
  transaction?: SKPaymentTransaction;
  /**
   * Android purchase object
   */
  purchase?: AndroidPurchase;

  vendorTransactionId: string;
  vendorOriginalTransactionId: string;
}
