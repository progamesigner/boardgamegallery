import type { JSX } from 'solid-js';
import { Show } from 'solid-js';
import { GameImage } from '~/components/GameImage';
import type { GameObject } from '~/types';

interface Props {
  item: GameObject;
}

export function GameItem(props: Props): JSX.Element {
  return (
    <div class="relative block cursor-pointer">
      <figure class="relative overflow-hidden rounded bg-gray-700 pb-[125%]">
        <GameImage item={props.item} />
        <figcaption class="absolute inset-x-0 bottom-0 bg-gradient-to-b from-black/50 to-gray-900/90 px-4 py-2">
          <h2 class="overflow-hidden overflow-ellipsis whitespace-nowrap font-bold text-gray-100 text-xl">
            {props.item.name}
          </h2>
        </figcaption>
      </figure>

      <Show when={props.item.label}>
        <span class="-right-2 absolute top-2 rounded bg-gray-700 px-4 py-2 text-center text-white shadow">
          {props.item.label}
        </span>
      </Show>
    </div>
  );
}
