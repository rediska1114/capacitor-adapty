import {
  ActivateOptions,
  AdaptyPromo,
  AdaptyPurchaserInfo,
  GetAPNSTokenResult,
  GetPaywallsResult,
  IdentifyOptions,
  LogShowPaywallOptions,
  MakePurchaseOptions,
  MakePurchaseResult,
  RestorePurchasesResult,
  SetAPNSTokenOptions,
  SetExternalAnalyticsEnabledOptions,
  SetVariationIDOptions,
  UpdateAttributionOptions,
  UpdateProfileOptions,
  AdaptyDefaultOptions,
} from './sdk/types';

declare global {
  interface PluginRegistry {
    CapacitorAdapty: CapacitorAdaptyPlugin;
  }
}

export interface CapacitorAdaptyPlugin {
  activate(options: ActivateOptions): Promise<void>;
  getPaywalls(options?: AdaptyDefaultOptions): Promise<GetPaywallsResult>;
  updateAttribution(options: UpdateAttributionOptions): Promise<void>;
  setExternalAnalyticsEnabled(
    options: SetExternalAnalyticsEnabledOptions,
  ): Promise<void>;
  logShowPaywall(options: LogShowPaywallOptions): Promise<void>;
  getAPNSToken(): Promise<GetAPNSTokenResult>;
  setAPNSToken(options: SetAPNSTokenOptions): Promise<void>;
  identify(options: IdentifyOptions): Promise<void>;
  logout(): Promise<void>;
  updateProfile(options: UpdateProfileOptions): Promise<void>;
  presentCodeRedemptionSheet(): Promise<void>;
  setVariationID(options: SetVariationIDOptions): Promise<void>;
  getPromo(): Promise<AdaptyPromo>;
  restorePurchases(): Promise<RestorePurchasesResult>;
  getPurchaseInfo(options?: AdaptyDefaultOptions): Promise<AdaptyPurchaserInfo>;
  makePurchase(options: MakePurchaseOptions): Promise<MakePurchaseResult>;
}
