import type { JSX } from 'solid-js'

import type { Game } from '~/types'

import { createEffect, createSignal, Index } from 'solid-js'

import { GameDetail } from '~/components/GameDetail'
import { GameItem } from '~/components/GameItem'
import { Modal, ModalTrigger } from '~/components/Modal'
import { Page } from '~/components/Page'

function makeSampleGame(id: number): Game {
  return {
    id: `${id + 1}`,
    name: `Game ${id + 1}`,
    originalName: `Game ${id + 1}`,
    description: `Game ${id + 1} description`,
    label: `Playable`,
    image: 'https://preview.tabler.io/static/photos/modern-home-office.jpg',
    types: ['Strategy'],
    maximalMinutes: 120,
    minimalMinutes: 60,
    minimalPlayers: 2,
    maximalPlayers: 4,
    tags: ['Tag 1', 'Tag 2', 'Tag 3'],
  }
}

export default function (): JSX.Element {
  const [getGames, setGames] = createSignal<Array<Game>>([])

  createEffect(() => {
    setGames(Array.from(Array(20).keys()).map(makeSampleGame))
  })

  return (
    <Page title="Board Game Gallery">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Index each={getGames()} fallback={<div>Loading...</div>}>
          {item => (
            <ModalTrigger id={`modal-${item().id}`}>
              <GameItem item={item()} />
            </ModalTrigger>
          )}
        </Index>
      </div>
      <Index each={getGames()}>
        {item => (
          <Modal id={`modal-${item().id}`}>
            <GameDetail item={item()} />
          </Modal>
        )}
      </Index>
    </Page>
  )
}
