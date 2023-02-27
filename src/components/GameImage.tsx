import type { JSX } from 'solid-js'

import type { Game } from '~/types'

import { createResource, Show } from 'solid-js'

interface Props {
  item: Game
}

const fetchImageURL = async (item: Game): Promise<string | undefined> => {
  if (!item.image && item.imageLoader) {
    const image = await Promise.resolve(item.imageLoader())
    return image ?? undefined
  }
  return item.image ?? undefined
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
