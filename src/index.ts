import { registerPlugin } from '@capacitor/core';
import type * as Models from './sdk/cdk';
import type {
  ActivateOptions,
  AdaptyPlugin,
  AttributionNetwork,
  MakePurchaseResult,
} from './definitions';
import { VERSION } from './version';

const libVersion = VERSION;

const CapacitorAdapty = registerPlugin<AdaptyPlugin>('Adapty', {});

export class Adapty {
  private adapty = CapacitorAdapty;

  activate(
    apiKey: string,
    options: Omit<ActivateOptions, 'apiKey' | 'libVersion'>,
  ) {
    return this.adapty.activate({
      apiKey,
      libVersion,
      ...options,
    });
  }

  updateAttribution(
    source: AttributionNetwork | string,
    attribution: Record<string, any>,
    networkUserId?: string,
  ) {
    return this.adapty.updateAttribution({
      source,
      attribution,
      networkUserId,
    });
  }

  getPaywall(id: string, locale: string): Promise<Models.AdaptyPaywall> {
    return this.adapty.getPaywall({ id, locale });
  }

  getPaywallProducts(
    paywall: Models.AdaptyPaywall,
  ): Promise<Models.AdaptyProduct[]> {
    return this.adapty
      .getPaywallProducts({ paywall })
      .then(res => res.products);
  }

  logShowOnboarding(
    screenOrder: number,
    screenName?: string,
    name?: string,
  ): Promise<void> {
    return this.adapty.logShowOnboarding({ screenOrder, screenName, name });
  }

  logShowPaywall(paywall: Models.AdaptyPaywall): Promise<void> {
    return this.adapty.logShowPaywall({ paywall });
  }

  setFallbackPaywalls(paywalls: any): Promise<void> {
    return this.adapty.setFallbackPaywalls({ paywalls });
  }

  getProfile = this.adapty.getProfile;

  identify(customerUserId: string): Promise<void> {
    return this.adapty.identify({ customerUserId });
  }

  logout = this.adapty.logout;

  updateProfile(
    params: Partial<Models.AdaptyProfileParameters>,
  ): Promise<void> {
    return this.adapty.updateProfile({ params });
  }

  makePurchase(product: Models.AdaptyProduct): Promise<MakePurchaseResult> {
    return this.adapty.makePurchase({ product });
  }

  presentCodeRedemptionSheet = this.adapty.presentCodeRedemptionSheet;

  restorePurchases = this.adapty.restorePurchases;

  setLogLevel(logLevel: string): Promise<void> {
    return this.adapty.setLogLevel({ logLevel });
  }

  addListener = this.adapty.addListener;
}

export * from './definitions';
export * from './sdk/cdk';
export * from './sdk/errors';
