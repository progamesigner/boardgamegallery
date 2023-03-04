import type { JSX } from 'solid-js'

import type { GameObject } from '~/types'

import { createSignal, Index, Match, onMount, Show, Switch } from 'solid-js'
import { Portal } from 'solid-js/web'
import { useSearchParams } from 'solid-start'

import { fetchGames } from '~/apis'
import { ErrorMessage } from '~/components/ErrorMessage'
import { GameDetail } from '~/components/GameDetail'
import { ImageCacheProvider } from '~/components/GameImage'
import { GameItem } from '~/components/GameItem'
import { Loading } from '~/components/Loading'
import { Modal, ModalClose, ModalTrigger } from '~/components/Modal'

export default function (): JSX.Element {
  const [searchParams] = useSearchParams()

  const [getError, setError] = createSignal<boolean>(false)
  const [getGames, setGames] = createSignal<Array<GameObject>>([])
  const [getLoading, setLoading] = createSignal<boolean>(true)
  const [getSource, setSource] = createSignal<string | undefined>(
    import.meta.env.VITE_DEFAULT_STORE
  )

  if (
    import.meta.env.VITE_ENABLE_SOURCE_QUERY &&
    (searchParams.store || searchParams.source || searchParams.s)
  ) {
    setSource(searchParams.store ?? searchParams.source ?? searchParams.s)
  }

  onMount(async () => {
    const source = getSource()
    if (source) {
      try {
        const games = await fetchGames(source)
        setGames(games)
        setError(false)
      } catch (error) {
        console.error(error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
  })

  return (
    <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6">
      <Switch fallback={<Loading />}>
        <Match when={!getSource()}>
          <ErrorMessage>No source available ...</ErrorMessage>
        </Match>
        <Match when={getLoading()}>
          <Loading />
        </Match>
        <Match when={getError()}>
          <ErrorMessage>Error!</ErrorMessage>
        </Match>
        <Match when={!getLoading() && !getError()}>
          <ImageCacheProvider>
            <Index each={getGames()} fallback={<ErrorMessage>No Data ...</ErrorMessage>}>
              {item => (
                <>
                  <ModalTrigger id={`modal-${item().id}`}>
                    <GameItem item={item()} />
                  </ModalTrigger>
                  <Portal>
                    <Modal id={`modal-${item().id}`}>
                      <ModalClose id={`modal-${item().id}`}>
                        <Show when={item().bggId}>
                          <a
                            href={`https://boardgamegeek.com/boardgame/${item().bggId}`}
                            class="pr-4 text-sm text-gray-100"
                          >
                            BGG
                          </a>
                        </Show>
                      </ModalClose>
                      <GameDetail item={item()} />
                    </Modal>
                  </Portal>
                </>
              )}
            </Index>
          </ImageCacheProvider>
        </Match>
      </Switch>
    </div>
  )
}
