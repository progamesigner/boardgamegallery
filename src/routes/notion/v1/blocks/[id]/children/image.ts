import type { ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints'
import type { APIEvent } from 'solid-start'

import { json } from 'solid-start'

export type APIResponse = string | null

async function handle(blockId: string): Promise<APIResponse> {
  const response = await fetch(`https://api.notion.com/v1/blocks/${blockId}/children`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
      Authorization: `Bearer ${process.env.SERVER_NOTION_TOKEN}`,
    },
  })
  const items: ListBlockChildrenResponse = await response.json()

  return items.results.reduce<string | null>((url, block) => {
    if (!url && 'type' in block) {
      switch (block.type) {
        case 'file':
          switch (block.file.type) {
            case 'file':
              return block.file.file.url
            case 'external':
              return block.file.external.url
            default:
              return url
          }
        case 'image':
          switch (block.image.type) {
            case 'file':
              return block.image.file.url
            case 'external':
              return block.image.external.url
            default:
              return url
          }
        default:
          return url
      }
    }
    return url
  }, null)
}

export async function GET({ params }: APIEvent): Promise<Response> {
  if (!process.env.SERVER_ENABLE_NOTION_QUERY) {
    return new Response(null, { status: 404 })
  }

  if (!process.env.SERVER_NOTION_TOKEN) {
    return new Response(null, { status: 403 })
  }

  try {
    return json(await handle(params.id))
  } catch (error) {
    console.error(error)
    return json(error)
  }
}
