// Returns the phone number only on demand so it never appears in page markup.
// Set CONTACT_PHONE in .env.local (and in your hosting provider's env settings).
export async function GET(request: Request) {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") {
    return new Response(null, { status: 403 });
  }

  const phone = process.env.CONTACT_PHONE;
  if (!phone) return new Response(null, { status: 404 });

  return Response.json({ phone }, { headers: { "Cache-Control": "no-store" } });
}
