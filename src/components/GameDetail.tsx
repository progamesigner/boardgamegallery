import type { JSX } from 'solid-js'

import type { GameObject } from '~/types'

import { Index, Match, Show, Switch } from 'solid-js'

import { GameImage } from '~/components/GameImage'

interface Props {
  item: GameObject
}

interface RangePanelProps {
  format: (range: string) => string
  maximum: number
  minimum: number
}

interface TagsPanelProps {
  tags: Array<string>
}

function TagsPanel(props: TagsPanelProps): JSX.Element {
  return (
    <Show when={props.tags.length > 0}>
      <Index each={props.tags}>{tag => <span class="text-gray-300">{tag()}</span>}</Index>
    </Show>
  )
}

function RangePanel(props: RangePanelProps): JSX.Element {
  return (
    <Show when={props.maximum > 0 && props.minimum > 0 && props.maximum >= props.minimum}>
      <Switch>
        <Match when={props.maximum === props.minimum}>
          <span>{props.format(`${props.minimum}`)}</span>
        </Match>
        <Match when={props.maximum > props.minimum}>
          <span>{props.format(`${props.minimum} ~ ${props.maximum}`)}</span>
        </Match>
      </Switch>
    </Show>
  )
}

export function GameDetail(props: Props): JSX.Element {
  return (
    <div class="flex w-full flex-col pb-4 text-gray-100 sm:flex-row">
      <div class="relative basis-64">
        <figure class="pb-[80%] sm:pb-[120%]">
          <GameImage item={props.item} />
        </figure>
      </div>
      <div class="mx-4">
        <h2 class="overflow-hidden overflow-ellipsis whitespace-nowrap text-xl font-bold text-gray-100">
          {props.item.name}
        </h2>
        <h3 class="overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-gray-300">{props.item.originalName}</h3>
        <p class="text-gray-300">{props.item.description}</p>
        <p>
          Type: <TagsPanel tags={props.item.types} />
        </p>
        <p>
          <RangePanel
            format={range => `Player: ${range} players`}
            minimum={props.item.minimalPlayers}
            maximum={props.item.maximalPlayers}
          />
        </p>
        <p>
          <RangePanel
            format={range => `Time: ${range} minutes`}
            minimum={props.item.minimalMinutes}
            maximum={props.item.maximalMinutes}
          />
        </p>
        <div>
          <TagsPanel tags={props.item.tags} />
        </div>
      </div>
    </div>
  )
}
