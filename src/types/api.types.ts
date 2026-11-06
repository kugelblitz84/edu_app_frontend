export interface PageDto<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UploadIntentDto {
  uploadUrl: string;
  fileId: string;
  method: 'PUT' | 'POST';
  fields?: Record<string, string>;
  requiredHeaders?: Record<string, string>;
}

export type AccessDecisionReason =
  | 'GRANTED'
  | 'PIN_REQUIRED'
  | 'AUTH_REQUIRED'
  | 'ENROLLMENT_REQUIRED'
  | 'PURCHASE_REQUIRED';

export interface AccessDecisionDto {
  canAccess: boolean;
  reason: AccessDecisionReason;
  message?: string;
  requiredPin?: boolean;
  priceAmountMinor?: number | null;
  currency?: string | null;
  institutionId?: string | null;
}

export interface PaymentSessionDto {
  sessionId: string;
  checkoutUrl: string;
  amountMinor: number;
  currency: string;
  itemTitle: string;
}

