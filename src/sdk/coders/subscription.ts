import type { AdaptySdk } from '../api';
import type {
  AdaptySubscription,
  CancellationReason,
  OfferType,
  VendorStore,
} from '../cdk';
import { decodeDate } from './date';
import { toCamel } from './case';

export function decodeSubscription(
  subscription: AdaptySdk['Output.AdaptySubscription'],
): AdaptySubscription {
  const {
    activated_at,
    active_introductory_offer_type,
    active_promotional_offer_type,
    billing_issue_detected_at,
    cancellation_reason,
    expires_at,
    renewed_at,
    store,
    starts_at,
    unsubscribed_at,
    ...rest
  } = subscription;

  return {
    ...toCamel(rest),
    activatedAt: decodeDate(activated_at)!,
    activeIntroductoryOfferType: active_introductory_offer_type as OfferType,
    activePromotionalOfferType: active_promotional_offer_type as OfferType,
    billingIssueDetectedAt: decodeDate(billing_issue_detected_at),
    cancellationReason: cancellation_reason as CancellationReason,
    expiresAt: decodeDate(expires_at)!,
    renewedAt: decodeDate(renewed_at),
    startsAt: decodeDate(starts_at)!,
    store: store as VendorStore,
    unsubscribedAt: decodeDate(unsubscribed_at),
  };
}
