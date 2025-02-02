import type { PluginListenerHandle } from '@capacitor/core';
import type * as Models from './sdk/cdk';
import type { AdaptySdk } from './sdk/api';

export interface AdaptyPlugin {
  activate(options: ActivateOptions): Promise<void>;
  updateAttribution(options: AttributionOptions): Promise<void>;
  getPaywall(
    options: GetPaywallOptions,
  ): Promise<{ paywall: AdaptySdk['InOutput.AdaptyPaywall'] }>;
  getPaywallProducts(options: {
    paywall: AdaptySdk['InOutput.AdaptyPaywall'];
  }): Promise<{ products: AdaptySdk['Output.AdaptyPaywallProduct'][] }>;
  getProductsIntroductoryOfferEligibility(options: {
    vendorProductIds: string[];
  }): Promise<{ eligibilities: Record<string, Models.OfferEligibility> }>;
  logShowOnboarding(options: ShowOnboardingOptions): Promise<void>;
  logShowPaywall(options: {
    paywall: AdaptySdk['InOutput.AdaptyPaywall'];
  }): Promise<void>;
  setFallbackPaywalls(options: { fileName?: string }): Promise<void>;
  getProfile(): Promise<{ profile: AdaptySdk['Output.AdaptyProfile'] }>;
  identify(options: { customerUserId: string }): Promise<void>;
  logout(): Promise<void>;
  updateProfile(options: {
    params: Partial<AdaptySdk['Input.AdaptyProfileParameters']>;
  }): Promise<void>;
  makePurchase(
    options: MakePurchaseOptions,
  ): Promise<{ purchase: AdaptySdk['Output.AdaptyPurchasedInfo'] }>;
  presentCodeRedemptionSheet(): Promise<void>;
  restorePurchases(): Promise<{ profile: AdaptySdk['Output.AdaptyProfile'] }>;
  setLogLevel(options: { logLevel: Models.LogLevel }): Promise<void>;

  addListener(
    eventName: 'onLatestProfileLoad',
    listenerFunc: (data: {
      profile: AdaptySdk['Output.AdaptyProfile'];
    }) => void,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
}

export interface ActivateOptions {
  apiKey: string;
  customerUserId?: string;
  logLevel?: Models.LogLevel;
  libVersion: string;
  observerMode?: boolean;
  idfaCollectionDisabled?: boolean;
}

export interface AttributionOptions {
  attribution: Record<string, any>;
  source: Models.AttributionNetwork | string;
  networkUserId?: string;
}

export interface MakePurchaseOptions {
  product: AdaptySdk['Input.AdaptyPaywallProduct'];
  android?: {
    old_sub_vendor_product_id: string;
    replacement_mode: Models.AdaptyAndroidSubscriptionUpdateReplacementMode;
    is_offer_personalized?: boolean;
  };
}

export interface ShowOnboardingOptions {
  name?: string;
  screenName?: string;
  screenOrder: number;
}

export interface GetPaywallOptions {
  placementId: string;
  locale: string;
  fetchPolicy?: Models.PaywallFetchPolicy;
  loadTimeout?: number;
}
