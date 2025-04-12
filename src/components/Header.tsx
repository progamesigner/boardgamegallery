import { Meta, Title } from '@solidjs/meta';
import { useLocation } from '@solidjs/router';
import { create } from 'qrcode';
import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { Modal, ModalClose, ModalTrigger } from '~/components/Modal';

function makeSVGPath(data: Uint8Array, size: number, margin = 0): string {
  let moveBy = 0; // @note: number of masked modules
  let skipBy = 0; // @note: number of non-masked modules
  let startRow = false; // @note: should start as new row

  const operations: string[] = [];
  for (let index = 0; index < data.length; ++index) {
    const x = Math.floor(index % size);
    const y = Math.floor(index / size);
    if (x === 0 && !startRow) {
      startRow = true;
    }
    if (data[index]) {
      moveBy++;
      if (startRow) {
        operations.push(`M${x + margin} ${0.5 + y + margin}`);
        startRow = false;
      } else {
        operations.push(`m${skipBy} 0`);
      }
      if (x + 1 === size || !data[index + 1]) {
        operations.push(`h${moveBy}`);
        moveBy = 0;
      }
      skipBy = 0;
    } else {
      skipBy++;
    }
  }
  return operations.join('');
}

function usePageURL(): string {
  const { pathname, search } = useLocation();

  if (import.meta.env.SSR) {
    return `${pathname}${search}`;
  }

  return `${window.location.origin}${pathname}${search}`;
}

export function Header(): JSX.Element {
  const url = usePageURL();
  const qrcode = create(url, {});
  const path = makeSVGPath(qrcode.modules.data, qrcode.modules.size);

  return (
    <>
      <Title>桌遊清單</Title>
      <Meta name="description" content="桌遊清單展示頁面" />

      <div class="flex px-2 py-8">
        <div class="mr-auto">
          <h1 class="font-bold text-5xl">桌遊清單</h1>
        </div>
        <div class="flex gap-2">
          <ModalTrigger id="modal-qecode">
            <span class="block w-12 cursor-pointer fill-none stroke-2 stroke-current">
              <svg
                class="h-full w-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <title>QR Code</title>
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
            class="w-12 fill-none stroke-2 stroke-current"
            href="https://github.com/progamesigner/boardgamegallery"
          >
            <svg
              class="h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <title>GitHub</title>
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
          <div class="mx-auto my-8 aspect-square max-w-xs rounded bg-white stroke-1 stroke-black p-4">
            <svg
              shape-rendering="crispEdges"
              viewBox={`0 0 ${qrcode.modules.size} ${qrcode.modules.size}`}
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>QR Code</title>
              <path d={path} />
            </svg>
          </div>
        </Modal>
      </Portal>
    </>
  );
}
