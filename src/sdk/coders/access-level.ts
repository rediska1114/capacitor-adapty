import type { AdaptySdk } from '../api';
import type {
  AdaptyAccessLevel,
  CancellationReason,
  OfferType,
  VendorStore,
} from '../cdk';
import { decodeDate } from './date';
import { toCamel } from './case';

export function decodeAccessLevel(
  accessLevel: AdaptySdk['Output.AdaptyAccessLevel'],
): AdaptyAccessLevel {
  const {
    activated_at,
    billing_issue_detected_at,
    expires_at,
    renewed_at,
    starts_at,
    unsubscribed_at,
    store,
    active_introductory_offer_type,
    active_promotional_offer_type,
    cancellation_reason,
    ...rest
  } = accessLevel;

  return {
    ...toCamel(rest),
    activatedAt: decodeDate(activated_at)!,
    billingIssueDetectedAt: decodeDate(billing_issue_detected_at),
    expiresAt: decodeDate(expires_at)!,
    renewedAt: decodeDate(renewed_at),
    startsAt: decodeDate(starts_at)!,
    unsubscribedAt: decodeDate(unsubscribed_at),
    store: store as VendorStore,
    activeIntroductoryOfferType: active_introductory_offer_type as OfferType,
    activePromotionalOfferType: active_promotional_offer_type as OfferType,
    cancellationReason: cancellation_reason as CancellationReason,
  };
}
