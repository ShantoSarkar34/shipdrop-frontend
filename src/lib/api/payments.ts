import { api } from "./http";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface Payment {
  status: PaymentStatus;
  amount: number;
  currency: string;
}

export interface CheckoutSession {
  checkoutUrl: string;
  paymentId: string;
}

export async function fetchPayment(
  parcelId: string,
  signal?: AbortSignal,
): Promise<Payment> {
  return (
    await api.get<Payment>(`/payments/${encodeURIComponent(parcelId)}`, {
      signal,
    })
  ).data;
}

export async function createCheckout(
  parcelId: string,
): Promise<CheckoutSession> {
  return (
    await api.post<CheckoutSession>(
      `/payments/${encodeURIComponent(parcelId)}/checkout`,
    )
  ).data;
}

/** The browser is only sent to https pages on stripe.com. */
// export function isStripeCheckoutUrl(value: string): boolean {
//   try {
//     const url = new URL(value);
//     return (
//       url.protocol === "https:" &&
//       (url.hostname === "stripe.com" || url.hostname.endsWith(".stripe.com"))
//     );
//   } catch {
//     return false;
//   }
// }
// Only `status` and `amount` are confirmed by the API collection. The rest are shown when present.
export interface PaymentSummary {
  status: PaymentStatus;
  amount: number;
  currency?: string;
  id?: string;
  parcelId?: string;
  createdAt?: string;
}

export type PaymentListParams = { page?: number; limit?: number };

export function fetchPayments(params: PaymentListParams = {}, signal?: AbortSignal) {
  return api.get<PaymentSummary[]>("/payments", { query: params, signal });
}