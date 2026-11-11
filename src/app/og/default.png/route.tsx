import { ImageResponse } from "next/og";
export const dynamic = "force-static";
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#2F2F2F",
          color: "#F5F2E9",
          padding: "72px",
          borderBottom: "16px solid #F5DB30",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#F5DB30",
            letterSpacing: 5,
          }}
        >
          COFFEE · TRAINING · CONSULTING
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 88, fontWeight: 700 }}>Goat Journey</div>
          <div style={{ fontSize: 44 }}>Wael Irzeqat</div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            justifyContent: "space-between",
          }}
        >
          <span>Palestine</span>
          <span>goatjourney.online</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
