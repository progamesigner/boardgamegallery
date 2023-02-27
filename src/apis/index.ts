import type { Game } from '~/types'

import { default as googlesheet } from './googlesheet'
import { default as notion } from './notion'

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
      return await googlesheet(sheetId)
    }
    case Store.NOTION: {
      const [databaseId] = params
      return await notion(databaseId)
    }
    default:
      throw new Error('Unsupported data store')
  }
}
