import type { JSX, ParentProps } from 'solid-js'

export function Body(props: ParentProps): JSX.Element {
  return (
    <main>
      <div class="container mx-auto">{props.children}</div>
    </main>
  )
}
