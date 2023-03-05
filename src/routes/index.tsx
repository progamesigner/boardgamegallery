import type { JSX } from 'solid-js'

import type { GameObject } from '~/types'

import { createSignal, Index, Match, onMount, Show, Switch } from 'solid-js'
import { Portal } from 'solid-js/web'
import { useSearchParams } from 'solid-start'

import { ErrorMessage } from '~/components/ErrorMessage'
import { Footer } from '~/components/Footer'
import { GameDetail } from '~/components/GameDetail'
import { GameItem } from '~/components/GameItem'
import { Header } from '~/components/Header'
import { ImageCacheProvider } from '~/components/GameImage'
import { Loading } from '~/components/Loading'
import { Modal, ModalClose, ModalTrigger } from '~/components/Modal'
import { Tag, Tags } from '~/components/Tag'

import { fetchGames } from '~/apis'

function defaultPlayers(): Array<string> {
  const players = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(players => `${players} 人`)
  return [...players, '12 人以上']
}

function defaultTimes(): Array<string> {
  const times = [15, 30, 45, 60, 90, 120, 150].map(players => `${players} 分鐘`)
  return ['15 分鐘以內', ...times, '150 分鐘以上']
}

function processTags(games: Array<GameObject>): Array<string> {
  const tags = new Set<string>()
  games.forEach(game => {
    Array.prototype.concat([], game.types, game.tags).forEach(tag => tags.add(tag))
  })
  return Array.from(tags)
}

export default function (): JSX.Element {
  const [searchParams] = useSearchParams()

  const [getError, setError] = createSignal<boolean>(false)
  const [getGames, setGames] = createSignal<Array<GameObject>>([])
  const [getTags, setTags] = createSignal<Array<string>>([])
  const [getTimes] = createSignal<Array<string>>(defaultTimes())
  const [getPlayers] = createSignal<Array<string>>(defaultPlayers())
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
        setTags(processTags(games))
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
    <div class="flex h-screen flex-col">
      <header class="mb-2">
        <div class="container mx-auto">
          <Header />
          <div class="flex flex-col gap-2 px-4">
            <Tags>
              <Index each={getPlayers()}>{player => <Tag>{player()}</Tag>}</Index>
            </Tags>
            <Tags>
              <Index each={getTimes()}>{time => <Tag>{time()}</Tag>}</Index>
            </Tags>
            <Tags>
              <Show
                when={getTags().length > 0}
                fallback={
                  <Tag>
                    <Loading iconOnly={true} />
                  </Tag>
                }
              >
                <Index each={getTags()}>{tag => <Tag>{tag()}</Tag>}</Index>
              </Show>
            </Tags>
          </div>
        </div>
      </header>

      <main class="mb-2">
        <div class="container mx-auto">
          <Switch fallback={<Loading />}>
            <Match when={!getSource()}>
              <ErrorMessage>No source available ...</ErrorMessage>
            </Match>
            <Match when={getLoading()}>
              <div class="flex h-96 max-h-screen justify-center">
                <Loading />
              </div>
            </Match>
            <Match when={getError()}>
              <ErrorMessage>Error!</ErrorMessage>
            </Match>
            <Match when={!getLoading() && !getError()}>
              <div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
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
                                  class="flex flex-row items-center text-sm text-gray-100"
                                >
                                  BGG
                                  <span class="mx-1 h-4 w-4 fill-none stroke-current stroke-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                      />
                                    </svg>
                                  </span>
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
              </div>
            </Match>
          </Switch>
        </div>
      </main>

      <footer class="footer footer-center mt-auto bg-base-300 p-4">
        <div class="container mx-auto">
          <Footer />
        </div>
      </footer>
    </div>
  )
}
