import type {
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import type { APIEvent } from '@solidjs/start/server';
import type { GameData, GameObject } from '~/types';

enum Field {
  INCLUDE = '[BGG]: INCLUDE',
  BGGID = '[BGG]: BGGID',
  NAME = '[BGG]: NAME',
  ORIGINAL_NAME = '[BGG]: ORIGINAL-NAME',
  DESCRIPTION = '[BGG]: DESCRIPTION',
  LABEL = '[BGG]: LABEL-TEXT',
  IMAGE = '[BGG]: IMAGE',
  TYPES = '[BGG]: TYPES',
  MINIMAL_PLAYERS = '[BGG]: MIN-PLAYERS',
  MAXIMAL_PLAYERS = '[BGG]: MAX-PLAYERS',
  MINIMAL_MINUTES = '[BGG]: MIN-MINUTES',
  MAXIMAL_MINUTES = '[BGG]: MAX-MINUTES',
  TAGS = '[BGG]: TAGS',
  ORDER = '[BGG]: ORDER',
}

interface NotionGamePayload {
  [Field.INCLUDE]?: boolean;
  [Field.BGGID]?: number;
  [Field.NAME]?: string;
  [Field.ORIGINAL_NAME]?: string;
  [Field.DESCRIPTION]?: string;
  [Field.LABEL]?: string;
  [Field.IMAGE]?: string;
  [Field.TYPES]?: string[];
  [Field.MINIMAL_PLAYERS]?: number;
  [Field.MAXIMAL_PLAYERS]?: number;
  [Field.MINIMAL_MINUTES]?: number;
  [Field.MAXIMAL_MINUTES]?: number;
  [Field.TAGS]?: string[];
  [Field.ORDER]?: number;
}

type NotionProperty =
  PageObjectResponse['properties'][keyof PageObjectResponse['properties']];

export interface APIResponse {
  data: GameData[];
  cursor: string | null;
}

function extractArrayProperty(property: NotionProperty): string[] {
  switch (property.type) {
    case 'number':
      return property.number ? [property.number.toString().trim()] : [];
    case 'url':
      return property.url ? [property.url.trim()] : [];
    case 'select':
      return property.select ? splitStringArray(property.select.name) : [];
    case 'multi_select':
      return property.multi_select
        ? property.multi_select.map((v) => v.name.trim())
        : [];
    case 'status':
      return property.status ? splitStringArray(property.status.name) : [];
    case 'date':
      return property.date
        ? [
            formatNotionDate(
              property.date.start,
              property.date.end,
              property.date.time_zone,
            ),
          ]
        : [];
    case 'email':
      return property.email ? [property.email.trim()] : [];
    case 'phone_number':
      return property.phone_number ? [property.phone_number.trim()] : [];
    case 'formula':
      switch (property.formula.type) {
        case 'number':
          return property.formula.number
            ? [property.formula.number.toString().trim()]
            : [];
        case 'date':
          return property.formula.date
            ? [
                formatNotionDate(
                  property.formula.date.start,
                  property.formula.date.end,
                  property.formula.date.time_zone,
                ).trim(),
              ]
            : [];
        case 'string':
          return property.formula.string
            ? splitStringArray(property.formula.string)
            : [];
        default:
          return [];
      }
    case 'rollup':
      switch (property.rollup.type) {
        case 'date':
          return property.rollup.date
            ? [
                formatNotionDate(
                  property.rollup.date.start,
                  property.rollup.date.end,
                  property.rollup.date.time_zone,
                ).trim(),
              ]
            : [];
        case 'number':
          return property.rollup.number
            ? [property.rollup.number.toString().trim()]
            : [];
        default:
          return [];
      }
    default:
      return [];
  }
}

function extractBooleanProperty(property: NotionProperty): boolean {
  switch (property.type) {
    case 'number':
      return property.number ? property.number > 0 : false;
    case 'url':
      return !!property.url;
    case 'select':
      return !!property.select;
    case 'multi_select':
      return property.multi_select ? property.multi_select.length > 0 : false;
    case 'status':
      return !!property.status;
    case 'date':
      return property.date ? !!property.date.start : false;
    case 'email':
      return !!property.email;
    case 'phone_number':
      return !!property.phone_number;
    case 'checkbox':
      return property.checkbox;
    case 'formula':
      switch (property.formula.type) {
        case 'boolean':
          return !!property.formula.boolean;
        case 'number':
          return property.formula.number ? property.formula.number > 0 : false;
        case 'date':
          return property.formula.date ? !!property.formula.date.start : false;
        case 'string':
          return !!property.formula.string;
        default:
          return false;
      }
    case 'rollup':
      switch (property.rollup.type) {
        case 'date':
          return property.rollup.date ? !!property.rollup.date.start : false;
        case 'number':
          return property.rollup.number ? property.rollup.number > 0 : false;
        default:
          return false;
      }
    default:
      return false;
  }
}

function extractNumberProperty(property: NotionProperty): number {
  switch (property.type) {
    case 'number':
      return property.number ?? 0;
    case 'multi_select':
      return property.multi_select ? property.multi_select.length : 0;
    case 'checkbox':
      return property.checkbox ? 1 : 0;
    case 'formula':
      switch (property.formula.type) {
        case 'boolean':
          return property.formula.boolean ? 1 : 0;
        case 'number':
          return property.formula.number ?? 0;
        default:
          return 0;
      }
    case 'rollup':
      switch (property.rollup.type) {
        case 'number':
          return property.rollup.number ?? 0;
        default:
          return 0;
      }
    default:
      return 0;
  }
}

function extractStringProperty(property: NotionProperty): string | undefined {
  switch (property.type) {
    case 'number':
      return property.number ? property.number.toString() : undefined;
    case 'url':
      return property.url ? property.url : undefined;
    case 'select':
      return property.select ? property.select.name : undefined;
    case 'multi_select':
      return property.multi_select
        ? property.multi_select.map((select) => select.name).join(',')
        : undefined;
    case 'status':
      return property.status ? property.status.name : undefined;
    case 'date':
      return property.date
        ? formatNotionDate(
            property.date.start,
            property.date.end,
            property.date.time_zone,
          )
        : undefined;
    case 'email':
      return property.email ? property.email : undefined;
    case 'phone_number':
      return property.phone_number ? property.phone_number : undefined;
    case 'files':
      return property.files
        ? property.files
            .map((file) => {
              switch (file.type) {
                case 'file':
                  return file.file.url;
                case 'external':
                  return file.external.url;
                default:
                  return undefined;
              }
            })
            .at(0)
        : undefined;
    case 'formula':
      switch (property.formula.type) {
        case 'number':
          return property.formula.number
            ? property.formula.number.toString()
            : undefined;
        case 'date':
          return property.formula.date
            ? formatNotionDate(
                property.formula.date.start,
                property.formula.date.end,
                property.formula.date.time_zone,
              )
            : undefined;
        case 'string':
          return property.formula.string ? property.formula.string : undefined;
        default:
          return undefined;
      }
    case 'rollup':
      switch (property.rollup.type) {
        case 'date':
          return property.rollup.date
            ? formatNotionDate(
                property.rollup.date.start,
                property.rollup.date.end,
                property.rollup.date.time_zone,
              )
            : undefined;
        case 'number':
          return property.rollup.number
            ? property.rollup.number.toString()
            : undefined;
        default:
          return undefined;
      }
    default:
      return undefined;
  }
}

function formatNotionDate(
  begin: string,
  end: string | null,
  timezone: string | null,
): string {
  if (end && timezone) {
    return `${begin} ~ ${end} (${timezone})`;
  }
  if (end) {
    return `${begin} ~ ${end}`;
  }
  if (timezone) {
    return `${begin} (${timezone})`;
  }
  return begin;
}

function isPageObject(
  object:
    | PageObjectResponse
    | PartialPageObjectResponse
    | PartialDatabaseObjectResponse
    | DatabaseObjectResponse,
): object is PageObjectResponse {
  return 'properties' in object;
}

function makeGameImage(
  item: PageObjectResponse,
  game: NotionGamePayload,
): string | null {
  if (game[Field.IMAGE]) {
    return game[Field.IMAGE];
  }

  if (item.cover) {
    switch (item.cover.type) {
      case 'file':
        return item.cover.file.url;
      case 'external':
        return item.cover.external.url;
      default:
        return null;
    }
  }

  return null;
}

function splitStringArray(value: string): string[] {
  return value
    .split(/[\s,、]+/)
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

async function handle(
  databaseId: string,
  cursor?: string,
): Promise<APIResponse> {
  const games: GameObject[] = [];

  const response = await fetch(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        Authorization: `Bearer ${process.env.SERVER_NOTION_TOKEN}`,
      },
      body: JSON.stringify({
        start_cursor: cursor,
      }),
    },
  );
  const items: QueryDatabaseResponse = await response.json();

  items.results.map((item) => {
    if (isPageObject(item)) {
      const game = Object.entries(item.properties).reduce<NotionGamePayload>(
        (fields, [name, property]) => {
          switch (name.toUpperCase()) {
            case Field.INCLUDE:
              fields[Field.INCLUDE] = extractBooleanProperty(property);
              return fields;
            case Field.BGGID:
              fields[Field.BGGID] = extractNumberProperty(property);
              return fields;
            case Field.NAME:
              fields[Field.NAME] = extractStringProperty(property);
              return fields;
            case Field.ORIGINAL_NAME:
              fields[Field.ORIGINAL_NAME] = extractStringProperty(property);
              return fields;
            case Field.DESCRIPTION:
              fields[Field.DESCRIPTION] = extractStringProperty(property);
              return fields;
            case Field.LABEL:
              fields[Field.LABEL] = extractStringProperty(property);
              return fields;
            case Field.IMAGE:
              fields[Field.IMAGE] = extractStringProperty(property);
              return fields;
            case Field.TYPES:
              fields[Field.TYPES] = extractArrayProperty(property);
              return fields;
            case Field.MINIMAL_PLAYERS:
              fields[Field.MINIMAL_PLAYERS] = extractNumberProperty(property);
              return fields;
            case Field.MAXIMAL_PLAYERS:
              fields[Field.MAXIMAL_PLAYERS] = extractNumberProperty(property);
              return fields;
            case Field.MINIMAL_MINUTES:
              fields[Field.MINIMAL_MINUTES] = extractNumberProperty(property);
              return fields;
            case Field.MAXIMAL_MINUTES:
              fields[Field.MAXIMAL_MINUTES] = extractNumberProperty(property);
              return fields;
            case Field.TAGS:
              fields[Field.TAGS] = extractArrayProperty(property);
              return fields;
            case Field.ORDER:
              fields[Field.ORDER] = extractNumberProperty(property);
              return fields;
            default:
              return fields;
          }
        },
        {},
      );

      if (game?.[Field.INCLUDE] && game[Field.NAME]) {
        games.push({
          id: item.id,
          name: game[Field.NAME],
          bggId: game[Field.BGGID] ?? null,
          originalName: game[Field.ORIGINAL_NAME] ?? null,
          description: game[Field.DESCRIPTION] ?? null,
          label: game[Field.LABEL] ?? null,
          image: makeGameImage(item, game),
          types: game[Field.TYPES] ?? [],
          minimalPlayers: game[Field.MINIMAL_PLAYERS] ?? 0,
          maximalPlayers: game[Field.MAXIMAL_PLAYERS] ?? 0,
          minimalMinutes: game[Field.MINIMAL_MINUTES] ?? 0,
          maximalMinutes: game[Field.MAXIMAL_MINUTES] ?? 0,
          tags: game[Field.TAGS] ?? [],
          order: game[Field.ORDER] ?? 0,
        });
      }
    }
  });

  return {
    cursor: items.next_cursor,
    data: games,
  };
}

export async function GET({ params, request }: APIEvent): Promise<Response> {
  const url = new URL(request.url);

  if (!process.env.SERVER_ENABLE_NOTION_QUERY) {
    return new Response(null, { status: 404 });
  }

  if (!process.env.SERVER_NOTION_TOKEN) {
    return new Response(null, { status: 403 });
  }

  try {
    const response = await handle(
      params.id,
      url.searchParams.get('cursor') ?? undefined,
    );
    return new Response(JSON.stringify(response));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error));
  }
}
