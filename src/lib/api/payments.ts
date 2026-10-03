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
export function isStripeCheckoutUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === "stripe.com" || url.hostname.endsWith(".stripe.com"))
    );
  } catch {
    return false;
  }
}
