const DEFAULT_TIMEOUT = 10000;

 export async function request(path, { method = "GET", body, timeout = DEFAULT_TIMEOUT } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
        const res = await fetch(path, {
            method,
            headers: {"Accept": "application/json",
                "Content-Type": "application/json"
             },
             body: body ? JSON.stringify(body) : undefined,
             signal: controller.signal
        });

        if (!res.ok) {
            throw new Error(` HTTP ${res.status} ${res.statusText}`);
        }
        const text = await res.text();
        return text ? JSON.parse(text) : null;

    } finally {
        clearTimeout(timer);
    }
}
