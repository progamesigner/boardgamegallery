import type { JSX, ParentProps } from 'solid-js'

import { Show } from 'solid-js'

export function ErrorMessage(props: ParentProps): JSX.Element {
  return (
    <div class="card">
      <div class="card-body">
        <Show when={props.children} fallback={<p>Error ...</p>}>
          {props.children}
        </Show>
      </div>
    </div>
  )
}
