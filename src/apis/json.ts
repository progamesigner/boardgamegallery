import type { GameData, GameObject } from '~/types'

import { getGameImages } from './boardgamegeek'

interface JSONGamePayload {
  version: string
  games: Array<GameData>
}

export default async function (url: URL | string): Promise<Array<GameObject>> {
  const response = await fetch(process.env.URL ? new URL(url, process.env.URL) : url)
  if (!response.ok) {
    throw new Error('Failed to fetch games')
  }

  const paylaod: JSONGamePayload = await response.json()
  if (paylaod.version !== 'v1') {
    throw new Error('Unsupported version')
  }

  const invalidGames = paylaod.games.filter(
    item =>
      !item.id ||
      !item.name ||
      !(item.types instanceof Array) ||
      !Number.isInteger(item.minimalPlayers) ||
      !Number.isInteger(item.maximalPlayers) ||
      !Number.isInteger(item.minimalMinutes) ||
      !Number.isInteger(item.maximalMinutes) ||
      !(item.tags instanceof Array)
  )
  if (invalidGames.length > 0) {
    throw new Error('Invalid JSON store')
  }

  return getGameImages(paylaod.games)
}
