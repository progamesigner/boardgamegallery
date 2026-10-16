import type { ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints';
import type { APIEvent } from '@solidjs/start/server';
import { withEdgeCache } from '~/lib/edge-cache';

export type APIResponse = string | null;

async function handle(blockId: string): Promise<APIResponse> {
  const response = await fetch(
    `https://api.notion.com/v1/blocks/${encodeURIComponent(blockId)}/children`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Notion-Version': '2025-09-03',
        Authorization: `Bearer ${process.env.SERVER_NOTION_TOKEN}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error('Failed to retrieve Notion block children');
  }
  const items: ListBlockChildrenResponse = await response.json();

  return items.results.reduce<string | null>((url, block) => {
    if (!url && 'type' in block) {
      switch (block.type) {
        case 'file':
          switch (block.file.type) {
            case 'file':
              return block.file.file.url;
            case 'external':
              return block.file.external.url;
            default:
              return url;
          }
        case 'image':
          switch (block.image.type) {
            case 'file':
              return block.image.file.url;
            case 'external':
              return block.image.external.url;
            default:
              return url;
          }
        default:
          return url;
      }
    }
    return url;
  }, null);
}

export async function GET({ params, request }: APIEvent): Promise<Response> {
  if (!process.env.SERVER_ENABLE_NOTION_QUERY) {
    return new Response(null, { status: 404 });
  }

  if (!process.env.SERVER_NOTION_TOKEN) {
    return new Response(null, { status: 403 });
  }

  return withEdgeCache(request, async () => {
    try {
      const response = await handle(params.id);
      return new Response(JSON.stringify(response));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Notion request failed';
      return Response.json({ error: message }, { status: 502 });
    }
  });
}
