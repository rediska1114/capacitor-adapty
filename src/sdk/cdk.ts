export enum VendorStore {
  AppStore = 'app_store',
  PlayStore = 'play_store',
  Adapty = 'adapty',
}

export enum OfferType {
  FreeTrial = 'free_trial',
  PayAsYouGo = 'pay_as_you_go',
  PayUpFront = 'pay_up_front',
}

export enum CancellationReason {
  VolountarilyCancelled = 'voluntarily_cancelled',
  BillingError = 'billing_error',
  Refund = 'refund',
  PriceIncrease = 'price_increase',
  ProductWasNotAvailable = 'product_was_not_available',
  Unknown = 'unknown',
}

export enum Gender {
  Female = 'f',
  Male = 'm',
  Other = 'o',
}

export enum AppTrackingTransparencyStatus {
  NotDetermined = 'not_determined',
  Restricted = 'restricted',
  Denied = 'denied',
  Authorized = 'authorized',
  Unknown = 'unknown',
}

export enum ProductPeriod {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

export enum OfferEligibility {
  Eligible = 'eligible',
  Ineligible = 'ineligible',
  Unknown = 'unknown',
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

  readonly ab_test_name: string;
  /**
   * ID of a paywall configured in Adapty Dashboard.
   * @readonly
   */
  readonly id: string;
  /**
   * Identifier of a paywall locale.
   * @readonly
   */
  readonly locale: string;
  /**
   * A paywall name.
   * @readonly
   */
  readonly name?: string;
  /**
   * A custom dictionary configured in Adapty Dashboard for this paywall.
   * @readonly
   */
  readonly remote_config?: Record<string, any>;
  /**
   * A custom JSON string configured in Adapty Dashboard for this paywall.
   * @readonly
   */
  readonly remote_config_string?: string;
  /**
   * Current revision (version) of a paywall.
   * Every change within a paywall creates a new revision.
   * @readonly
   */
  readonly revision: number;
  /**
   * An identifier of a variation,
   * used to attribute purchases to this paywall.
   * @readonly
   */
  readonly variation_id: string;
  /**
   * Array of related products ids.
   * @readonly
   */
  readonly products: AdaptyPaywallProduct[];
}
/**
 * Describes an object that represents a user profile,
 * including subscriptions and consumables.
 * @public
 */
export interface AdaptyProfile {
  /**
   * The keys are access level identifiers configured by you in Adapty Dashboard.
   * The values can be `null` if the customer has no access levels.
   * @readonly
   */
  readonly paid_access_levels?: Record<string, AdaptyAccessLevel>;
  /**
   * Previously set user custom attributes with {@link Adapty.updateProfile} method.
   * @readonly
   */
  readonly custom_attributes: Record<string, any>;
  /**
   * An identifier of a user in your system.
   * @readonly
   */
  readonly customer_user_id?: string;
  /**
   * The keys are product ids from the store.
   * The values are arrays of information about consumables.
   * Can be `null` if the customer has no purchases.
   * @readonly
   */
  readonly non_subscriptions?: Record<string, AdaptyNonSubscription[]>;
  /**
   * An identifier of a user in Adapty.
   */
  readonly profile_id: string;
  /**
   * The keys are product ids from a store.
   * The values are information about subscriptions.
   * Can be `null` if the customer has no subscriptions.
   * @readonly
   */
  readonly subscriptions?: Record<string, AdaptySubscription>;
}

/**
 * Current user's access level information.
 * @public
 */
export interface AdaptyAccessLevel {
  /**
   * Time when this access level was activated.
   * @readonly
   */
  readonly activated_at: Date;
  /**
   * A type of an active introductory offer.
   * If the value is not `null`,
   * it means that the offer was applied during the current subscription period.
   * @readonly
   */
  readonly active_introductory_offer_type?: OfferType;
  /**
   * An id of active promotional offer.
   * @readonly
   */
  readonly active_promotional_offer_id?: string;
  /**
   *  A type of an active promotional offer.
   * If the value is not `null`,
   * it means that the offer was applied
   * during the current subscription period.
   * @readonly
   */
  readonly active_promotional_offer_type?: OfferType;
  /**
   * Time when billing issue was detected.
   * Subscription can still be active.
   * Would be set to `null` if a charge is made.
   * @readonly
   */
  readonly billing_issue_detected_at?: Date;
  /**
   * A reason why a subscription was cancelled.
   * @readonly
   */
  readonly cancellation_reason?: CancellationReason;
  /**
   * Time when the access level will expire.
   * Could be in the past and could be `null` for lifetime access.
   * @readonly
   */
  readonly expires_at?: Date;
  /**
   * Unique identifier of the access level
   * configured by you in Adapty Dashboard.
   * @readonly
   */
  readonly id: string;
  /**
   * `true` if this access level is active.
   * Generally, you can check this property to determine
   * whether a user has an access to premium features.
   * @readonly
   */
  readonly is_active: boolean;
  /**
   * `true` if this auto-renewable subscription is in the grace period.
   * @readonly
   */
  readonly is_in_grace_period: boolean;
  /**
   * `true` if this access level is active for a lifetime (no expiration date).
   * @readonly
   */
  readonly is_lifetime: boolean;
  /**
   * `true` if this purchase was refunded
   * @readonly
   */
  readonly is_refund: boolean;
  /**
   * Time when the access level was renewed.
   * It can be null if the purchase was first in chain
   *  or it is non-renewing subscription / non-consumable (e.g. lifetime)
   * @readonly
   */
  readonly renewed_at?: Date;
  /**
   * Time when this access level has started.
   * Could be in the future.
   * @readonly
   */
  readonly starts_at?: Date;
  /**
   * A store of the purchase that unlocked this access level.
   * @readonly
   */
  readonly store: VendorStore;
  /**
   * Time when the auto-renewable subscription was cancelled.
   * Subscription can still be active,
   * it just means that auto-renewal turned off.
   * Will be set to `null` if the user reactivates the subscription.
   * @readonly
   */
  readonly unsubscribed_at?: Date;
  /**
   * An identifier of a product in a store that unlocked this access level.
   * @readonly
   */
  readonly vendor_product_id: string;
  /**
   * `true` if this auto-renewable subscription is set to renew.
   * @readonly
   */
  readonly will_renew: boolean;
}

/**
 * Current user's consumable/non-subscription purchase.
 * @public
 */
export interface AdaptyNonSubscription {
  /**
   * `true` if the product is consumable.
   * @readonly
   */
  readonly is_consumable: boolean;
  /**
   * true if the purchase was refunded.
   */
  readonly is_refund: boolean;
  /**
   * `true` if the product was purchased in sandbox environment
   * @readonly
   */
  readonly is_sandbox: boolean;
  /**
   * An identifier of the purchase in Adapty.
   * You can use it to ensure that you’ve already processed this purchase
   * (for example tracking one time products).
   * @readonly
   */
  readonly purchase_id: string;
  /**
   * Date when the product was purchased.
   * @readonly
   */
  readonly purchased_at: Date;
  /**
   * A store of the purchase
   * @readonly
   */
  readonly store: VendorStore;
  /**
   * An identifier of a product in a store
   * that unlocked this subscription.
   * @readonly
   */
  readonly vendor_product_id: String;
  /**
   * A transaction id of a purchase in a store
   * that unlocked this subscription.
   * @readonly
   */
  readonly vendor_transaction_id?: string;
}
/**
 * Current user's subscription purchase.
 * @public
 */
export interface AdaptySubscription {
  /**
   * Time when the subscription was activated.
   * @readonly
   */
  readonly activated_at: Date;
  /**
   * A type of an active introductory offer.
   * If the value is not `null`,
   * it means that the offer was applied during the current subscription period.
   * @readonly
   */
  readonly active_introductory_offer_type?: OfferType;
  /**
   * An id of active promotional offer.
   * @readonly
   */
  readonly active_promotional_offer_id?: string;
  /**
   * A type of an active promotional offer.
   * If the value is not `null`,
   * it means that the offer was applied during the current subscription period.
   * @readonly
   */
  readonly active_promotional_offer_type?: OfferType;
  /**
   * Time when a billing issue was detected. Subscription can still be active.
   * @readonly
   */
  readonly billing_issue_detected_at?: Date;
  /**
   * A reason why a subscription was cancelled.
   * @readonly
   */
  readonly cancellation_reason?: CancellationReason;
  /**
   * Time when the access level will expire.
   * Could be in the past and could be `null` for lifetime access.
   * @readonly
   */
  readonly expires_at?: Date;
  /**
   * `true` if this subscription is active
   * @readonly
   */
  readonly is_active: boolean;
  /**
   * `true` if auto renewable subscription is in grace period
   * @readonly
   */
  readonly is_in_grace_period: boolean;
  /**
   * `true` if the subscription is active for lifetime
   * (no expiration date).
   */
  readonly is_lifetime: boolean;
  /**
   * `true` if the purchase was refunded
   * @readonly
   */
  readonly is_refund: boolean;
  /**
   * `true` if the product was purchased in sandbox enviroment
   * @readonly
   */
  readonly is_sandbox: boolean;
  /**
   * Time when the subscription was renewed.
   * It can be `null` if the purchase was first in chain
   * or it is non-renewing subscription.
   * @readonly
   */
  readonly renewed_at?: Date;
  /**
   * Time when the subscription has started.
   * Could be in the future.
   * @readonly
   */
  readonly starts_at?: Date;
  /**
   * A store of the purchase.
   * @readonly
   */
  readonly store: VendorStore;
  /**
   * Time when the auto-renewable subscription was cancelled.
   * Subscription can still be active,
   * it means that auto-renewal is turned off.
   * Would be `null` if a user reactivates the subscription.
   */
  readonly unsubscribed_at?: Date;
  /**
   * An original transaction id of the purchase
   * in a store that unlocked this subscription.
   * For auto-renewable subscription,
   * this will be an id of the first transaction
   *  in this subscription.
   * @readonly
   */
  readonly vendor_original_transaction_id: string;
  /**
   * An identifier of a product in a store that unlocked this subscription.
   * @readonly
   */
  readonly vendor_product_id: string;
  /**
   * A transaction id of a purchase in a store that unlocked this subscription.
   * @readonly
   */
  readonly vendor_transaction_id: string;
  /**
   * `true` if the auto-renewable subscription is set to renew
   * @readonly
   */
  readonly will_renew: boolean;
}

export interface AdaptyPaywallProduct {
  /**
   * Unique identifier of a product
   * from App Store Connect or Google Play Console
   * @readonly
   */
  vendor_product_id: string;
}

/**
 * Describes an object that represents a product.
 * Used in {@link Adapty.getPaywallProducts} method and in {@link Adapty.makePurchase} method.
 * @public
 */
export interface AdaptyProduct {
  /**
   * The currency code of the locale
   * used to format the price of the product.
   * The ISO 4217 (USD, EUR).
   * @readonly
   */
  readonly currency_code?: string;
  /**
   * The currency symbol of the locale
   * used to format the price of the product.
   * ($, €).
   * @readonly
   */
  readonly currency_symbol?: string;
  /**
   * An object containing introductory price information for a product.
   * iOS: Will be null for iOS version below 11.2
   * and macOS version below 10.14.4.
   */
  readonly introductory_discount?: AdaptyProductDiscount;
  /**
   * User's eligibility for your introductory offer.
   * Check this property before displaying info about
   * introductory offers (i.e. free trials)
   * @readonly
   */
  readonly introductory_offer_eligibility: OfferEligibility;
  /**
   * A description of the product.
   * @readonly
   */
  readonly localized_description: string;
  /**
   * A price’s language is determined
   * by the preferred language set on the device.
   * On Android, the formatted price from Google Play as is.
   * @readonly
   */
  readonly localized_price?: string;
  /**
   * The period’s language is determined
   * by the preferred language set on the device.
   * @readonly
   */
  readonly localized_subscription_period?: string;
  /**
   * The name of the product.
   * @readonly
   */
  readonly localized_title: string;
  /**
   * Same as `abTestName` property of the parent {@link AdaptyPaywall}.
   * @readonly
   */
  readonly paywall_ab_test_name: string;
  /**
   * Same as `name` property of the parent {@link AdaptyPaywall}.
   * @readonly
   */
  readonly paywall_name: string;
  /**
   * The cost of the product in the local currency
   * @readonly
   */
  readonly price: number;
  /**
   * The period details for products that are subscriptions.
   * Will be `null` for iOS version below 11.2 and macOS version below 10.14.4.
   * @readonly
   */
  readonly subscription_period?: AdaptySubscriptionPeriod;
  /**
   * Same as `variationId` property of the parent {@link AdaptyPaywall}.
   * @readonly
   */
  readonly variation_id: string;
  /**
   * Unique identifier of a product
   * from App Store Connect or Google Play Console
   * @readonly
   */
  readonly vendor_product_id: string;

  /**
   * An object containing free trial information for the given product.
   * android only
   * @see {@link https://developer.android.com/google/play/billing/subscriptions#free-trial}
   * @readonly
   */
  readonly free_trial_period?: AdaptySubscriptionPeriod;
  /**
   * The period’s language is determined
   * by the preferred language set on the device.
   * android only
   * @readonly
   */
  readonly localized_free_trial_period?: string;

  /**
   * An array of subscription offers available for the auto-renewable subscription.
   * Will be empty for iOS version below 12.2
   * and macOS version below 10.14.4.
   * iOS only
   * @readonly
   */
  readonly discounts: AdaptyProductDiscount[];
  /**
   * Boolean value that indicates
   * whether the product is available for family sharing
   * in App Store Connect.
   * Will be `false` for iOS version below 14.0 and macOS version below 11.0.
   * iOS only
   * @see {@link https://developer.apple.com/documentation/storekit/skproduct/3564805-isfamilyshareable}
   * @readonly
   */
  readonly is_family_shareable: boolean;
  /**
   * User's eligibility for the promotional offers.
   * Check this property before displaying info
   * about promotional offers
   * iOS only
   * @readonly
   */
  readonly promotional_offer_eligibility: OfferEligibility;
  /**
   * An identifier of a promotional offer,
   * provided by Adapty for this specific user.
   * iOS only
   * @readonly
   */
  readonly promotional_offer_id?: string;
  /**
   * The region code of the locale used to format the price of the product.
   * ISO 3166 ALPHA-2 (US, DE)
   * iOS only
   * @readonly
   */
  readonly region_code?: string;
  /**
   * An identifier of the subscription group
   * to which the subscription belongs.
   * Will be `null` for iOS version below 12.0 and macOS version below 10.14.
   * iOS only
   * @readonly
   */
  readonly subscription_group_identifier?: string;
}

/**
 * Discount model to products
 * @see {@link https://doc.adapty.io/docs/rn-api-reference#adaptyproductdiscount}
 */
export interface AdaptyProductDiscount {
  /**
   * A formatted number of periods of a discount for a user’s locale.
   * @readonly
   */
  readonly localized_number_of_periods?: string;
  /**
   * A formatted price of a discount for a user’s locale.
   * @readonly
   */
  readonly localized_price?: string;
  /**
   * A formatted subscription period of a discount for a user’s locale.
   * @readonly
   */
  readonly localized_subscription_period?: string;
  /**
   * A number of periods this product discount is available.
   * @readonly
   */
  readonly number_of_periods: number;
  /**
   * Discount price of a product in a local currency.
   * @readonly
   */
  readonly price: number;
  /**
   * An information about period for a product discount.
   * @readonly
   */
  readonly subscription_period: AdaptySubscriptionPeriod;

  ios?: {
    /**
     * Unique identifier of a discount offer for a product.
     * @see {@link https://developer.apple.com/documentation/storekit/skpaymentdiscount/3043528-identifier}
     * @readonly
     */
    readonly identifier?: string;
    /**
     * A payment mode for this product discount.
     * @readonly
     */
    readonly payment_mode: OfferType;
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
  readonly number_of_units: number;
  /**
   * A unit of time that a subscription period is specified in.
   * @readonly
   */
  readonly unit: ProductPeriod;
}

export interface AdaptyProfileParameters {
  analytics_disabled?: boolean;
  codable_custom_attributes?: { [key: string]: any };
  app_tracking_transparency_status?: AppTrackingTransparencyStatus;
  store_country?: string;
  first_name?: string;
  last_name?: string;
  gender?: Gender;
  birthday?: string;
  email?: string;
  phone_number?: string;
  facebook_anonymous_id?: string;
  amplitude_user_id?: string;
  amplitude_device_id?: string;
  mixpanel_user_id?: string;
  appmetrica_profile_id?: string;
  appmetrica_device_id?: string;
  one_signal_player_id?: string;
  pushwoosh_hwid?: string;
  firebase_app_instance_id?: string;
  airbridge_device_id?: string;
}

export enum SKPaymentTransactionState {
  purchasing = 0, // Transaction is being added to the server queue.
  purchased = 1, // Transaction is in queue, user has been charged.  Client should complete the transaction.
  failed = 2, // Transaction was cancelled or failed before being added to the server queue.
  restored = 3, // Transaction was restored from user's purchase history.  Client should complete the transaction.
  deferred = 4, // The transaction is in the queue, but its final status is pending external action.
}
export interface SKPayment {
  productIdentifier: string;
  quantity: number;
  requestData: string;
  applicationUsername?: string;
  simulatesAskToBuyInSandbox: boolean;
}

export interface SKTransaction {
  errorDescription: string;
  original?: Omit<SKTransaction, 'original'>;
  payment: SKPayment;
  transactionDate: string;
  transactionIdentifier: string;
  transactionState: SKPaymentTransactionState;
}
