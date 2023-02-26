import type { APIResponse as ImageResponse } from '~/routes/notion/[id]/get-page-image'
import type { APIResponse as QueryResponse } from '~/routes/notion/[id]/query-database'
import type { Game } from '~/types'

async function getContentImge(blockId: string): Promise<ImageResponse> {
  const response = await fetch(`/notion/${blockId}/get-page-image`)
  if (!response.ok) {
    throw new Error('Failed to fetch game cover')
  }
  return await response.json()
}

function makeURL(databaseId: string, cursor?: string): string {
  if (cursor) {
    return `/notion/${databaseId}/query-database?cursor=${cursor}`
  }
  return `/notion/${databaseId}/query-database`
}

export default async function (databaseId: string): Promise<Array<Game>> {
  const state = {
    cursor: undefined,
    items: [],
  } as {
    cursor: string | undefined
    items: Array<Game>
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
