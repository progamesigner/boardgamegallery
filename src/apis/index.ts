import type { Game } from '~/types'

import { default as notion } from './notion'

export async function fetchGames(source: string): Promise<Array<Game>> {
  const params = source.split(':')
  const store = params.shift()
  if (store) {
    switch (store.toLowerCase()) {
      case 'notion': {
        const [databaseId] = params
        return await notion(databaseId)
      }
      default:
        throw new Error('Unsupported data store')
    }
  }
  throw new Error('No data store specified')
}
