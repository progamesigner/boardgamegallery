import type { GameObject } from '~/types'

import { default as fetchGoogleSheetStore } from './googlesheet'
import { default as fetchJSONStore } from './json'
import { default as fetchNotionStore } from './notion'

const enum Store {
  GOOGLE_SHEET = 'googlesheet',
  JSON = 'json',
  NOTION = 'notion',
}

export function addImageLoader(
  item: GameObject,
  next: () => Promise<string | null>
): () => Promise<string | null> {
  if (item.imageLoader) {
    const previousLoader = item.imageLoader
    return async function (): Promise<string | null> {
      const previousValue = await Promise.resolve(previousLoader())
      if (previousValue) {
        return previousValue
      }

      return await next()
    }
  }

  return next
}

export async function fetchGames(source: string): Promise<Array<GameObject>> {
  const params = source.split(':')
  const store = params.shift()
  if (!store) {
    throw new Error('No data store specified')
  }

  switch (store.toLowerCase()) {
    case Store.GOOGLE_SHEET: {
      const [sheetId] = params
      return await fetchGoogleSheetStore(sheetId)
    }
    case Store.JSON: {
      const url = params.join(':')
      return await fetchJSONStore(url)
    }
    case Store.NOTION: {
      const [databaseId] = params
      return await fetchNotionStore(databaseId)
    }
    default:
      throw new Error('Unsupported data store')
  }
}
