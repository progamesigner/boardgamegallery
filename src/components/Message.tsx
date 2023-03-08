import type { JSX, ParentProps } from 'solid-js'

export function Message(props: ParentProps): JSX.Element {
  return (
    <div class="flex h-96 max-h-screen justify-center">
      <div class="card">
        <div class="card-body flex max-h-screen flex-row items-center">{props.children}</div>
      </div>
    </div>
  )
}
