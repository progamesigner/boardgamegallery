import type { GameData, GameObject } from '~/types';
import { getGameImages } from './boardgamegeek';

interface JSONGamePayload {
  version: string;
  games: GameData[];
}

export default async function (url: URL | string): Promise<GameObject[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch games');
  }

  const paylaod: JSONGamePayload = await response.json();
  if (paylaod.version !== 'v1') {
    throw new Error('Unsupported version');
  }

  const invalidGames = paylaod.games.filter(
    (item) =>
      !item.id ||
      !item.name ||
      !Array.isArray(item.types) ||
      !Number.isInteger(item.minimalPlayers) ||
      !Number.isInteger(item.maximalPlayers) ||
      !Number.isInteger(item.minimalMinutes) ||
      !Number.isInteger(item.maximalMinutes) ||
      !Number.isInteger(item.order) ||
      !Array.isArray(item.tags),
  );
  if (invalidGames.length > 0) {
    throw new Error('Invalid JSON store');
  }

  const items = paylaod.games.map((item) => {
    return {
      ...item,
      bggId: item.bggId ?? null,
      originalName: item.originalName ?? null,
      description: item.description ?? null,
      label: item.label ?? null,
      image: item.image ?? null,
    } as GameObject;
  });

  return getGameImages(items);
}
