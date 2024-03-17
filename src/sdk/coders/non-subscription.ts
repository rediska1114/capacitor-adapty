import type { AdaptySdk } from '../api';
import type { AdaptyNonSubscription, VendorStore } from '../cdk';
import { decodeDate } from './date';
import { toCamel } from './case';

export function decodeNonSubscription(
  nonSubscription: AdaptySdk['Output.AdaptyNonSubscription'],
): AdaptyNonSubscription {
  const { purchased_at, store, ...rest } = nonSubscription;

  return {
    ...toCamel(rest),
    purchasedAt: decodeDate(purchased_at)!,
    store: store as VendorStore,
  };
}
