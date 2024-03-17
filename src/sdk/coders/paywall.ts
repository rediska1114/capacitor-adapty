import type { AdaptySdk } from '../api';
import type { AdaptyPaywall, ProductReference } from '../cdk';

export function decodePaywall(
  paywall: AdaptySdk['InOutput.AdaptyPaywall'],
): AdaptyPaywall {
  return {
    abTestName: paywall.ab_test_name,
    placementId: paywall.developer_id,
    locale: paywall.remote_config.lang,
    hasViewConfiguration: paywall.use_paywall_builder || false,
    name: paywall.paywall_name,
    remoteConfig: paywall.remote_config.data,
    revision: paywall.revision,
    variationId: paywall.variation_id,
    products: paywall.products.map(decodeProductReference),
    instanceIdentity: paywall.paywall_id,
    version: paywall.paywall_updated_at,
  };
}

export function encodePaywall(
  paywall: AdaptyPaywall,
): AdaptySdk['InOutput.AdaptyPaywall'] {
  return {
    ab_test_name: paywall.abTestName,
    developer_id: paywall.placementId,
    remote_config: {
      lang: paywall.locale,
      data: paywall.remoteConfig,
    },
    use_paywall_builder: paywall.hasViewConfiguration,
    paywall_name: paywall.name,
    revision: paywall.revision,
    variation_id: paywall.variationId,
    products: paywall.products.map(encodeProductReference),
    paywall_id: paywall.instanceIdentity,
    paywall_updated_at: paywall.version,
  };
}

function decodeProductReference(
  product: AdaptySdk['InOutput.ProductReference'],
): ProductReference {
  return {
    vendorId: product.vendor_product_id,
    adaptyProductId: product.adapty_product_id,
    ios: {
      promotionalOfferId: product.promotional_offer_id,
    },
  };
}

function encodeProductReference(
  product: ProductReference,
): AdaptySdk['InOutput.ProductReference'] {
  return {
    vendor_product_id: product.vendorId,
    adapty_product_id: product.adaptyProductId,
    promotional_offer_id: product.ios?.promotionalOfferId,
  };
}
