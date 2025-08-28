// /functions/api/vincolorlookup.ts
export async function onRequestGet({
  request,
  env,
}: {
  request: Request;
  env: any;
}) {
  const url = new URL(request.url);
  const vin = (url.searchParams.get("vin") || "").trim().toUpperCase();
  const brand = (url.searchParams.get("brand") || "").trim();

  if (!env.COLOR_API_KEY) {
    return new Response(JSON.stringify({ error: "COLOR_API_KEY missing" }), {
      status: 500,
    });
  }
  if (!vin || !brand) {
    return new Response(JSON.stringify({ error: "Missing vin or brand" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const upstream = new URL(
    "https://snaponcolorfetch.azurewebsites.net/api/vincolorlookup"
  );
  upstream.searchParams.set("code", env.COLOR_API_KEY);
  upstream.searchParams.set("vin", vin);
  upstream.searchParams.set("brand", brand);

  const r = await fetch(upstream.toString(), {
    headers: { Accept: "application/json" },
  });
  const body = await r.text();

  return new Response(body, {
    status: r.status,
    headers: {
      "Content-Type": r.headers.get("content-type") ?? "application/json",
      "Cache-Control": "no-store",
    },
  });
}
