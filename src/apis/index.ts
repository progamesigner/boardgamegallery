import type { Game } from '~/types'

import { default as notion } from './notion'

export async function fetchGames(source: string): Promise<Array<Game>> {
  const [engine, params] = source.split(':', 2)
  switch (engine.toLowerCase()) {
    case 'notion':
      return await notion(params)
    default:
      throw new Error('Unsupported source engine')
  }
}
