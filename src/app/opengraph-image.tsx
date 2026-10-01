import { ImageResponse } from "next/og";

export const alt = "SwiftDrop — courier & logistics management";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0b1020",
        color: "#ffffff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            fontWeight: 800,
          }}
        >
          S
        </div>
        <div style={{ fontSize: 40, fontWeight: 800 }}>SwiftDrop</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Courier delivery you can follow from pickup to doorstep.
        </div>
        <div style={{ fontSize: 30, color: "rgba(255,255,255,0.7)" }}>
          Book. Pay securely. Track every step.
        </div>
      </div>
    </div>,
    size,
  );
}
