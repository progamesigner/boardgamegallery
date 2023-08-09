import type { GameImageLoader, GameObject } from '~/types'

import { default as fetchGoogleSheetStore } from './googlesheet'
import { default as fetchJSONStore } from './json'
import { default as fetchNotionStore } from './notion'

const enum Store {
  GOOGLE_SHEET = 'googlesheet',
  JSON = 'json',
  NOTION = 'notion',
}

function makeLoaderChain(first: GameImageLoader, last: GameImageLoader): GameImageLoader {
  return async () => {
    const firstValue = await Promise.resolve(first())
    if (firstValue) {
      return firstValue
    }
    return await Promise.resolve(last())
  }
}

export function chainImageLoader(
  item: GameObject,
  loader: GameImageLoader,
  prepend = false
): GameImageLoader {
  if (item.imageLoader) {
    const imageLoader = item.imageLoader
    if (prepend) {
      return makeLoaderChain(loader, imageLoader)
    }
    return makeLoaderChain(imageLoader, loader)
  }
  return loader
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
