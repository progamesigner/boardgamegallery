import { compressToUTF16, decompressFromUTF16 } from 'lz-string'

const makeCacheKey = (id: string) => `BGG:THING:2302V2:${id}`

function makeURL(ids: string): string {
  return `https://boardgamegeek.com/xmlapi2/thing?id=${ids}`
}

function saveToCache(things: Record<string, string>): void {
  const { localStorage } = window

  Object.entries(things).forEach(([id, thing]) => {
    localStorage.setItem(makeCacheKey(id), compressToUTF16(thing))
  })
}

function loadFromCache(ids: Array<string>): Record<string, string> {
  const { localStorage } = window

  if (localStorage) {
    return ids.reduce((items, id) => {
      const thing = localStorage.getItem(makeCacheKey(id))
      if (thing) {
        return {
          ...items,
          [id]: decompressFromUTF16(thing),
        }
      }
      return items
    }, {})
  }

  return {}
}

export async function getImageURLs(ids: Array<string>): Promise<Record<string, string | null>> {
  const parser = new DOMParser()
  const serializer = new XMLSerializer()

  const cachedThings = loadFromCache(ids)
  const cachedThingIds = Object.keys(cachedThings)
  const missedThingIds = ids.filter(id => !cachedThingIds.includes(id))

  if (missedThingIds.length > 0) {
    const response = await fetch(makeURL(missedThingIds.join(',')))
    if (!response.ok) {
      throw new Error('Failed to fetch thing from boardgamegeek')
    }

    const document = parser.parseFromString(await response.text(), 'text/xml')
    const error = document.querySelector('parsererror')
    if (error) {
      throw new Error(error.textContent ?? 'Parsing error')
    }

    saveToCache(
      Array.from(document.querySelectorAll('item[type="boardgame"]')).reduce((items, item) => {
        const id = item.getAttribute('id')
        if (id) {
          return {
            ...items,
            [id]: serializer.serializeToString(item),
          }
        }
        return items
      }, {})
    )
  }

  return Object.entries({ ...cachedThings, ...loadFromCache(missedThingIds) }).reduce(
    (items, [id, thing]) => {
      const item = parser.parseFromString(thing, 'text/xml')
      const image = item.querySelector('image')
      return {
        ...items,
        [id]: image ? image.textContent : null,
      }
    },
    {}
  )
}
