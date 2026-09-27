import type { Config, Context } from "@netlify/edge-functions";

// Private access: every request needs the login set in the site's
// environment variables (Netlify → Project configuration → Environment
// variables):
//
//   DEVIS_PASSWORD   required — without it the site stays closed
//   DEVIS_USER       optional — defaults to "studio"
//
// The credentials never live in this repository.

const REALM = 'Basic realm="Devis Studio VM", charset="UTF-8"';

// Constant-time comparison, so response timing reveals nothing.
const same = (a: string, b: string): boolean => {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
};

const decode = (encoded: string): string | null => {
  try {
    const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
};

export default async (request: Request, context: Context) => {
  const password = Netlify.env.get("DEVIS_PASSWORD");
  if (!password) {
    return new Response("Accès fermé : définissez DEVIS_PASSWORD dans les variables d’environnement Netlify, puis redéployez.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  const user = Netlify.env.get("DEVIS_USER") || "studio";

  const [scheme, encoded] = (request.headers.get("authorization") ?? "").split(" ");
  if (scheme === "Basic" && encoded) {
    const credentials = decode(encoded);
    const colon = credentials?.indexOf(":") ?? -1;
    if (credentials && colon >= 0 && same(credentials.slice(0, colon), user) && same(credentials.slice(colon + 1), password)) {
      return context.next();
    }
  }

  return new Response("Authentification requise.", {
    status: 401,
    headers: {
      "WWW-Authenticate": REALM,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
};

export const config: Config = { path: "/*" };
