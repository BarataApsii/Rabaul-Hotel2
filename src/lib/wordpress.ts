const WP_BASE = process.env.WP_BASE || "http://localhost/rabaul-hotel-cms";

export function wpUrl(path = "/") {
  return `${WP_BASE.replace(/\/$/, "")}${path}`;
}

export async function fetchWp(path: string) {
  const url = wpUrl(`/wp-json/wp/v2${path}`);
  const res = await fetch(url, { next: { revalidate: 10 } });
  if (!res.ok) throw new Error(`WP fetch failed: ${res.status} ${res.statusText}`);
  return res.json();
}
