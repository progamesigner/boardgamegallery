import type { APIEvent } from 'solid-start'

import { Client } from '@notionhq/client'
import { json } from 'solid-start'

export type APIResponse = string | null

const client = new Client({
  auth: process.env.SERVER_NOTION_TOKEN,
})

async function handle(blockId: string): Promise<APIResponse> {
  const data = await client.blocks.children.list({
    block_id: blockId,
  })

  return data.results.reduce<string | null>((url, block) => {
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
    return json(error)
  }
}
