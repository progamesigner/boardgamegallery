import { default as lz } from 'lz-string';
import type { GameObject } from '~/types';
import { chainImageLoader } from '.';

const makeCacheKey = (id: string) => `BGG:THING:V2A:${id}`;
const XMLAPI_BATCH_SIZE = 20;

function* chunk<T>(items: T[], size: number): Generator<T[]> {
  for (let index = 0; index < items.length; index += size) {
    yield items.slice(index, index + size);
  }
}

function makeURL(ids: string): string {
  return `https://boardgamegeek.com/xmlapi2/thing?id=${ids}`;
}

function saveToCache(things: Record<string, string>): void {
  const { localStorage } = window;

  for (const [id, thing] of Object.entries(things)) {
    localStorage.setItem(makeCacheKey(id), lz.compressToUTF16(thing));
  }
}

function loadFromCache(ids: string[]): Record<string, string> {
  const { localStorage } = window;

  if (localStorage) {
    return ids.reduce<Record<string, string>>((items, id) => {
      const thing = localStorage.getItem(makeCacheKey(id));
      if (thing) {
        items[id] = lz.decompressFromUTF16(thing);
        return items;
      }
      return items;
    }, {});
  }

  return {};
}

async function getImageURLs(
  ids: string[],
): Promise<Record<string, string | null>> {
  const parser = new DOMParser();
  const serializer = new XMLSerializer();

  const cachedThings = loadFromCache(ids);
  const cachedThingIds = Object.keys(cachedThings);
  const missedThingIds = ids.filter((id) => !cachedThingIds.includes(id));

  const batches = Array.from(chunk(missedThingIds, XMLAPI_BATCH_SIZE));

  for (const batchedThingIds of batches) {
    const response = await fetch(makeURL(batchedThingIds.join(',')));
    if (!response.ok) {
      throw new Error('Failed to fetch thing from boardgamegeek');
    }

    const document = parser.parseFromString(await response.text(), 'text/xml');
    const error = document.querySelector('parsererror');
    if (error) {
      throw new Error(error.textContent ?? 'Parsing error');
    }

    const items = Array.from(document.querySelectorAll('item'));
    saveToCache(
      items.reduce<Record<string, string>>((items, item) => {
        const id = item.getAttribute('id');
        if (id) {
          items[id] = serializer.serializeToString(item);
          return items;
        }
        return items;
      }, {}),
    );
  }

  return Object.entries({
    ...cachedThings,
    ...loadFromCache(missedThingIds),
  }).reduce<Record<string, string | null>>((items, [id, thing]) => {
    const item = parser.parseFromString(thing, 'text/xml');
    const image = item.querySelector('image');
    items[id] = image ? image.textContent : null;
    return items;
  }, {});
}

async function getImageURL(
  deferredImageURLs: Promise<Record<string, string | null>>,
  item: GameObject,
): Promise<string | null> {
  const bggId = item.bggId;
  if (bggId) {
    return deferredImageURLs
      .then((images) => {
        return images[bggId.toString()] ?? null;
      })
      .catch(() => null);
  }
  return null;
}

export function getGameImages(items: GameObject[]): GameObject[] {
  const missedImageIds = items
    .filter((item) => !item.image)
    .map((item) => (item.bggId ? item.bggId.toString() : ''))
    .filter((bggId) => bggId.length > 0);

  const deferredImageURLs = getImageURLs(missedImageIds).then((images) => {
    if (images) {
      return Object.entries(images).reduce<Record<string, string | null>>(
        (images, [id, url]) => {
          images[id] = url;
          return images;
        },
        {},
      );
    }
    return {};
  });

  if (missedImageIds.length > 0) {
    return items.map((item) => {
      if (!item.image) {
        return {
          ...item,
          imageLoader: chainImageLoader(
            item,
            getImageURL.bind(null, deferredImageURLs, item),
            true,
          ),
        };
      }
      return item;
    });
  }

  return items;
}
