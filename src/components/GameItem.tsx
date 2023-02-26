import type { JSX } from 'solid-js'

import type { Game } from '~/types'

import { Show } from 'solid-js'

interface Props {
  item: Game
}

export function GameItem(props: Props): JSX.Element {
  return (
    <div class="relative block cursor-pointer rounded border bg-gray-300 hover:bg-gray-200">
      <figure class="pb-[100%]">
        <img class="absolute h-full w-full rounded object-cover" src={props.item.image ?? ''} />
        <figcaption class="absolute inset-x-0 bottom-0 rounded-b bg-black/75 px-4 py-2 text-sm">
          <h2 class="text-gray-100">{props.item.name}</h2>
          <h3 class="pt-2 text-gray-300">{props.item.description}</h3>
        </figcaption>
      </figure>

      <Show when={props.item.label}>
        <span class="absolute top-1 -right-1 rounded bg-gray-600 p-1 text-center text-sm text-white shadow">
          {props.item.label}
        </span>
      </Show>
    </div>
  )
}
