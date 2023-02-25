export interface Game {
  id: string
  name: string
  originalName?: string
  description?: string
  label?: string
  image?: string
  types?: Array<string>
  minimalPlayers: number
  maximalPlayers: number
  minimalMinutes: number
  maximalMinutes: number
  tags: Array<string>
}
