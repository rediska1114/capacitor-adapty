import type { AdaptySdk } from '../api';
import type { AdaptySubscriptionDetails } from '../cdk';
import { decodeDiscountPhase } from './discount-phase';
import { toCamel } from './case';

export function decodeSubscriptionDetails(
  subscriptionDetails: AdaptySdk['Output.AdaptyPaywallProduct']['subscription_details'],
): AdaptySubscriptionDetails | undefined {
  if (!subscriptionDetails) return undefined;

  const {
    introductory_offer_phases,
    promotional_offer,
    subscription_group_identifier,
    android_base_plan_id,
    android_offer_id,
    android_offer_tags,
    introductory_offer_eligibility,
    renewal_type,
    ...rest
  } = subscriptionDetails;

  return {
    ...toCamel(rest),
    introductoryOffers:
      subscriptionDetails.introductory_offer_phases?.map(decodeDiscountPhase),
    ios: {
      promotionalOffer: promotional_offer
        ? decodeDiscountPhase(promotional_offer)
        : undefined,
      subscriptionGroupIdentifier: subscription_group_identifier,
    },
    android: {
      basePlanId: android_base_plan_id,
      offerId: android_offer_id,
      offerTags: android_offer_tags,
      renewalType: renewal_type,
      introductoryOfferEligibility: introductory_offer_eligibility,
    },
  };
}
