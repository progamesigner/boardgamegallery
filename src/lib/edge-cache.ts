// Caches successful responses in the Cloudflare Workers Cache API so repeated
// visits skip the Notion round trips and the response processing. Notion file
// URLs expire after an hour, so keep the TTL well below that.

const EDGE_TTL_SECONDS = 300;
const BROWSER_TTL_SECONDS = 60;

interface WorkersCacheStorage {
  default: Cache;
}

function getEdgeCache(): Cache | undefined {
  const storage = (globalThis as { caches?: Partial<WorkersCacheStorage> })
    .caches;
  return storage?.default;
}

export async function withEdgeCache(
  request: Request,
  handler: () => Promise<Response>,
): Promise<Response> {
  const cache = getEdgeCache();
  const key = new Request(request.url, { method: 'GET' });

  if (cache) {
    const cached = await cache.match(key);
    if (cached) {
      return cached;
    }
  }

  const response = await handler();
  if (response.status !== 200) {
    return response;
  }

  response.headers.set(
    'Cache-Control',
    `public, max-age=${BROWSER_TTL_SECONDS}, s-maxage=${EDGE_TTL_SECONDS}`,
  );
  if (cache) {
    await cache.put(key, response.clone());
  }
  return response;
}
