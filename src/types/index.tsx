export interface Game {
  id: string
  name: string
  originalName?: string
  description?: string
  label?: string
  image?: string
  type?: string
  maximalMinutes?: number
  maximalPlayers?: number
  minimalMinutes?: number
  minimalPlayers?: number
  tags: Array<string>
}
