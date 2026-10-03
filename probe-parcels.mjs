const API = "https://shiftdrop-platform-backend.vercel.app/api/v1";

const redact = (v) => {
  if (typeof v === "string" && v.startsWith("eyJ") && v.split(".").length === 3)
    return v.slice(0, 12) + "…";
  if (Array.isArray(v)) return v.map(redact);
  if (v && typeof v === "object")
    return Object.fromEntries(
      Object.entries(v).map(([k, x]) => [k, redact(x)]),
    );
  return v;
};

async function call(label, path, { method = "GET", token, body } = {}) {
  const res = await fetch(API + path, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  console.log(`\n### ${label} -> HTTP ${res.status}`);
  console.log(JSON.stringify(redact(json), null, 2));
  return json;
}

const login = await call("1 login", "/auth/login", {
  method: "POST",
  body: { email: "customer@swiftdrop.com", password: "Test123" },
});
const token = login.data?.accessToken;

const list = await call(
  "2 list shipments",
  "/parcels?limit=3&sortBy=createdAt&sortOrder=desc",
  { token },
);
const firstId = list.data?.[0]?.id;
if (firstId) {
  await call("3 shipment detail", `/parcels/${firstId}`, { token });
  await call("4 payment for that shipment", `/payments/${firstId}`, { token });
}
await call("5 payment history", "/payments?limit=3", { token });
await call(
  "6 list with bad filters",
  "/parcels?status=BAD&sortBy=bad&sortOrder=bad&limit=0",
  { token },
);
await call("7 create with empty body", "/parcels", {
  method: "POST",
  token,
  body: {},
});
await call("8 create with invalid values", "/parcels", {
  method: "POST",
  token,
  body: {
    senderName: "A",
    senderPhone: "1",
    receiverName: "B",
    receiverPhone: "2",
    pickupAddress: "x",
    pickupCity: "Nowhere",
    deliveryAddress: "y",
    deliveryCity: "Nowhere",
    parcelType: "BAD",
    weightKg: -1,
    serviceType: "BAD",
  },
});
