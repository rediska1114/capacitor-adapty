import { registerPlugin } from '@capacitor/core';

import type { AdaptyPlugin } from './definitions';
import { AdaptyDefaultOptions, UpdateProfileOptions } from './sdk/types';

const CapacitorAdapty = registerPlugin<AdaptyPlugin>('Adapty', {
  // web: () => import('./web').then(m => new m.AdaptyWeb()),
});

export class Adapty {
  private adapty = CapacitorAdapty;

  presentCodeRedemptionSheet() {
    return this.adapty.presentCodeRedemptionSheet();
  }
  identify(customerUserId: string) {
    return this.adapty.identify({ customerUserId });
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

export * from './definitions';
export * from './sdk/types';
export * from './sdk/errors';
