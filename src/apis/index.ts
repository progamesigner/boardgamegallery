import type { Game } from '~/types'

import { default as fetchGoogleSheetStore } from './googlesheet'
import { default as fetchNotionStore } from './notion'

const enum Store {
  GOOGLE_SHEET = 'googlesheet',
  NOTION = 'notion',
}

export async function fetchGames(source: string): Promise<Array<Game>> {
  const params = source.split(':')
  const store = params.shift() as Store | undefined
  if (!store) {
    throw new Error('No data store specified')
  }

  switch (store.toLowerCase()) {
    case Store.GOOGLE_SHEET: {
      const [sheetId] = params
      return await fetchGoogleSheetStore(sheetId)
    }
    case Store.NOTION: {
      const [databaseId] = params
      return await fetchNotionStore(databaseId)
    }
    default:
      throw new Error('Unsupported data store')
  }
}
