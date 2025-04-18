import type { JSX, ParentProps } from 'solid-js';
import { Match, Switch, createUniqueId } from 'solid-js';
import { Portal } from 'solid-js/web';

export enum TagColor {
  AMBER = 0,
  BLUE = 1,
  CYAN = 2,
  GREEN = 3,
  INDIGO = 4,
  ORANGE = 5,
  PINK = 6,
  PURPLE = 7,
  RED = 8,
  TEAL = 9,
  YELLOW = 10,
}

interface Props extends ParentProps {
  active?: boolean;
  color?: TagColor;
  onChange?: JSX.EventHandler<HTMLInputElement, Event>;
}

export function Tag(props: Props): JSX.Element {
  const key = createUniqueId();

  return (
    <Switch>
      <Match when={props.onChange}>
        <Portal>
          <input
            id={key}
            type="checkbox"
            class="fixed h-0 w-0 appearance-none opacity-0"
            onChange={(event) => props.onChange?.(event)}
          />
        </Portal>
        <label for={key} class="cursor-pointer">
          <Switch>
            <Match when={props.color === TagColor.AMBER}>
              <span
                class="badge h-6 rounded py-2"
                classList={{
                  'bg-amber-500': props.active,
                  'bg-amber-700': !props.active,
                }}
              >
                {props.children}
              </span>
            </Match>
            <Match when={props.color === TagColor.BLUE}>
              <span
                class="badge h-6 rounded py-2"
                classList={{
                  'bg-blue-500': props.active,
                  'bg-blue-700': !props.active,
                }}
              >
                {props.children}
              </span>
            </Match>
            <Match when={props.color === TagColor.CYAN}>
              <span
                class="badge h-6 rounded py-2"
                classList={{
                  'bg-cyan-500': props.active,
                  'bg-cyan-700': !props.active,
                }}
              >
                {props.children}
              </span>
            </Match>
            <Match when={props.color === TagColor.GREEN}>
              <span
                class="badge h-6 rounded py-2"
                classList={{
                  'bg-green-500': props.active,
                  'bg-green-700': !props.active,
                }}
              >
                {props.children}
              </span>
            </Match>
            <Match when={props.color === TagColor.INDIGO}>
              <span
                class="badge h-6 rounded py-2"
                classList={{
                  'bg-indigo-500': props.active,
                  'bg-indigo-700': !props.active,
                }}
              >
                {props.children}
              </span>
            </Match>
            <Match when={props.color === TagColor.ORANGE}>
              <span
                class="badge h-6 rounded py-2"
                classList={{
                  'bg-orange-500': props.active,
                  'bg-orange-700': !props.active,
                }}
              >
                {props.children}
              </span>
            </Match>
            <Match when={props.color === TagColor.PINK}>
              <span
                class="badge h-6 rounded py-2"
                classList={{
                  'bg-pink-500': props.active,
                  'bg-pink-700': !props.active,
                }}
              >
                {props.children}
              </span>
            </Match>
            <Match when={props.color === TagColor.PURPLE}>
              <span
                class="badge h-6 rounded py-2"
                classList={{
                  'bg-purple-500': props.active,
                  'bg-purple-700': !props.active,
                }}
              >
                {props.children}
              </span>
            </Match>
            <Match when={props.color === TagColor.RED}>
              <span
                class="badge h-6 rounded py-2"
                classList={{
                  'bg-red-500': props.active,
                  'bg-red-700': !props.active,
                }}
              >
                {props.children}
              </span>
            </Match>
            <Match when={props.color === TagColor.TEAL}>
              <span
                class="badge h-6 rounded py-2"
                classList={{
                  'bg-teal-500': props.active,
                  'bg-teal-700': !props.active,
                }}
              >
                {props.children}
              </span>
            </Match>
            <Match when={props.color === TagColor.YELLOW}>
              <span
                class="badge h-6 rounded py-2"
                classList={{
                  'bg-yellow-500': props.active,
                  'bg-yellow-700': !props.active,
                }}
              >
                {props.children}
              </span>
            </Match>
            <Match when={true}>
              <span
                class="badge h-6 rounded py-2"
                classList={{
                  'bg-gray-500': props.active,
                  'bg-gray-700': !props.active,
                }}
              >
                {props.children}
              </span>
            </Match>
          </Switch>
        </label>
      </Match>
      <Match when={true}>
        <Switch>
          <Match when={props.color === TagColor.AMBER}>
            <span class="badge h-6 rounded bg-amber-700 py-2">
              {props.children}
            </span>
          </Match>
          <Match when={props.color === TagColor.BLUE}>
            <span class="badge h-6 rounded bg-blue-700 py-2">
              {props.children}
            </span>
          </Match>
          <Match when={props.color === TagColor.CYAN}>
            <span class="badge h-6 rounded bg-cyan-700 py-2">
              {props.children}
            </span>
          </Match>
          <Match when={props.color === TagColor.GREEN}>
            <span class="badge h-6 rounded bg-green-700 py-2">
              {props.children}
            </span>
          </Match>
          <Match when={props.color === TagColor.INDIGO}>
            <span class="badge h-6 rounded bg-indigo-700 py-2">
              {props.children}
            </span>
          </Match>
          <Match when={props.color === TagColor.ORANGE}>
            <span class="badge h-6 rounded bg-orange-700 py-2">
              {props.children}
            </span>
          </Match>
          <Match when={props.color === TagColor.PINK}>
            <span class="badge h-6 rounded bg-pink-700 py-2">
              {props.children}
            </span>
          </Match>
          <Match when={props.color === TagColor.PURPLE}>
            <span class="badge h-6 rounded bg-purple-700 py-2">
              {props.children}
            </span>
          </Match>
          <Match when={props.color === TagColor.RED}>
            <span class="badge h-6 rounded bg-red-700 py-2">
              {props.children}
            </span>
          </Match>
          <Match when={props.color === TagColor.TEAL}>
            <span class="badge h-6 rounded bg-teal-700 py-2">
              {props.children}
            </span>
          </Match>
          <Match when={props.color === TagColor.YELLOW}>
            <span class="badge h-6 rounded bg-yellow-700 py-2">
              {props.children}
            </span>
          </Match>
          <Match when={true}>
            <span class="badge h-6 rounded bg-gray-700 py-2">
              {props.children}
            </span>
          </Match>
        </Switch>
      </Match>
    </Switch>
  );
}

export function Tags(props: ParentProps): JSX.Element {
  return <div class="flex flex-wrap justify-start gap-2">{props.children}</div>;
}
