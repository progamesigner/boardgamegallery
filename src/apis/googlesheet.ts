import { default as papaparse } from 'papaparse';
import type { GameObject } from '~/types';
import { getGameImages } from './boardgamegeek';

enum Field {
  ID = 'ID',
  BGGID = 'BGGID',
  NAME = 'NAME',
  ORIGINAL_NAME = 'ORIGINALNAME',
  DESCRIPTION = 'DESCRIPTION',
  LABEL = 'LABEL',
  IMAGE = 'IMAGE',
  TYPES = 'TYPES',
  MINIMAL_PLAYERS = 'MINPLAYERS',
  MAXIMAL_PLAYERS = 'MAXPLAYERS',
  MINIMAL_MINUTES = 'MINMINUTES',
  MAXIMAL_MINUTES = 'MAXMINUTES',
  TAGS = 'TAGS',
  ORDER = 'ORDER',

  IMGUR = 'IMGUR',
  GAMETYPE = 'GAMETYPE',
  PLAYER = 'PLAYER',
  PLAYTIME = 'PLAYTIME',
  TAG = 'TAG',
}

interface SheetGamePayload {
  [Field.ID]?: string;
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
  [Field.IMGUR]?: string;
  [Field.GAMETYPE]?: string[];
  [Field.PLAYER]?: number[];
  [Field.PLAYTIME]?: number[];
  [Field.TAG]?: string[];
}

function makeURL(sheetId: string): string {
  return `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?output=csv`;
}

function parseRangeArray(
  value?: number[],
  minimalValue?: number,
  maximalValue?: number,
): number[] {
  if (minimalValue || maximalValue) {
    return [minimalValue ?? 0, maximalValue ?? 0];
  }

  if (value) {
    if (value.length === 1) {
      return [value[0], value[0]];
    }
    return value;
  }

  return [0, 0];
}

function splitRangeArray(value: string): number[] {
  return value.split(/[~-]+/).map((v) => Number.parseInt(v.trim()));
}

function splitStringArray(value: string): string[] {
  return value
    .split(/[\s,、]+/)
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

export default async function (sheetId: string): Promise<GameObject[]> {
  const response = await fetch(makeURL(sheetId));
  if (!response.ok) {
    throw new Error('Failed to fetch games');
  }

  const csv = papaparse.parse<SheetGamePayload>(await response.text(), {
    header: true,
    transformHeader: (header) => header.toUpperCase(),
    transform: (field, column) => {
      switch (column) {
        case Field.BGGID:
        case Field.MINIMAL_PLAYERS:
        case Field.MAXIMAL_PLAYERS:
        case Field.MINIMAL_MINUTES:
        case Field.MAXIMAL_MINUTES:
        case Field.ORDER:
          return Number.parseInt(field);
        case Field.ID:
        case Field.NAME:
        case Field.ORIGINAL_NAME:
        case Field.DESCRIPTION:
        case Field.LABEL:
        case Field.IMAGE:
        case Field.IMGUR:
          return field.toString().trim();
        case Field.TYPES:
        case Field.TAGS:
        case Field.TAG:
        case Field.GAMETYPE:
          return splitStringArray(field);
        case Field.PLAYER:
        case Field.PLAYTIME:
          return splitRangeArray(field);
        default:
          return field;
      }
    },
  });

  const items = csv.data.map<GameObject>((item, row) => {
    const [minimalPlayers, maximalPlayers] = parseRangeArray(
      item[Field.PLAYER],
      item[Field.MINIMAL_PLAYERS],
      item[Field.MAXIMAL_PLAYERS],
    );

    const [minimalMinutes, maximalMinutes] = parseRangeArray(
      item[Field.PLAYTIME],
      item[Field.MINIMAL_MINUTES],
      item[Field.MAXIMAL_MINUTES],
    );

    return {
      id: item[Field.ID] ?? row.toString(),
      bggId: item[Field.BGGID] ?? null,
      name: `${item[Field.NAME]}`,
      originalName: item[Field.ORIGINAL_NAME] ?? null,
      description: item[Field.DESCRIPTION] ?? null,
      label: item[Field.LABEL] ?? null,
      image: item[Field.IMAGE] ?? item[Field.IMGUR] ?? null,
      types: [...(item[Field.TYPES] ?? []), ...(item[Field.GAMETYPE] ?? [])],
      minimalPlayers: minimalPlayers,
      maximalPlayers: maximalPlayers,
      minimalMinutes: minimalMinutes,
      maximalMinutes: maximalMinutes,
      tags: [...(item[Field.TAGS] ?? []), ...(item[Field.TAG] ?? [])],
      order: item[Field.ORDER] ?? 0,
    };
  });

  return getGameImages(items);
}
