import type { JSX } from 'solid-js'

import type { Game } from '~/types'

import { createSignal, Index, onMount, Show } from 'solid-js'
import { Portal } from 'solid-js/web'

import { GameDetail } from '~/components/GameDetail'
import { GameItem } from '~/components/GameItem'
import { Modal, ModalClose, ModalTrigger } from '~/components/Modal'

export default function (): JSX.Element {
  const [getError, setError] = createSignal<boolean>(false)
  const [getLoading, setLoading] = createSignal<boolean>(true)
  const [getGames, setGames] = createSignal<Array<Game>>([])

  onMount(async () => {
    try {
      const response = await fetch('/api/notion')
      if (response.ok) {
        const games = await response.json()
        setGames(games)
        setError(false)
      } else {
        setError(true)
      }
    } catch (error) {
      setError(true)
      console.log(error)
    } finally {
      setLoading(false)
    }
  })

  return (
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Show when={!getError()} fallback={<div>Error ...</div>}>
        <Index
          each={getGames()}
          fallback={
            <Show when={getLoading()} fallback={<div>No Data ...</div>}>
              <div>Loading...</div>
            </Show>
          }
        >
          {item => (
            <>
              <ModalTrigger id={`modal-${item().id}`}>
                <GameItem item={item()} />
              </ModalTrigger>
              <Portal>
                <Modal
                  id={`modal-${item().id}`}
                  topbar={
                    <ModalClose id={`modal-${item().id}`}>
                      <a href="#" class="pr-4 text-gray-100">
                        BGG
                      </a>
                    </ModalClose>
                  }
                >
                  <GameDetail item={item()} />
                </Modal>
              </Portal>
            </>
          )}
        </Index>
      </Show>
    </div>
  )
}
