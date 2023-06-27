import { PluginListenerHandle } from '@capacitor/core';
import * as Models from './sdk/cdk';

export interface AdaptyPlugin {
  activate(options: ActivateOptions): Promise<void>;

  updateAttribution(options: AttributionOptions): Promise<void>;

  getPaywall(options: {
    id: string;
    locale: string;
  }): Promise<Models.AdaptyPaywall>;

  getPaywallProducts(options: {
    paywall: Models.AdaptyPaywall;
  }): Promise<{ products: Models.AdaptyProduct[] }>;

  logShowOnboarding(options: ShowOnboardingOptions): Promise<void>;
  logShowPaywall(options: { paywall: Models.AdaptyPaywall }): Promise<void>;
  setFallbackPaywalls(options: { paywalls: any }): Promise<void>;
  getProfile(): Promise<Models.AdaptyProfile>;
  identify(options: { customerUserId: string }): Promise<void>;
  logout(): Promise<void>;
  updateProfile(options: {
    params: Partial<Models.AdaptyProfileParameters>;
  }): Promise<void>;
  makePurchase(options: {
    product: Models.AdaptyProduct;
  }): Promise<MakePurchaseResult>;
  presentCodeRedemptionSheet(): Promise<void>;
  restorePurchases(): Promise<Models.AdaptyProfile>;
  setLogLevel(options: { logLevel: string }): Promise<void>;

  addListener(
    eventName: 'onLatestProfileLoad',
    listenerFunc: (profile: Models.AdaptyProfile) => void,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
}

export enum LogLevel {
  error = 'error',
  warn = 'warn',
  info = 'info',
  verbose = 'verbose',
  debug = 'debug',
}

export enum StoreKit2Usage {
  forIntroEligibilityCheck = 'for_intro_eligibility_check',
  disabled = 'disabled',
}

export interface ActivateOptions {
  apiKey: string;
  customerUserId?: string;
  logLevel?: LogLevel;
  libVersion: string;
  observerMode?: boolean;
  enableUsageLogs?: boolean;
  storeKit2Usage?: StoreKit2Usage;
}

export enum AttributionNetwork {
  appsflyer = 'appsflyer',
  adjust = 'adjust',
  branch = 'branch',
  custom = 'custom',
  appleSearchAds = 'apple_search_ads',
}
export interface AttributionOptions {
  attribution: Record<string, any>;
  source: AttributionNetwork | string;
  networkUserId?: string;
}

export interface ShowOnboardingOptions {
  name?: string;
  screenName?: string;
  screenOrder: number;
}

export interface MakePurchaseResult {
  profile: Models.AdaptyProfile;
  transaction?: Models.SKTransaction;
}
