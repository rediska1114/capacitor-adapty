import type { AdaptySdk } from '../api';
import type { AdaptyProfile } from '../cdk';
import { decodeAccessLevel } from './access-level';
import { decodeNonSubscription } from './non-subscription';
import { decodeRecords } from './records';
import { decodeSubscription } from './subscription';
import { toCamel } from './case';

export function decodeProfile(
  profile: AdaptySdk['Output.AdaptyProfile'],
): AdaptyProfile {
  const {
    paid_access_levels,
    custom_attributes,
    non_subscriptions,
    subscriptions,
    ...rest
  } = profile;

  return {
    ...toCamel(rest),
    accessLevels: paid_access_levels
      ? decodeRecords(
          paid_access_levels as Record<
            string,
            AdaptySdk['Output.AdaptyAccessLevel']
          >,
          decodeAccessLevel,
        )
      : undefined,
    customAttributes: custom_attributes,
    nonSubscriptions: non_subscriptions
      ? decodeRecords(
          non_subscriptions as Record<
            string,
            AdaptySdk['Output.AdaptyNonSubscription'][]
          >,
          value => value.map(decodeNonSubscription),
        )
      : non_subscriptions,
    subscriptions: subscriptions
      ? decodeRecords(
          subscriptions as Record<
            string,
            AdaptySdk['Output.AdaptySubscription']
          >,
          decodeSubscription,
        )
      : undefined,
  };
}
