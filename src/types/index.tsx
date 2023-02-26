export interface Game {
  id: string
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
