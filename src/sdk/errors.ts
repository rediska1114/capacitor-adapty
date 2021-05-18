export const AdaptyErrors = {
  //  'sdkNotActive'
  none: -1,

  // StoreKit codes
  unknown: 0,
  clientInvalid: 1, // client is not allowed to issue the request, etc.
  paymentCancelled: 2, // user cancelled the request, etc.
  paymentInvalid: 3, // purchase identifier was invalid, etc.
  paymentNotAllowed: 4, // this device is not allowed to make the payment
  storeProductNotAvailable: 5, // Product is not available in the current storefront
  cloudServicePermissionDenied: 6, // user has not allowed access to cloud service information
  cloudServiceNetworkConnectionFailed: 7, // the device could not connect to the nework
  cloudServiceRevoked: 8, // user has revoked permission to use this cloud service
  privacyAcknowledgementRequired: 9, // The user needs to acknowledge Apple's privacy policy
  unauthorizedRequestData: 10, // The app is attempting to use SKPayment's requestData property, but does not have the appropriate entitlement
  invalidOfferIdentifier: 11, // The specified subscription offer identifier is not valid
  invalidSignature: 12, // The cryptographic signature provided is not valid
  missingOfferParams: 13, // One or more parameters from SKPaymentDiscount is missing
  invalidOfferPrice: 14,

  // Custom StoreKit codes
  noProductIDsFound: 1000, // No In-App Purchase product identifiers were found
  noProductsFound: 1001, // No In-App Purchases were found
  productRequestFailed: 1002, // Unable to fetch available In-App Purchase products at the moment
  cantMakePayments: 1003, // In-App Purchases are not allowed on this device
  noPurchasesToRestore: 1004, // No purchases to restore
  cantReadReceipt: 1005, // Can't find a valid receipt
  productPurchaseFailed: 1006, // Product purchase failed
  missingOfferSigningParams: 1007, // Missing offer signing required params
  fallbackPaywallsNotRequired: 1008, // Fallback paywalls are not required

  // Custom network codes
  emptyResponse: 2000, //Response is empty
  emptyData: 2001, // Request data is empty
  authenticationError: 2002, // You need to be authenticated first
  badRequest: 2003, // Bad request
  outdated: 2004, // The url you requested is outdated
  failed: 2006, // Network request failed
  //   unableToDecode // We could not decode the response
  missingParam: 2007, // Missing some of the required params

  invalidProperty: 2008, // Received invalid property data
  encodingFailed: 2009, // Parameters encoding failed
  missingURL: 2010, // Request url is nil
};
