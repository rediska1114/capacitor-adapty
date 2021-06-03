import { PluginListenerHandle } from '@capacitor/core';
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
  GetCustomerUserIdResult,
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

export type PurchaseSuccessListener = (data: { purchase: 'success' }) => void;
export type PurchaseFailedListener = (data: { purchase: 'failed' }) => void;
export type InfoUpdateListener = (data: AdaptyPurchaserInfo) => void;
export type PromoReceivedListener = (data: AdaptyPromo) => void;

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
  getCustomerUserId(): Promise<GetCustomerUserIdResult>

  addListener(
    eventName: 'onPurchaseSuccess',
    listenerFunc: PurchaseSuccessListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;

  addListener(
    eventName: 'onPurchaseFailed',
    listenerFunc: PurchaseFailedListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;

  addListener(
    eventName: 'onInfoUpdate',
    listenerFunc: InfoUpdateListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;

  addListener(
    eventName: 'onPromoReceived',
    listenerFunc: PromoReceivedListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;

  // TODO remove listeners
}
