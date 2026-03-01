const DEFAULT_TIMEOUT = 10000;

export async function request(
  url,
  { method = "GET", body, timeout = DEFAULT_TIMEOUT, headers = {} } = {}
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const finalHeaders = {
    Accept: "application/json",
    ...headers,
  };

  const hasBody = body !== undefined && body !== null;
  if (hasBody) finalHeaders["Content-Type"] = "application/json";

  try {
    const res = await fetch(url, {
      method,
      headers: finalHeaders,
      body: hasBody ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const text = await res.text();

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
    }

    return text ? JSON.parse(text) : null;
  } finally {
    clearTimeout(timer);
  }
}
