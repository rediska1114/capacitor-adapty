import type { AdaptySdk } from '../api';
import type { AdaptyProfileParameters } from '../cdk';
import { toSnake } from './case';
import { encodeDate } from './date';

type SdkProfileParameters = AdaptySdk['Input.AdaptyProfileParameters'];

export function encodeProfileParameters(
  profile: AdaptyProfileParameters,
): SdkProfileParameters {
  const {
    birthday,
    customAttributes,
    pushwooshHWID,
    appTrackingTransparencyStatus,
    gender,
    ...rest
  } = profile;

  let _params = toSnake(rest);

  let params: SdkProfileParameters = _params;

  type Overrides = Omit<AdaptyProfileParameters, keyof typeof rest>;

  function hasProp(key: keyof Overrides) {
    return Object.prototype.hasOwnProperty.call(profile, key);
  }

  if (hasProp('birthday')) {
    params.birthday = birthday ? encodeDate(birthday) : undefined;
  }
  if (hasProp('gender')) {
    params.gender = gender as AdaptySdk['Input.AdaptyProfileGender'];
  }
  if (hasProp('customAttributes')) {
    params.custom_attributes = customAttributes;
  }
  if (hasProp('appTrackingTransparencyStatus')) {
    params.att_status = appTrackingTransparencyStatus;
  }
  if (hasProp('pushwooshHWID')) {
    params.pushwoosh_hwid = pushwooshHWID;
  }

  return params;
}
