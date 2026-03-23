import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOST = "s.asiaimport.com.br";
const CACHE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function GET(req: NextRequest) {
  const encoded = req.nextUrl.searchParams.get("s");
  if (!encoded) {
    return new NextResponse("Missing parameter", { status: 400 });
  }

  let url: string;
  try {
    url = Buffer.from(encoded, "base64url").toString("utf-8");
  } catch {
    return new NextResponse("Invalid parameter", { status: 400 });
  }

  // Validate the decoded URL points to the allowed host
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  if (parsed.hostname !== ALLOWED_HOST) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "image/*",
      },
    });

    if (!upstream.ok) {
      return new NextResponse("Image not found", { status: upstream.status });
    }

    const contentType =
      upstream.headers.get("content-type") || "image/jpeg";
    const body = await upstream.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, immutable`,
        "CDN-Cache-Control": `public, max-age=${CACHE_MAX_AGE}`,
      },
    });
  } catch {
    return new NextResponse("Upstream error", { status: 502 });
  }
}
