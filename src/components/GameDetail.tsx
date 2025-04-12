import type { JSX } from 'solid-js';
import { Index, Match, Show, Switch } from 'solid-js';
import { GameImage } from '~/components/GameImage';
import { Tag, Tags } from '~/components/Tag';
import type { GameObject } from '~/types';

interface Props {
  item: GameObject;
}

interface RangePanelProps {
  fallback: () => string;
  format: (range: string) => string;
  maximum: number;
  minimum: number;
}

function RangePanel(props: RangePanelProps): JSX.Element {
  return (
    <Show
      when={props.maximum > 0 || props.minimum > 0}
      fallback={<span>{props.fallback()}</span>}
    >
      <Switch>
        <Match when={props.maximum <= 0}>
          <span>{props.format(`${props.minimum}`)}</span>
        </Match>
        <Match when={props.minimum <= 0}>
          <span>{props.format(`${props.maximum}`)}</span>
        </Match>
        <Match when={props.maximum > props.minimum}>
          <span>{props.format(`${props.minimum} ~ ${props.maximum}`)}</span>
        </Match>
        <Match when={props.maximum <= props.minimum}>
          <span>{props.format(`${props.minimum}`)}</span>
        </Match>
      </Switch>
    </Show>
  );
}

export function GameDetail(props: Props): JSX.Element {
  return (
    <div class="max-h-screen w-full overflow-y-auto px-4 pb-4 text-gray-100 sm:max-h-96">
      <h2 class="overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-xl">
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
        <div class="flex grow flex-col">
          <Tags>
            <Index each={props.item.types}>
              {(type) => <Tag>{type()}</Tag>}
            </Index>
          </Tags>
          <span class="mt-2">玩家人數</span>
          <div class="px-2 text-gray-300 text-sm">
            <RangePanel
              fallback={() => '未知'}
              format={(range) => `${range} 人`}
              minimum={props.item.minimalPlayers}
              maximum={props.item.maximalPlayers}
            />
          </div>
          <span class="mt-2">遊戲時間</span>
          <div class="px-2 text-gray-300 text-sm">
            <RangePanel
              fallback={() => '未知'}
              format={(range) => `${range} 分鐘`}
              minimum={props.item.minimalMinutes}
              maximum={props.item.maximalMinutes}
            />
          </div>
          <Show when={props.item.description}>
            <p class="mt-2 border-gray-500 border-t pt-2">
              {props.item.description}
            </p>
          </Show>
          <div class="mt-auto">
            <Tags>
              <Index each={props.item.tags}>
                {(tag) => <Tag>{tag()}</Tag>}
              </Index>
            </Tags>
          </div>
        </div>
      </div>
    </div>
  );
}
