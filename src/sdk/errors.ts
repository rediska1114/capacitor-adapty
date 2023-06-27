export const AdaptyErrors = {
  /**
   * System StoreKit codes
   */
  unknown: 0,
  /**
   * Client is not allowed to make a request, etc.
   */
  clientInvalid: 1,
  /**
   * User cancelled the request, etc.
   */
  paymentCancelled: 2,
  /**
   * Invalid purchase identifier, etc.
   */
  paymentInvalid: 3,
  /**
   * This device is not allowed to make the payment.
   */
  paymentNotAllowed: 4,
  /**
   * Product is not available in the current storefront.
   */
  storeProductNotAvailable: 5,

  /**
   * User has not allowed access to cloud service information.
   */
  cloudServicePermissionDenied: 6,

  /**
   * The device could not connect to the network.
   */
  cloudServiceNetworkConnectionFailed: 7,

  /**
   * User has revoked permission to use this cloud service.
   */
  cloudServiceRevoked: 8,

  /**
   * The user needs to acknowledge Apple's privacy policy.
   */
  privacyAcknowledgementRequired: 9,

  /**
   * The app is attempting to use SKPayment's requestData property,
   * but does not have the appropriate entitlement.
   */
  unauthorizedRequestData: 10,

  /**
   * The specified subscription offer identifier is not valid.
   */
  invalidOfferIdentifier: 11,

  /**
   * The cryptographic signature provided is not valid.
   */
  invalidSignature: 12,

  /**
   * One or more parameters from SKPaymentDiscount is missing.
   */
  missingOfferParams: 13,

  invalidOfferPrice: 14,

  noProductIDsFound: 1000,
  productRequestFailed: 1002,

  /**
   * In-App Purchases are not allowed on this device.
   */
  cantMakePayments: 1003,
  noPurchasesToRestore: 1004,
  cantReadReceipt: 1005,
  productPurchaseFailed: 1006,
  refreshReceiptFailed: 1010,
  receiveRestoredTransactionsFailed: 1011,

  /**
   * Adapty SDK is not activated.
   */
  notActivated: 2002,
  badRequest: 2003,
  serverError: 2004,
  networkFailed: 2005,
  decodingFailed: 2006,
  encodingFailed: 2009,

  analyticsDisabled: 3000,
  /**
   * Wrong parameter was passed.
   */
  wrongParam: 3001,
  /**
   * It is not possible to call `.activate` method more than once.
   */
  activateOnceError: 3005,
  /**
   * The user profile was changed during the operation.
   */
  profileWasChanged: 3006,
  persistingDataError: 3100,
  operationInterrupted: 9000,
};

type ErrorType = typeof AdaptyErrors;

export type AdaptyError = {
  message: string;
  code: ErrorType[keyof ErrorType];
  errorMessage: string;
};

export function isAdaptyError(error: unknown): error is AdaptyError {
  return (
    typeof error === 'object' &&
    'code' in (error as AdaptyError) &&
    'message' in (error as AdaptyError)
  );
}
