import type { JSX } from 'solid-js'

import { Show } from 'solid-js'

interface Props {
  iconOnly?: boolean
}

export function Loading(props: Props): JSX.Element {
  return (
    <>
      <button class="loading btn-square btn" />
      <Show when={!props.iconOnly}>
        <p>載入中⋯⋯</p>
      </Show>
    </>
  )
}
