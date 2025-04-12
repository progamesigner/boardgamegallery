import type { JSX } from 'solid-js';
import { Show } from 'solid-js';

interface Props {
  iconOnly?: boolean;
}

export function Loading(props: Props): JSX.Element {
  return (
    <>
      <button
        type="button"
        class="loading loading-sm btn-square btn"
        classList={{
          'mx-4': props.iconOnly,
        }}
      />
      <Show when={!props.iconOnly}>
        <p>載入中⋯⋯</p>
      </Show>
    </>
  );
}
