import type { JSX, ParentProps } from 'solid-js'

import type { Game } from '~/types'

import { createContext, createResource, Show, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

interface Props {
  item: Game
}

interface DeferredImageURL {
  pending: boolean
  url?: string
}

const ImageContext = createContext<{
  get: (id: string) => DeferredImageURL | undefined
  set: (id: string, url: DeferredImageURL) => void
}>({
  get: () => undefined,
  set: () => undefined,
})

const fetchImageURL = async (item: Game): Promise<string | undefined> => {
  const { get, set } = useContext(ImageContext)

  const image = get(item.id)
  if (image) {
    if (image.pending) {
      return new Promise<string | undefined>(resolve => {
        const checker = () => {
          const image = get(item.id)
          if (image && !image.pending) {
            resolve(image.url)
          } else {
            setTimeout(checker)
          }
        }
        checker()
      })
    }
    return Promise.resolve(image.url)
  }

  set(item.id, { pending: true })

  if (!item.image && item.imageLoader) {
    const resolvedURL = await Promise.resolve(item.imageLoader())
    set(item.id, { pending: false, url: resolvedURL ?? undefined })
    return Promise.resolve(resolvedURL ?? undefined)
  }

  set(item.id, { pending: false, url: item.image ?? undefined })

  const resolvedImage = get(item.id)
  return Promise.resolve(resolvedImage ? resolvedImage.url : undefined)
}

export function GameImage(props: Props): JSX.Element {
  const [url] = createResource(() => props.item, fetchImageURL)

  return (
    <Show
      when={!url.loading}
      fallback={
        <div class="loading absolute flex h-full w-full items-center justify-center rounded" />
      }
    >
      <img class="absolute h-full w-full rounded object-cover" src={url()} />
    </Show>
  )
}

export function ImageCacheProvider(props: ParentProps) {
  const [state, setState] = createStore<Record<string, DeferredImageURL | undefined>>({})
  const store = {
    get(id: string): DeferredImageURL | undefined {
      return state[id] ?? undefined
    },
    set(id: string, url: DeferredImageURL): void {
      setState(state => ({ ...state, [id]: url }))
    },
  }
  return <ImageContext.Provider value={store}>{props.children}</ImageContext.Provider>
}
