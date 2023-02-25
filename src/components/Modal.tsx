import type { JSX, ParentProps } from 'solid-js'

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
    <div class="pointer-events-none fixed inset-0">
      <input type="checkbox" id={props.id} class="peer h-0 w-0 appearance-none opacity-0" />
      <label
        for={props.id}
        class="pointer-events-auto invisible absolute inset-0 flex cursor-pointer items-end justify-center bg-black/75 opacity-0 peer-checked:visible peer-checked:opacity-100 sm:items-center"
      >
        <label class="relative mx-4 w-full max-w-none rounded bg-gray-600 p-4 sm:w-11/12 sm:max-w-lg sm:px-6">
          <div class="cursor-auto pb-4 text-right">
            {props.links
              ? props.links.map(link => (
                  <a href={link.url} class="pr-4 text-gray-100">
                    {link.text}
                  </a>
                ))
              : null}
            <label for={props.id} class="cursor-pointer text-gray-100">
              ✕
            </label>
          </div>
          <div class="cursor-auto">{props.children}</div>
        </label>
      </label>
    </div>
  )
}

export function ModalTrigger(props: Props): JSX.Element {
  return <label for={props.id}>{props.children}</label>
}
