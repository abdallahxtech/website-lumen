import { NextResponse, type NextRequest } from "next/server";

/**
 * Protects /admin with HTTP Basic auth. If ADMIN_USER / ADMIN_PASSWORD are not
 * set, the admin area is disabled (404). Use a long random password and serve
 * the site over HTTPS only.
 */
export function proxy(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;
  if (!user || !pass) return new NextResponse("Not found", { status: 404 });

  const header = req.headers.get("authorization") ?? "";
  const [scheme, encoded] = header.split(" ");
  if (scheme === "Basic" && encoded) {
    const [u, ...rest] = atob(encoded).split(":");
    const p = rest.join(":");
    if (safeEqual(u, user) && safeEqual(p, pass)) {
      const res = NextResponse.next();
      res.headers.set("x-robots-tag", "noindex, nofollow");
      res.headers.set("cache-control", "no-store");
      return res;
    }
  }
  return new NextResponse("Authentication required", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="Lumen admin"' } });
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export const config = { matcher: ["/admin/:path*"] };
