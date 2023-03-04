import type { JSX, ParentProps } from 'solid-js'

import { Match, Switch } from 'solid-js'

export const enum TagColor {
  AMBER,
  BLUE,
  CYAN,
  GREEN,
  INDIGO,
  ORANGE,
  PINK,
  PURPLE,
  RED,
  TEAL,
  YELLOW,
}

interface Props extends ParentProps {
  color?: TagColor
}

export function Tag(props: Props): JSX.Element {
  return (
    <Switch>
      <Match when={props.color === TagColor.AMBER}>
        <span class="badge mr-2 rounded bg-amber-700 py-2 last:mr-0">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.BLUE}>
        <span class="badge mr-2 rounded bg-blue-700 py-2 last:mr-0">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.CYAN}>
        <span class="badge mr-2 rounded bg-cyan-700 py-2 last:mr-0">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.GREEN}>
        <span class="badge mr-2 rounded bg-green-700 py-2 last:mr-0">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.INDIGO}>
        <span class="badge mr-2 rounded bg-indigo-700 py-2 last:mr-0">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.ORANGE}>
        <span class="badge mr-2 rounded bg-orange-700 py-2 last:mr-0">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.PINK}>
        <span class="badge mr-2 rounded bg-pink-700 py-2 last:mr-0">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.PURPLE}>
        <span class="badge mr-2 rounded bg-purple-700 py-2 last:mr-0">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.RED}>
        <span class="badge mr-2 rounded bg-red-700 py-2 last:mr-0">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.TEAL}>
        <span class="badge mr-2 rounded bg-teal-700 py-2 last:mr-0">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.YELLOW}>
        <span class="badge mr-2 rounded bg-yellow-700 py-2 last:mr-0">{props.children}</span>
      </Match>
      <Match when={true}>
        <span class="badge mr-2 rounded bg-gray-300 py-2 last:mr-0">{props.children}</span>
      </Match>
    </Switch>
  )
}

export function Tags(props: ParentProps): JSX.Element {
  return <div>{props.children}</div>
}
