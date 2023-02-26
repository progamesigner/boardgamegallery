import type { JSX } from 'solid-js'

import type { Game } from '~/types'

import { Index } from 'solid-js'

interface Props {
  item: Game
}

export function GameDetail(props: Props): JSX.Element {
  return (
    <div class="flex w-full flex-col pb-4 text-gray-100 sm:flex-row">
      <div class="relative basis-64">
        <figure class="pb-[80%] sm:pb-[120%]">
          <img class="absolute h-full w-full rounded object-cover" src={props.item.image ?? ''} />
        </figure>
      </div>
      <div class="mx-4">
        <h3 class="text-base text-gray-300">{props.item.originalName}</h3>
        <h2 class="text-lg font-bold text-gray-100">{props.item.name}</h2>
        <p class="text-gray-300">{props.item.description}</p>
        <p>
          Type:
          <Index each={props.item.types}>
            {item => <span class="text-gray-300">{item()}</span>}
          </Index>
        </p>
        <p>
          Players: {props.item.minimalPlayers} ~ {props.item.maximalPlayers}
        </p>
        <p>
          Time: {props.item.minimalMinutes} ~ {props.item.maximalMinutes} mins
        </p>
        <div>
          <Index each={props.item.tags}>
            {item => <span class="text-gray-300">{item()}</span>}
          </Index>
        </div>
      </div>
    </div>
  )
}