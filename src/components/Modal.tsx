import type { JSX, ParentProps } from 'solid-js'

interface Props extends ParentProps {
  id: string
}

export function Modal(props: Props): JSX.Element {
  return (
    <>
      <input type="checkbox" id={props.id} class="modal-toggle" />
      <label
        for={props.id}
        class="modal flex cursor-pointer items-end justify-center bg-black/90 transition-opacity sm:items-center"
      >
        <label class="relative max-h-screen w-full cursor-auto overflow-hidden rounded bg-gray-700 sm:max-w-xl">
          {props.children}
        </label>
      </label>
    </>
  )
}

export function ModalClose(props: Props): JSX.Element {
  return (
    <div class="m-2 flex items-center justify-end">
      {props.children}
      <label
        for={props.id}
        class="btn-circle btn flex cursor-pointer items-center justify-center rounded-full p-2 text-gray-100 hover:bg-gray-900"
      >
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
  )
}

export function ModalTrigger(props: Props): JSX.Element {
  return <label for={props.id}>{props.children}</label>
}
