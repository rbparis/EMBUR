export const EMBUR_INTERNAL_BUSINESS_ID = "business-embur-demo";
export const EMBUR_FOUNDER_USER_ID = "user-mike-owner";

export function isEmburInternalBusiness(businessId: string) {
  return businessId === EMBUR_INTERNAL_BUSINESS_ID;
}
