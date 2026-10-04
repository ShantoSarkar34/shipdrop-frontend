/** The browser is only ever sent to https pages on stripe.com. */
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
