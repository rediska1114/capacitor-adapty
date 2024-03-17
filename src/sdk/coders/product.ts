import type { AdaptyPaywallProduct } from '../cdk';
import type { AdaptySdk } from '../api';
import { toCamel } from './case';
import { decodeSubscriptionDetails } from './subscription-details';

export function decodeProduct(
  product: AdaptySdk['Output.AdaptyPaywallProduct'],
): AdaptyPaywallProduct {
  const { is_family_shareable, ...rest } = product;

  return {
    ...toCamel(rest),
    subscriptionDetails: decodeSubscriptionDetails(
      product.subscription_details,
    ),
    ios: {
      isFamilyShareable: is_family_shareable || false,
    },
  };
}

export function encodeProduct(
  product: AdaptyPaywallProduct,
): AdaptySdk['Input.AdaptyPaywallProduct'] {
  return {
    adapty_product_id: product.adaptyProductId,
    paywall_ab_test_name: product.paywallAbTestName,
    payload_data: product.payloadData,
    paywall_name: product.paywallName,
    paywall_variation_id: product.paywallVariationId,
    promotional_offer_id:
      product.subscriptionDetails?.ios?.promotionalOffer?.ios?.identifier,
    vendor_product_id: product.vendorProductId,
  };
}
