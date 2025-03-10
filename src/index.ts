import {
  Capacitor,
  PluginListenerHandle,
  registerPlugin,
} from '@capacitor/core';
import type * as Models from './sdk/cdk';
import type {
  ActivateOptions,
  AdaptyPlugin,
  GetPaywallOptions,
  MakePurchaseOptions,
} from './definitions';
import { decodePaywall, encodePaywall } from './sdk/coders/paywall';
import { decodeProduct, encodeProduct } from './sdk/coders/product';
import { decodeProfile } from './sdk/coders/profile';
import { encodeProfileParameters } from './sdk/coders/profile-parameters';
import { decodeSKTransaction } from './sdk/coders/sk-transaction';
import { PromiseQueue } from './promise-queue';

const CapacitorAdapty = registerPlugin<AdaptyPlugin>('Adapty', {});

const LIB_VERSION = import.meta.env.PUBLIC_VERSION;

export class Adapty {
  private adapty = CapacitorAdapty;

  private resolveActivation: ((value: void) => void) | null = null;
  private activatingPromise: Promise<void> | null = new Promise(
    resolve => (this.resolveActivation = resolve),
  );

  private async awaitActivation() {
    if (this.activatingPromise) {
      await this.activatingPromise;
      this.activatingPromise = null;
    }
  }

  // https://github.com/adaptyteam/AdaptySDK-React-Native/issues/66#issuecomment-1521638581
  private mutationalQueue = new PromiseQueue();

  async activate(
    apiKey: string,
    options: Omit<ActivateOptions, 'apiKey' | 'libVersion'>,
  ) {
    const promise = this.adapty.activate({
      apiKey,
      libVersion: LIB_VERSION,
      ...options,
    });

    if (!this.activatingPromise) {
      this.activatingPromise = promise;
    }

    const result = await promise;

    if (this.resolveActivation) {
      this.resolveActivation();
      this.resolveActivation = null;
    }

    return result;
  }

  async updateAttribution(
    source: Models.AttributionNetwork | string,
    attribution: Record<string, any>,
    networkUserId?: string,
  ) {
    await this.awaitActivation();

    return this.adapty.updateAttribution({
      source,
      attribution,
      networkUserId,
    });
  }

  async getPaywall(
    placementId: string,
    locale: string,
    options?: Partial<Omit<GetPaywallOptions, 'placementId' | 'locale'>>,
  ): Promise<Models.AdaptyPaywall> {
    await this.awaitActivation();

    return this.adapty
      .getPaywall({ placementId, locale, ...options })
      .then(res => decodePaywall(res.paywall));
  }

  async getPaywallProducts(
    paywall: Models.AdaptyPaywall,
  ): Promise<Models.AdaptyPaywallProduct[]> {
    await this.awaitActivation();

    return this.adapty
      .getPaywallProducts({ paywall: encodePaywall(paywall) })
      .then(res => res.products.map(decodeProduct));
  }

  async getProductsIntroductoryOfferEligibility<
    T extends Models.AdaptyPaywallProduct['vendorProductId'],
  >(vendorProductIds: T[]): Promise<Record<T, Models.OfferEligibility>> {
    await this.awaitActivation();

    if (Capacitor.getPlatform() === 'android') {
      // const result = products.reduce((acc, product) => {
      //   acc[product.vendorProductId as T] =
      //     product.subscriptionDetails?.android?.introductoryOfferEligibility ??
      //     'ineligible';
      //   return acc;
      // }, {} as Record<T, Models.OfferEligibility>);

      return {} as Record<T, Models.OfferEligibility>;
    }

    return this.adapty
      .getProductsIntroductoryOfferEligibility({
        vendorProductIds, // : products.map(p => p.vendorId),
      })
      .then(res => res.eligibilities);
  }

  async logShowOnboarding(
    screenOrder: number,
    screenName?: string,
    name?: string,
  ): Promise<void> {
    await this.awaitActivation();

    return this.adapty.logShowOnboarding({ screenOrder, screenName, name });
  }

  async logShowPaywall(paywall: Models.AdaptyPaywall): Promise<void> {
    await this.awaitActivation();

    return this.adapty.logShowPaywall({ paywall: encodePaywall(paywall) });
  }

  async setFallbackPaywalls(fileName?: string): Promise<void> {
    await this.awaitActivation();
    return this.adapty.setFallbackPaywalls({ fileName });
  }

  async getProfile(): Promise<Models.AdaptyProfile> {
    await this.awaitActivation();
    return this.adapty.getProfile().then(res => decodeProfile(res.profile));
  }

  async identify(customerUserId: string): Promise<void> {
    await this.awaitActivation();
    return this.mutationalQueue.enqueue(() =>
      this.adapty.identify({ customerUserId }),
    );
  }

  async logout() {
    await this.awaitActivation();
    return this.mutationalQueue.enqueue(() => this.adapty.logout());
  }

  async updateProfile(
    params: Partial<Models.AdaptyProfileParameters>,
  ): Promise<void> {
    await this.awaitActivation();

    return this.mutationalQueue.enqueue(() =>
      this.adapty.updateProfile({
        params: encodeProfileParameters(params),
      }),
    );
  }

  async makePurchase(
    product: Models.AdaptyPaywallProduct,
    android?: {
      oldSubVendorProductId: string;
      prorationMode: Models.AdaptyAndroidSubscriptionUpdateReplacementMode;
      isOfferPersonalized?: boolean;
    },
  ): Promise<Models.AdaptyPurchasedInfo> {
    await this.awaitActivation();

    let params: MakePurchaseOptions = {
      product: encodeProduct(product),
      android: android
        ? {
            replacement_mode: android.prorationMode,
            old_sub_vendor_product_id: android.oldSubVendorProductId,
            is_offer_personalized: android.isOfferPersonalized,
          }
        : undefined,
    };

    return this.adapty.makePurchase(params).then(res => ({
      profile: decodeProfile(res.purchase.profile),
      purchase: res.purchase.purchase,
      vendorOriginalTransactionId: res.purchase.vendor_original_transaction_id,
      vendorTransactionId: res.purchase.vendor_transaction_id,
      transaction: res.purchase.transaction
        ? decodeSKTransaction(res.purchase.transaction)
        : undefined,
    }));
  }

  async presentCodeRedemptionSheet() {
    await this.awaitActivation();

    return this.adapty.presentCodeRedemptionSheet();
  }

  async restorePurchases(): Promise<Models.AdaptyProfile> {
    await this.awaitActivation();

    return this.adapty
      .restorePurchases()
      .then(res => decodeProfile(res.profile));
  }

  async setLogLevel(logLevel: Models.LogLevel): Promise<void> {
    await this.awaitActivation();

    return this.adapty.setLogLevel({ logLevel });
  }

  addListener(
    eventName: 'onLatestProfileLoad',
    listenerFunc: (data: { profile: Models.AdaptyProfile }) => void,
  ): PluginListenerHandle & Promise<PluginListenerHandle>;

  addListener(eventName: string, listenerFunc: (...args: any[]) => void) {
    {
      switch (eventName) {
        case 'onLatestProfileLoad':
          return this.adapty.addListener(eventName, data =>
            listenerFunc({ profile: decodeProfile(data.profile) }),
          );
      }
    }
  }
}

export * from './definitions';
export * from './sdk/cdk';
export * from './sdk/errors';
