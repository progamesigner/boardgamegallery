import type { APIResponse as ImageResponse } from '~/routes/notion/v1/blocks/[id]/children/image'
import type { APIResponse as QueryResponse } from '~/routes/notion/v1/databases/[id]/query/games'
import type { Game } from '~/types'

interface State {
  cursor: string | undefined
  items: Array<Game>
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

export default async function (databaseId: string): Promise<Array<Game>> {
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
    const items = await Promise.all(
      query.data.map(async item => {
        if (!item.image) {
          return {
            ...item,
            image: await getContentImge(item.id),
          }
        }
        return item
      })
    )

    state.items.push(...items)
    state.cursor = query.cursor ?? undefined
  } while (state.cursor)

  return state.items
}
