import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Catálogo de Produtos - Hamecon";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const categories = [
  { name: "Canetas e Escrita", count: "94" },
  { name: "Mochilas e Bolsas", count: "88" },
  { name: "Cadernos e Blocos", count: "87" },
  { name: "Garrafas e Copos", count: "74" },
  { name: "Chaveiros", count: "19" },
  { name: "Canecas", count: "18" },
];

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "white",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Left - Green sidebar */}
        <div
          style={{
            width: "420px",
            height: "100%",
            background: "#1e4c36",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 50px",
            gap: "16px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.08,
              background:
                "radial-gradient(circle at 30% 40%, white 0%, transparent 60%)",
            }}
          />

          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "white",
              letterSpacing: "2px",
              opacity: 0.7,
            }}
          >
            HAMECON
          </span>

          <div
            style={{
              fontSize: "44px",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.15,
              letterSpacing: "-1px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Catálogo de</span>
            <span style={{ color: "#6ee7b7" }}>Produtos</span>
          </div>

          <p
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.5,
            }}
          >
            433+ produtos com personalização inclusa
          </p>

          {/* Price badge */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "6px",
              marginTop: "8px",
            }}
          >
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
              a partir de
            </span>
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#6ee7b7" }}>
              R$ 1,92
            </span>
            <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)" }}>
              /un
            </span>
          </div>

          <span
            style={{
              position: "absolute",
              bottom: "24px",
              left: "50px",
              fontSize: "14px",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            hamecon.com.br/catalogo
          </span>
        </div>

        {/* Right - Categories grid */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "50px 50px",
            gap: "16px",
            background: "#f9fafb",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#9ca3af",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Categorias
          </span>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {categories.map((cat) => (
              <div
                key={cat.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "white",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <span
                  style={{ fontSize: "18px", fontWeight: 600, color: "#111827" }}
                >
                  {cat.name}
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1e4c36",
                    background: "#ecfdf5",
                    padding: "4px 12px",
                    borderRadius: "20px",
                  }}
                >
                  {cat.count} itens
                </span>
              </div>
            ))}
          </div>

          <span style={{ fontSize: "14px", color: "#9ca3af", marginTop: "4px" }}>
            + Kits, Diversos, Eletrônicos e mais
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
