import type { JSX } from 'solid-js'

import type { Game } from '~/types'

import { createSignal, Index, onMount } from 'solid-js'
import { Portal } from 'solid-js/web'

import { GameDetail } from '~/components/GameDetail'
import { GameItem } from '~/components/GameItem'
import { Modal, ModalTrigger } from '~/components/Modal'
import { Page } from '~/components/Page'

export default function (): JSX.Element {
  const [getGames, setGames] = createSignal<Array<Game>>([])

  onMount(async () => {
    const response = await fetch('/api/notion')
    setGames(await response.json())
  })

  return (
    <Page title="Board Game Gallery">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Index each={getGames()} fallback={<div>Loading...</div>}>
          {item => (
            <>
              <ModalTrigger id={`modal-${item().id}`}>
                <GameItem item={item()} />
              </ModalTrigger>
              <Portal>
                <Modal id={`modal-${item().id}`}>
                  <GameDetail item={item()} />
                </Modal>
              </Portal>
            </>
          )}
        </Index>
      </div>
    </Page>
  )
}
