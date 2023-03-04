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
        <span class="badge rounded bg-amber-700 py-2">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.BLUE}>
        <span class="badge rounded bg-blue-700 py-2">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.CYAN}>
        <span class="badge rounded bg-cyan-700 py-2">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.GREEN}>
        <span class="badge rounded bg-green-700 py-2">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.INDIGO}>
        <span class="badge rounded bg-indigo-700 py-2">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.ORANGE}>
        <span class="badge rounded bg-orange-700 py-2">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.PINK}>
        <span class="badge rounded bg-pink-700 py-2">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.PURPLE}>
        <span class="badge rounded bg-purple-700 py-2">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.RED}>
        <span class="badge rounded bg-red-700 py-2">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.TEAL}>
        <span class="badge rounded bg-teal-700 py-2">{props.children}</span>
      </Match>
      <Match when={props.color === TagColor.YELLOW}>
        <span class="badge rounded bg-yellow-700 py-2">{props.children}</span>
      </Match>
      <Match when={true}>
        <span class="badge rounded bg-gray-300 py-2">{props.children}</span>
      </Match>
    </Switch>
  )
}

export function Tags(props: ParentProps): JSX.Element {
  return <div class="flex gap-2 justify-start flex-wrap">{props.children}</div>
}
