import type { AdaptySdk } from '../api';
import type { AdaptyDiscountPhase, OfferType } from '../cdk';
import { toCamel } from './case';

export function decodeDiscountPhase(
  discountPhase: AdaptySdk['Output.AdaptyDiscountPhase'],
): AdaptyDiscountPhase {
  const { identifier, payment_mode, ...rest } = discountPhase;

  return {
    ...toCamel(rest),
    paymentMode: payment_mode as OfferType,
    ios: {
      identifier,
    },
  };
}
