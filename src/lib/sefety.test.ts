import { describe, expect, it } from "vitest";
import { summarizeMetadata } from "./audit";
import { resolvePostLoginPath } from "./auth/redirect";
import { isStripeCheckoutUrl } from "./stripe-url";

describe("resolvePostLoginPath", () => {
  it("falls back to the role's home when there is no usable destination", () => {
    expect(resolvePostLoginPath(null, "CUSTOMER")).toBe("/dashboard");
    expect(resolvePostLoginPath("", "ADMIN")).toBe("/admin");
  });

  it("honors a destination inside the user's own area", () => {
    expect(resolvePostLoginPath("/dashboard/shipments", "CUSTOMER")).toBe(
      "/dashboard/shipments",
    );
    expect(resolvePostLoginPath("/provider", "DELIVERY_AGENT")).toBe(
      "/provider",
    );
  });

  it("refuses other areas and look-alike paths", () => {
    expect(resolvePostLoginPath("/admin", "CUSTOMER")).toBe("/dashboard");
    expect(resolvePostLoginPath("/dashboardx", "CUSTOMER")).toBe("/dashboard");
  });

  it("refuses external destinations", () => {
    expect(resolvePostLoginPath("//evil.example", "CUSTOMER")).toBe(
      "/dashboard",
    );
    expect(resolvePostLoginPath("https://evil.example", "CUSTOMER")).toBe(
      "/dashboard",
    );
  });
});

describe("isStripeCheckoutUrl", () => {
  it("accepts https Stripe pages", () => {
    expect(
      isStripeCheckoutUrl("https://checkout.stripe.com/c/pay/cs_test_123"),
    ).toBe(true);
  });

  it("rejects anything else", () => {
    expect(
      isStripeCheckoutUrl("http://checkout.stripe.com/c/pay/cs_test_123"),
    ).toBe(false);
    expect(isStripeCheckoutUrl("https://stripe.com.evil.example/pay")).toBe(
      false,
    );
    expect(
      isStripeCheckoutUrl(
        "https://evil.example/?u=https://checkout.stripe.com",
      ),
    ).toBe(false);
    expect(isStripeCheckoutUrl("javascript:alert(1)")).toBe(false);
    expect(isStripeCheckoutUrl("not a url")).toBe(false);
  });
});

describe("summarizeMetadata", () => {
  it("shows the first few fields and keeps the rest separate", () => {
    const { shown, rest } = summarizeMetadata({
      a: 1,
      b: "two",
      c: true,
      d: "four",
    });
    expect(shown).toEqual([
      ["a", "1"],
      ["b", "two"],
      ["c", "true"],
    ]);
    expect(rest).toEqual([["d", "four"]]);
  });

  it("clips long values and flattens nested objects instead of dumping them", () => {
    const { shown } = summarizeMetadata({
      note: "x".repeat(200),
      nested: { deep: { value: 1 } },
    });
    expect(shown[0][1].endsWith("…")).toBe(true);
    expect(shown[0][1].length).toBeLessThan(100);
    expect(shown[1][1]).toBe('{"deep":{"value":1}}');
  });

  it("returns nothing for missing or non-object metadata", () => {
    expect(summarizeMetadata(null)).toEqual({ shown: [], rest: [] });
    expect(summarizeMetadata("text")).toEqual({ shown: [], rest: [] });
    expect(summarizeMetadata([1, 2])).toEqual({ shown: [], rest: [] });
  });
});
