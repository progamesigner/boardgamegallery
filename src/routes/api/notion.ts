import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

import type { Game } from '~/types'

import { Client } from '@notionhq/client'
import { json } from 'solid-start/api'

enum Field {
  INCLUDE = '[BGG]: INCLUDE',
  NAME = '[BGG]: NAME',
  ORIGINAL_NAME = '[BGG]: ORIGINAL-NAME',
  DESCRIPTION = '[BGG]: DESCRIPTION',
  LABEL = '[BGG]: LABEL-TEXT',
  IMAGE_URL = '[BGG]: IMAGE-URL',
  TYPES = '[BGG]: TYPES',
  MINMAL_PLAYERS = '[BGG]: MIN-PLAYERS',
  MAXIMAL_PLAYERS = '[BGG]: MAX-PLAYERS',
  MINMAL_MINUTES = '[BGG]: MIN-MINUTES',
  MAXIMAL_MINUTES = '[BGG]: MAX-MINUTES',
  TAGS = '[BGG]: TAGS',
}

interface NotionPaginationState {
  cursor?: string
  items: Array<Game>
}

type NotionProperty = PageObjectResponse['properties'][keyof PageObjectResponse['properties']]

function formatNotionDate(begin: string, end: string | null, timezone: string | null): string {
  if (end && timezone) {
    return `${begin} ~ ${end} (${timezone})`
  }
  if (end) {
    return `${begin} ~ ${end}`
  }
  if (timezone) {
    return `${begin} (${timezone})`
  }
  return begin
}

function extractNotionProperty(property: NotionProperty): boolean | number | string | null {
  switch (property.type) {
    case 'number':
      return property.number
    case 'url':
      return property.url
    case 'select':
      return property.select ? property.select.name : null
    case 'multi_select':
      return property.multi_select
        ? property.multi_select.map(select => select.name).join(',')
        : null
    case 'status':
      return property.status ? property.status.name : null
    case 'date':
      return property.date
        ? formatNotionDate(property.date.start, property.date.end, property.date.time_zone)
        : null
    case 'email':
      return property.email
    case 'phone_number':
      return property.phone_number
    case 'checkbox':
      return property.checkbox
    case 'formula':
      switch (property.formula.type) {
        case 'boolean':
          return property.formula.boolean
        case 'number':
          return property.formula.number
        case 'date':
          return property.formula.date
            ? formatNotionDate(
                property.formula.date.start,
                property.formula.date.end,
                property.formula.date.time_zone
              )
            : null
        case 'string':
          return property.formula.string
        default:
          return null
      }
    case 'rollup':
      switch (property.rollup.type) {
        case 'date':
          return property.rollup.date
            ? formatNotionDate(
                property.rollup.date.start,
                property.rollup.date.end,
                property.rollup.date.time_zone
              )
            : null
        case 'number':
          return property.rollup.number
        case 'array':
        default:
          return null
      }
    case 'files':
    case 'created_by':
    case 'created_time':
    case 'last_edited_by':
    case 'last_edited_time':
    case 'title':
    case 'rich_text':
    case 'people':
    case 'relation':
    default:
      return null
  }
}

export async function GET(): Promise<Response> {
  const token = process.env.NOTION_TOKEN
  const databaseId = process.env.NOTION_DATABASE_ID ?? ''

  const client = new Client({
    auth: token,
  })

  const state = {
    cursor: undefined,
    items: [],
  } as NotionPaginationState

  do {
    const data = await client.databases.query({
      database_id: databaseId,
      start_cursor: state.cursor,
      archived: false,
    })

    data.results.map(item => {
      if ('properties' in item) {
        const game = Object.entries(item.properties).reduce((fields, [name, property]) => {
          const field = name.toUpperCase()
          const value = extractNotionProperty(property)

          switch (field) {
            case Field.INCLUDE:
              return {
                ...fields,
                include: Boolean(value),
              }
            case Field.NAME:
              return {
                ...fields,
                name: String(value),
              }
            case Field.ORIGINAL_NAME:
              return {
                ...fields,
                originalName: String(value),
              }
            case Field.DESCRIPTION:
              return {
                ...fields,
                description: String(value),
              }
            case Field.LABEL:
              return {
                ...fields,
                label: String(value),
              }
            case Field.IMAGE_URL:
              return {
                ...fields,
                image: String(value),
              }
            case Field.TYPES:
              return {
                ...fields,
                types: String(value)
                  .split(/[\s,、]+/)
                  .filter(tag => tag.trim() !== ''),
              }
            case Field.MINMAL_PLAYERS:
              return {
                ...fields,
                minimalPlayers: Number.parseInt(String(value) ?? '0'),
              }
            case Field.MAXIMAL_PLAYERS:
              return {
                ...fields,
                maximalPlayers: Number.parseInt(String(value) ?? '0'),
              }
            case Field.MINMAL_MINUTES:
              return {
                ...fields,
                minimalMinutes: Number.parseInt(String(value) ?? '0'),
              }
            case Field.MAXIMAL_MINUTES:
              return {
                ...fields,
                maximalMinutes: Number.parseInt(String(value) ?? '0'),
              }
            case Field.TAGS:
              return {
                ...fields,
                tags: String(value)
                  .split(/[\s,、]+/)
                  .filter(tag => tag.trim() !== ''),
              }
            default:
              return fields
          }
        }, {} as Partial<Game> & { include: boolean })

        if (game && game.name && game.include) {
          state.items.push({
            id: item.id,
            name: game.name,
            originalName: game.originalName,
            description: game.description,
            label: game.label,
            image: game.image,
            types: game.types ?? [],
            minimalPlayers: game.minimalPlayers ?? 0,
            maximalPlayers: game.maximalPlayers ?? 0,
            minimalMinutes: game.minimalMinutes ?? 0,
            maximalMinutes: game.maximalMinutes ?? 0,
            tags: game.tags ?? [],
          })
        }
      }
    })

    state.cursor = data.next_cursor ?? undefined
  } while (state.cursor)

  return json(state.items)
}
