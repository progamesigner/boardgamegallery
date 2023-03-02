import type { JSX } from 'solid-js'

import type { GameObject } from '~/types'

import { Index, Match, Show, Switch } from 'solid-js'

import { GameImage } from '~/components/GameImage'

interface Props {
  item: GameObject
}

interface RangePanelProps {
  fallback: () => string
  format: (range: string) => string
  maximum: number
  minimum: number
}

interface TagsPanelProps {
  tags: Array<string>
}

function TagPanel(props: TagsPanelProps): JSX.Element {
  return (
    <div>
      <Show when={props.tags.length > 0}>
        <Index each={props.tags}>{tag => <span class="text-gray-300">{tag()}</span>}</Index>
      </Show>
    </div>
  )
}

function RangePanel(props: RangePanelProps): JSX.Element {
  return (
    <div>
      <Show
        when={props.maximum > 0 && props.minimum > 0}
        fallback={<span>{props.fallback()}</span>}
      >
        <Switch>
          <Match when={props.maximum > props.minimum}>
            <span>{props.format(`${props.minimum} ~ ${props.maximum}`)}</span>
          </Match>
          <Match when={props.maximum <= props.minimum}>
            <span>{props.format(`${props.minimum}`)}</span>
          </Match>
        </Switch>
      </Show>
    </div>
  )
}

export function GameDetail(props: Props): JSX.Element {
  return (
    <div class="max-h-screen sm:max-h-96 w-full overflow-y-auto px-4 pb-4 text-gray-100">
      <h2 class="overflow-hidden overflow-ellipsis whitespace-nowrap text-xl font-bold">
        {props.item.name}
      </h2>
      <h3 class="overflow-hidden overflow-ellipsis whitespace-nowrap text-gray-300">
        {props.item.originalName}
      </h3>
      <div class="flex flex-row gap-4 pt-2 pb-4">
        <div class="relative shrink-0 basis-5/12">
          <figure class="pb-[125%]">
            <GameImage item={props.item} />
          </figure>
        </div>
        <div class="flex flex-col">
          <div>
            <TagPanel tags={props.item.types} />
            <RangePanel
              fallback={() => '玩家人數: 未知'}
              format={range => `玩家人數: ${range} 人`}
              minimum={props.item.minimalPlayers}
              maximum={props.item.maximalPlayers}
            />
            <RangePanel
              fallback={() => '遊戲時間: 未知'}
              format={range => `遊戲時間: ${range} 分鐘`}
              minimum={props.item.minimalMinutes}
              maximum={props.item.maximalMinutes}
            />
          </div>
          <Show when={props.item.description}>
            <p class="mt-2 border-t border-gray-500 pt-2">{props.item.description}</p>
          </Show>
          <div class="mt-auto">
            <TagPanel tags={props.item.tags} />
          </div>
        </div>
      </div>
    </div>
  )
}
