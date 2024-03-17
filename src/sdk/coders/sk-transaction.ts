import type { AdaptySdk } from '../api';
import type { SKPaymentTransaction } from '../cdk';
import { toCamel } from './case';
import { decodeSKPayment } from './sk-payment';

export function decodeSKTransaction(
  transaction: AdaptySdk['Output.SKPaymentTransaction'],
): SKPaymentTransaction {
  const { payment, original, ...rest } = transaction;
  return {
    ...toCamel(rest),
    payment: decodeSKPayment(payment),
    original: original ? decodeSKTransaction(original) : undefined,
  };
}
