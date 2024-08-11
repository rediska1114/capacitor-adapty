/**
 * This file was copied from adaptyteam/AdaptySDK-React-Native/lib/src/types/api.d.ts
 * Do not make direct changes to the file.
 */

/** OneOf type helpers */
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;
type OneOf<T extends any[]> = T extends [infer Only]
  ? Only
  : T extends [infer A, infer B, ...infer Rest]
  ? OneOf<[XOR<A, B>, ...Rest]>
  : never;

export type paths = Record<string, never>;

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    /**
     * @example custom
     * @enum {string}
     */
    'Input.AdaptyAttributionSource':
      | 'adjust'
      | 'appsflyer'
      | 'branch'
      | 'apple_search_ads'
      | 'custom';
    'Input.AdaptyOnboardingScreenParameters': {
      onboarding_name?: string;
      onboarding_screen_name?: string;
      onboarding_screen_order: number;
    };
    'Input.AdaptyPaywallProduct': {
      /** @example yearly.premium.6999 */
      vendor_product_id: string;
      adapty_product_id: string;
      /** @description iOS Only */
      promotional_offer_id?: string;
      paywall_variation_id: string;
      paywall_ab_test_name: string;
      paywall_name: string;
      payload_data?: Object;
    };
    /**
     * @description iOS Only
     * @enum {string}
     */
    'Input.AdaptyIOSProductsFetchPolicy':
      | 'default'
      | 'wait_for_receipt_validation';
    /**
     * @description iOS Only
     * @enum {string}
     */
    'Input.AdaptyIOSAppTrackingTransparencyStatus':
      | 'not_determined'
      | 'restricted'
      | 'denied'
      | 'authorized';
    /**
     * @description * `f` - female
     * * `m` - male
     * * `o` - other
     *
     * @enum {string}
     */
    'Input.AdaptyProfileGender': 'f' | 'm' | 'o';
    'Input.AdaptyProfileParameters': {
      first_name?: string;
      last_name?: string;
      gender?: components['schemas']['Input.AdaptyProfileGender'];
      /** Format: YYYY-MM-dd */
      birthday?: string;
      email?: string;
      phone_number?: string;
      facebook_anonymous_id?: string;
      amplitude_user_id?: string;
      amplitude_device_id?: string;
      mixpanel_user_id?: string;
      appmetrica_profile_id?: string;
      appmetrica_device_id?: string;
      /** @description iOS Only */
      att_status?: number;
      custom_attributes?: components['schemas']['InOutput.AdaptyProfile.CustomAttributes'];
      analytics_disabled?: boolean;
      one_signal_player_id?: string;
      one_signal_subscription_id?: string;
      pushwoosh_hwid?: string;
      firebase_app_instance_id?: string;
      airbridge_device_id?: string;
    };
    /** @description Android Only */
    'Input.AdaptyAndroidSubscriptionUpdateParameters': {
      old_sub_vendor_product_id: string;
      replacement_mode: components['schemas']['Input.AdaptyAndroidSubscriptionUpdateReplacementMode'];
    };
    /**
     * @description Android Only
     * @enum {string}
     */
    'Input.AdaptyAndroidSubscriptionUpdateReplacementMode':
      | 'charge_full_price'
      | 'deferred'
      | 'without_proration'
      | 'charge_prorated_price'
      | 'with_time_proration';
    'InOutput.AdaptyPaywallFetchPolicy':
      | {
          /** @enum {string} */
          type:
            | 'reload_revalidating_cache_data'
            | 'return_cache_data_else_load';
        }
      | {
          /** @enum {string} */
          type: 'return_cache_data_if_not_expired_else_load';
          /** Format: double */
          max_age: number;
        };
    'InOutput.AdaptyPaywall': {
      developer_id: string;
      paywall_id: string;
      revision: number;
      variation_id: string;
      ab_test_name: string;
      paywall_name: string;
      products: components['schemas']['InOutput.ProductReference'][];
      /** @default false */
      use_paywall_builder?: boolean;
      remote_config: {
        lang: string;
        /** @description A custom JSON string configured in Adapty Dashboard for this paywall. */
        data?: string;
      };
      /** Format: unix timestamp to millisecond */
      paywall_updated_at: number;
      payload_data?: string;
    };
    'InOutput.ProductReference': {
      vendor_product_id: string;
      adapty_product_id: string;
      /** @description iOS Only */
      promotional_offer_id?: string;
      /** @description Android Only */
      base_plan_id?: string;
      /** @description Android Only */
      offer_id?: string;
      /** @description Android Only */
      is_consumable?: boolean;
    };
    /**
     * @example eligible
     * @enum {string}
     */
    'InOutput.AdaptyEligibility': 'ineligible' | 'eligible' | 'not_applicable';
    /**
     * @example info
     * @enum {string}
     */
    'InOutput.AdaptyLoglevel': 'error' | 'warn' | 'info' | 'verbose' | 'debug';
    'InOutput.AdaptyProfile.CustomAttributes': {
      [key: string]: (string | null) | (number | null);
    };
    'Output.AdaptyPaywallProduct': {
      /** @example yearly.premium.6999 */
      vendor_product_id: string;
      adapty_product_id: string;
      localized_description: string;
      localized_title: string;
      region_code?: string;
      /**
       * @description iOS Only
       * @default false
       */
      is_family_shareable?: boolean;
      paywall_variation_id: string;
      paywall_ab_test_name: string;
      paywall_name: string;
      price?: components['schemas']['Output.AdaptyPrice'];
      subscription_details?: {
        /** @description iOS Only */
        subscription_group_identifier?: string;
        /** @description Android Only */
        android_offer_id?: string;
        /** @description Android Only */
        android_base_plan_id: string;
        /** @description Android Only */
        introductory_offer_eligibility: components['schemas']['InOutput.AdaptyEligibility'];
        /** @description Android Only */
        android_offer_tags?: string[];
        /**
         * @default autorenewable
         * @enum {string}
         */
        renewal_type?: 'prepaid' | 'autorenewable';
        subscription_period: components['schemas']['Output.AdaptySubscriptionPeriod'];
        localized_subscription_period?: string;
        introductory_offer_phases?: components['schemas']['Output.AdaptyDiscountPhase'][];
        promotional_offer?: components['schemas']['Output.AdaptyDiscountPhase'];
      };
      payload_data?: string;
    };
    'Output.AdaptyDiscountPhase': {
      price: components['schemas']['Output.AdaptyPrice'];
      /** @description iOS Only */
      identifier?: string;
      number_of_periods: number;
      payment_mode: components['schemas']['Output.AdaptyPaymentMode'];
      subscription_period: components['schemas']['Output.AdaptySubscriptionPeriod'];
      localized_subscription_period?: string;
      localized_number_of_periods?: string;
    };
    /**
     * @example month
     * @enum {string}
     */
    'Output.AdaptyPeriodUnit': 'day' | 'week' | 'month' | 'year' | 'unknown';
    'Output.AdaptyPrice': {
      /** Format: float */
      amount: number;
      currency_code?: string;
      currency_symbol?: string;
      localized_string?: string;
    };
    /**
     * @example free_trial
     * @enum {string}
     */
    'Output.AdaptyPaymentMode':
      | 'pay_as_you_go'
      | 'pay_up_front'
      | 'free_trial'
      | 'unknown';
    /**
     * @example {
     *   "unit": "year",
     *   "number_of_units": 1
     * }
     */
    'Output.AdaptySubscriptionPeriod': {
      unit: components['schemas']['Output.AdaptyPeriodUnit'];
      /** @example 1 */
      number_of_units: number;
    };
    'Output.AdaptyProfile': {
      /** Format: uuid */
      profile_id: string;
      customer_user_id?: string;
      segment_hash: string;
      custom_attributes?: components['schemas']['InOutput.AdaptyProfile.CustomAttributes'];
      /** @description Key - Paid Access Level ID. Value - Profile Paid Access Level object */
      paid_access_levels?: {
        [key: string]: components['schemas']['Output.AdaptyAccessLevel'];
      };
      /** @description Key - Product ID in Store. Value - Profile Subscription object */
      subscriptions?: {
        [key: string]: components['schemas']['Output.AdaptySubscription'];
      };
      /** @description Key - Product ID in Store. Value - List of Profile Non-Subscription object */
      non_subscriptions?: {
        [key: string]: components['schemas']['Output.AdaptyNonSubscription'][];
      };
    };
    'Output.AdaptyAccessLevel': {
      id: string;
      is_active: boolean;
      vendor_product_id: string;
      store: string;
      activated_at: components['schemas']['Output.Date'];
      renewed_at?: components['schemas']['Output.Date'];
      expires_at?: components['schemas']['Output.Date'];
      is_lifetime: boolean;
      active_introductory_offer_type?: string;
      active_promotional_offer_type?: string;
      /** @description iOS Only */
      active_promotional_offer_id?: string;
      /** @description Android Only */
      offer_id?: string;
      will_renew: boolean;
      is_in_grace_period: boolean;
      unsubscribed_at?: components['schemas']['Output.Date'];
      billing_issue_detected_at?: components['schemas']['Output.Date'];
      starts_at?: components['schemas']['Output.Date'];
      cancellation_reason?: string;
      is_refund: boolean;
    };
    'Output.AdaptyNonSubscription': {
      purchase_id: string;
      store: string;
      vendor_product_id: string;
      vendor_transaction_id?: string;
      purchased_at: components['schemas']['Output.Date'];
      is_sandbox: boolean;
      is_refund: boolean;
      is_consumable: boolean;
    };
    'Output.AdaptySubscription': {
      is_active: boolean;
      vendor_product_id: string;
      vendor_transaction_id: string;
      vendor_original_transaction_id: string;
      store: string;
      activated_at: components['schemas']['Output.Date'];
      renewed_at?: components['schemas']['Output.Date'];
      expires_at?: components['schemas']['Output.Date'];
      is_lifetime: boolean;
      active_introductory_offer_type?: string;
      active_promotional_offer_type?: string;
      /** @description iOS Only */
      active_promotional_offer_id?: string;
      /** @description Android Only */
      offer_id?: string;
      will_renew: boolean;
      is_in_grace_period: boolean;
      unsubscribed_at?: components['schemas']['Output.Date'];
      billing_issue_detected_at?: components['schemas']['Output.Date'];
      starts_at?: components['schemas']['Output.Date'];
      cancellation_reason?: string;
      is_refund: boolean;
      is_sandbox: boolean;
    };
    /** Format: yyyy-MM-dd'T'HH:mm:ss.SSSZ */
    'Output.Date': string;
    'Output.AdaptyResult': OneOf<
      [
        {
          /** @description Can be any value */
          success: unknown;
        },
        {
          error: components['schemas']['Output.AdaptyError'];
        },
      ]
    >;
    /** @description TODO */
    'Output.AdaptyError': {
      adapty_code: number;
      message: string;
      detail?: string;
    };

    'Output.SKPayment': {
      product_identifier: string;
      quantity: number;
      request_data: string;
      application_username?: string;
      simulates_ask_to_buy_in_sandbox: boolean;
    };

    'Output.SKPaymentTransaction': {
      error_description: string;
      original?: Omit<
        components['schemas']['Output.SKPaymentTransaction'],
        'original'
      >;
      payment: components['schemas']['Output.SKPayment'];
      transaction_date: string;
      transaction_identifier: string;
      transaction_state: 0 | 1 | 2 | 3 | 4;
    };
    'Output.AdaptyPurchasedInfo': {
      profile: components['schemas']['Output.AdaptyProfile'];
      purchase: any
      vendor_transaction_id: string;
      vendor_original_transaction_id: string;
      transaction?: components['schemas']['Output.SKPaymentTransaction'];
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export type operations = Record<string, never>;

export type AdaptySdk = components['schemas'];
