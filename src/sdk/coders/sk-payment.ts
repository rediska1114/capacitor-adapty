import type { AdaptySdk } from '../api';
import type { SKPayment } from '../cdk';
import { toCamel } from './case';

export function decodeSKPayment(
  payment: AdaptySdk['Output.SKPayment'],
): SKPayment {
  return toCamel(payment);
}
