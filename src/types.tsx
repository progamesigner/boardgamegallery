export type GameImageLoader = () => Promise<string | null> | string | null

export interface GameData {
  id: string
  bggId: number | null
  name: string
  originalName: string | null
  description: string | null
  label: string | null
  image: string | null
  types: Array<string>
  minimalPlayers: number
  maximalPlayers: number
  minimalMinutes: number
  maximalMinutes: number
  tags: Array<string>
}

export interface GameObject extends GameData {
  imageLoader?: GameImageLoader
}
