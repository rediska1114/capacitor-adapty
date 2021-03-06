import { CapacitorAdaptyPlugin } from './definitions';
import { Plugins } from '@capacitor/core';
import {
  AdaptyDefaultOptions,
  AdaptyPurchaserInfo,
  UpdateProfileOptions,
  RestorePurchasesResult,
  MakePurchaseResult,
  AdaptyPromo,
  GetPaywallsResult,
} from './sdk/types';

const CapacitorAdapty = Plugins.CapacitorAdapty as CapacitorAdaptyPlugin;

export interface IAdaptySerivice {
  presentCodeRedemptionSheet: () => void;
  identify: (uId: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (fields: Object) => Promise<void>;
  logShowPaywall: (variationId: string) => Promise<void>;
  getAPNSToken: () => Promise<string>;
  setAPNSToken: (token: string) => Promise<void>;
  getPurchaseInfo: (
    options?: AdaptyDefaultOptions,
  ) => Promise<AdaptyPurchaserInfo>;
  restorePurchases: () => Promise<RestorePurchasesResult>;
  makePurchase: (
    product: string,
    variationId?: string,
    offerId?: string,
  ) => Promise<MakePurchaseResult>;
  getPromo: () => Promise<AdaptyPromo>;
  getPaywalls: (options?: AdaptyDefaultOptions) => Promise<GetPaywallsResult>;
  setExternalAnalyticsEnabled: (isEnabled: boolean) => Promise<void>;
  setVariationID: (variationId: string, transactionId: string) => Promise<void>;

  updateAttribution: (
    object: Object,
    source: 'Branch' | 'AppsFlyer' | 'Adjust' | 'Custom' | 'AppleSearchAds',
  ) => Promise<void>;
}

export class Adapty implements IAdaptySerivice {
  private adapty = CapacitorAdapty;

  presentCodeRedemptionSheet() {
    return this.adapty.presentCodeRedemptionSheet();
  }
  identify(customerUserId: string) {
    return this.adapty.identify({
      customerUserId,
    });
  }
  logout() {
    return this.adapty.logout();
  }
  updateProfile(fields: UpdateProfileOptions) {
    return this.adapty.updateProfile(fields);
  }

  logShowPaywall(variationId: string) {
    return this.adapty.logShowPaywall({ variationId });
  }

  async getAPNSToken() {
    const result = await this.adapty.getAPNSToken();
    return result.token;
  }

  setAPNSToken(token: string) {
    return this.adapty.setAPNSToken({ apns: token });
  }

  getPurchaseInfo(options?: AdaptyDefaultOptions) {
    return this.adapty.getPurchaseInfo(options);
  }

  restorePurchases() {
    return this.adapty.restorePurchases();
  }

  makePurchase(productId: string, variationId?: string, offerId?: string) {
    return this.adapty.makePurchase({
      productId,
      variationId,
      offerId,
    });
  }

  getPromo() {
    return this.adapty.getPromo();
  }

  getPaywalls(options?: AdaptyDefaultOptions) {
    return this.adapty.getPaywalls(options);
  }
  setExternalAnalyticsEnabled(isEnabled: boolean) {
    return this.adapty.setExternalAnalyticsEnabled({ isEnabled });
  }
  setVariationID(variationId: string, transactionId: string) {
    return this.adapty.setVariationID({ variationId, transactionId });
  }

  getCustomerUserId() {
    return this.adapty
      .getCustomerUserId()
      .then(({ customerUserId }) => customerUserId);
  }

  updateAttribution(
    attribution: Object,
    source: 'Branch' | 'AppsFlyer' | 'Adjust' | 'Custom' | 'AppleSearchAds',
    networkUserId?: string,
  ) {
    return this.adapty.updateAttribution({
      attribution,
      source,
      networkUserId,
    });
  }

  addListener = this.adapty.addListener;
}
