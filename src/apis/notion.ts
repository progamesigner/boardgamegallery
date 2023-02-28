import type { APIResponse as ImageResponse } from '~/routes/notion/v1/blocks/[id]/children/image'
import type { APIResponse as QueryResponse } from '~/routes/notion/v1/databases/[id]/query/games'
import type { GameObject } from '~/types'

import { getGameImages } from './boardgamegeek'

interface State {
  cursor: string | undefined
  items: Array<GameObject>
}

async function getContentImge(blockId: string): Promise<ImageResponse> {
  const response = await fetch(`/notion/v1/blocks/${blockId}/children/image`)
  if (!response.ok) {
    throw new Error('Failed to fetch game cover')
  }
  return await response.json()
}

function makeURL(databaseId: string, cursor?: string): string {
  if (cursor) {
    return `/notion/v1/databases/${databaseId}/query/games?cursor=${cursor}`
  }
  return `/notion/v1/databases/${databaseId}/query/games`
}

export default async function (databaseId: string): Promise<Array<GameObject>> {
  const state: State = {
    cursor: undefined,
    items: [],
  }

  do {
    const response = await fetch(makeURL(databaseId, state.cursor))
    if (!response.ok) {
      throw new Error('Failed to fetch games')
    }

    const query: QueryResponse = await response.json()
    const items = query.data.map(item => {
      return {
        ...item,
        imageLoader: async () => {
          if (item.imageLoader) {
            const previous = await Promise.resolve(item.imageLoader())
            if (previous) {
              return previous
            }
          }
          return await getContentImge(item.id)
        },
      }
    })

    state.items.push(...items)
    state.cursor = query.cursor ?? undefined
  } while (state.cursor)

  return getGameImages(state.items)
}
