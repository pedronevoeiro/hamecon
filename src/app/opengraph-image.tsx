import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hamecon - Brindes Corporativos Personalizados";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const products = [
  "Canecas",
  "Camisetas",
  "Cadernos",
  "Canetas",
  "Mochilas",
  "Garrafas",
  "Ecobags",
  "Chaveiros",
];

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#1e4c36",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.08,
            background:
              "radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 40%)",
          }}
        />

        {/* Left content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 70px",
            flex: 1,
            gap: "8px",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "20px",
              padding: "6px 16px",
              fontSize: "16px",
              color: "white",
              alignSelf: "flex-start",
              marginBottom: "8px",
            }}
          >
            🎁 Brindes que marcam presença
          </div>

          <div
            style={{
              fontSize: "52px",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.15,
              letterSpacing: "-1px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Brindes corporativos</span>
            <span style={{ color: "#6ee7b7" }}>personalizados</span>
            <span>com a sua marca</span>
          </div>

          <p
            style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.75)",
              marginTop: "12px",
              lineHeight: 1.5,
              maxWidth: "500px",
            }}
          >
            Canecas, camisetas, cadernos, mochilas e centenas de opções com o
            logo da sua empresa.
          </p>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "24px",
            }}
          >
            {[
              { value: "500+", label: "Empresas" },
              { value: "50k+", label: "Brindes" },
              { value: "98%", label: "Satisfação" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span
                  style={{ fontSize: "28px", fontWeight: 700, color: "#6ee7b7" }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Product grid */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 50px 60px 0",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            {products.slice(0, 4).map((p) => (
              <div
                key={p}
                style={{
                  width: "105px",
                  height: "105px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 500,
                }}
              >
                {p}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            {products.slice(4, 8).map((p) => (
              <div
                key={p}
                style={{
                  width: "105px",
                  height: "105px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 500,
                }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "70px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "white",
              letterSpacing: "1px",
            }}
          >
            HAMECON
          </span>
          <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
            hamecon.com.br
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
