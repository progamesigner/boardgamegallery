import type { JSX, ParentProps } from 'solid-js'

import { Show } from 'solid-js'

export function Message(props: ParentProps): JSX.Element {
  return (
    <div class="flex h-96 max-h-screen justify-center">
      <div class="card">
        <div class="card-body flex max-h-screen flex-row items-center">
          <Show when={props.children} fallback={<p>發生未知錯誤⋯⋯</p>}>
            {props.children}
          </Show>
        </div>
      </div>
    </div>
  )
}
