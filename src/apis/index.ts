import type { Game } from '~/types'

export async function fetchGames(): Promise<Array<Game>> {
  const response = await fetch('/api/notion')
  if (!response.ok) {
    throw new Error('Failed to fetch games')
  }
  return await response.json()
}
