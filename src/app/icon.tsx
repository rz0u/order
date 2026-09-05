import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 24,
        background: "#080808",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: "rotate(-15deg)",
        color: "#F2F0EF",
        fontFamily: "sans-serif",
        borderRadius: "6px",
      }}
    >
      Oö
    </div>,
    { ...size },
  );
}
