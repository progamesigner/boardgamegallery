import type { JSX, ParentProps } from 'solid-js'

import { Index, Show } from 'solid-js'

export interface Link {
  text: string
  url: string
}

export interface Props extends ParentProps {
  id: string
  links?: Array<Link>
}

export function Modal(props: Props): JSX.Element {
  return (
    <>
      <input type="checkbox" id={props.id} class="modal-toggle" />
      <label
        for={props.id}
        class="modal flex cursor-pointer items-end justify-center bg-black/75 sm:items-center"
      >
        <label class="relative mx-4 w-full max-w-none cursor-auto rounded bg-gray-600 p-4 sm:w-11/12 sm:max-w-lg sm:px-6">
          <div class="flex justify-end pb-4">
            <Show when={props.links}>
              <Index each={props.links}>
                {link => (
                  <a href={link().url} class="pr-4 text-gray-100">
                    {link().text}
                  </a>
                )}
              </Index>
            </Show>
            <label for={props.id} class="btn-circle btn block h-6 w-6 cursor-pointer text-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </label>
          </div>
          <div>{props.children}</div>
        </label>
      </label>
    </>
  )
}

export function ModalTrigger(props: Props): JSX.Element {
  return <label for={props.id}>{props.children}</label>
}
