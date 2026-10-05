import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { company } from "@/lib/site";

export const alt = `${company.name} — ${company.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/images/logo.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 80px",
          background: "linear-gradient(135deg,#04122e 0%,#082252 55%,#183771 100%)",
          color: "#fff",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: -120, top: -120, width: 520, height: 520, borderRadius: 520, background: "rgba(181,12,26,0.35)", filter: "blur(80px)" }} />
        <img src={src} width={300} height={300} alt="" style={{ borderRadius: 300, background: "#fff" }} />
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 64 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: 2 }}>{company.name.toUpperCase()}</div>
          <div style={{ marginTop: 18, fontSize: 23, letterSpacing: 3, color: "#b9cdeb" }}>{company.tagline.toUpperCase().replace(/\|/g, "·")}</div>
          <div style={{ marginTop: 40, height: 4, width: 120, background: "#d11a2a" }} />
          <div style={{ marginTop: 32, fontSize: 30, color: "#dce6f5" }}>Rupandehi · Kapilvastu · Nawalparasi · Dang</div>
          <div style={{ marginTop: 14, fontSize: 36, fontWeight: 700, color: "#f28b95" }}>{company.phoneDisplay}</div>
        </div>
      </div>
    ),
    size,
  );
}
