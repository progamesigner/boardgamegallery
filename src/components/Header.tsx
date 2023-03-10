import type { JSX } from 'solid-js'

import { Portal } from 'solid-js/web'
import { Title, useLocation } from 'solid-start'

import { Modal, ModalClose, ModalTrigger } from '~/components/Modal'

import { create } from 'qrcode'

function makeSVGPath(data: Uint8Array, size: number, margin = 0): string {
  let moveBy = 0 // @note: number of masked modules
  let skipBy = 0 // @note: number of non-masked modules
  let startRow = false // @note: should start as new row

  const operations: Array<string> = []
  for (let index = 0; index < data.length; ++index) {
    const x = Math.floor(index % size)
    const y = Math.floor(index / size)
    if (x === 0 && !startRow) {
      startRow = true
    }
    if (data[index]) {
      moveBy++
      if (startRow) {
        operations.push(`M${x + margin} ${0.5 + y + margin}`)
        startRow = false
      } else {
        operations.push(`m${skipBy} 0`)
      }
      if (x + 1 === size || !data[index + 1]) {
        operations.push(`h${moveBy}`)
        moveBy = 0
      }
      skipBy = 0
    } else {
      skipBy++
    }
  }
  return operations.join('')
}

function usePageURL(): string {
  const { pathname, search } = useLocation()

  if (APP_BASE_URL) {
    return `${APP_BASE_URL}${pathname}${search}`
  }

  if (import.meta.env.SSR) {
    return `${pathname}${search}`
  }

  return `${window.location.origin}${pathname}${search}`
}

export function Header(): JSX.Element {
  const url = usePageURL()
  const qrcode = create(url, {})
  const path = makeSVGPath(qrcode.modules.data, qrcode.modules.size)

  return (
    <>
      <Title>桌遊清單</Title>

      <div class="flex py-8 px-2">
        <div class="mr-auto">
          <h1 class="text-5xl font-bold">桌遊清單</h1>
        </div>
        <div class="flex gap-2">
          <ModalTrigger id="modal-qecode">
            <span class="block w-12 cursor-pointer fill-none stroke-current stroke-2">
              <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
                />
              </svg>
            </span>
          </ModalTrigger>
          <a
            class="w-12 fill-none stroke-current stroke-2"
            href="https://github.com/progamesigner/boardgamegallery"
          >
            <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
              />
            </svg>
          </a>
        </div>
      </div>

      <Portal>
        <Modal id="modal-qecode">
          <ModalClose id="modal-qecode" />
          <div class="my-8 mx-auto aspect-square max-w-xs rounded bg-white stroke-black stroke-1 p-4">
            <svg
              shape-rendering="crispEdges"
              viewBox={`0 0 ${qrcode.modules.size} ${qrcode.modules.size}`}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={path} />
            </svg>
          </div>
        </Modal>
      </Portal>
    </>
  )
}
