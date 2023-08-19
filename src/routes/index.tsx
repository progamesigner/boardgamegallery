import type { JSX, Setter } from 'solid-js'

import type { GameObject } from '~/types'

import { createMemo, createSignal, Index, Match, onMount, Show, Switch } from 'solid-js'
import { Portal } from 'solid-js/web'
import { useSearchParams } from 'solid-start'

import { Footer } from '~/components/Footer'
import { GameDetail } from '~/components/GameDetail'
import { GameItem } from '~/components/GameItem'
import { Header } from '~/components/Header'
import { ImageCacheProvider } from '~/components/GameImage'
import { Loading } from '~/components/Loading'
import { Message as Message } from '~/components/Message'
import { Modal, ModalClose, ModalTrigger } from '~/components/Modal'
import { Tag, Tags } from '~/components/Tag'

import { fetchGames } from '~/apis'

enum TimeFilter {
  SUPPORT_LESS_THAN_15 = 14,
  SUPPORT_15 = 15,
  SUPPORT_30 = 30,
  SUPPORT_45 = 45,
  SUPPORT_60 = 60,
  SUPPORT_90 = 90,
  SUPPORT_120 = 120,
  SUPPORT_150 = 150,
  SUPPORT_MORE_THAN_150 = 151,
}

type Filters = TimeFilter | number | string

interface Filter<T> {
  value: T
  label: string
}

function defaultTimes(): Array<Filter<TimeFilter>> {
  return [
    { value: TimeFilter.SUPPORT_LESS_THAN_15, label: '15 分鐘以內' },
    { value: TimeFilter.SUPPORT_15, label: '15 分鐘' },
    { value: TimeFilter.SUPPORT_30, label: '30 分鐘' },
    { value: TimeFilter.SUPPORT_45, label: '45 分鐘' },
    { value: TimeFilter.SUPPORT_60, label: '60 分鐘' },
    { value: TimeFilter.SUPPORT_90, label: '90 分鐘' },
    { value: TimeFilter.SUPPORT_120, label: '120 分鐘' },
    { value: TimeFilter.SUPPORT_150, label: '150 分鐘' },
    { value: TimeFilter.SUPPORT_MORE_THAN_150, label: '150 分鐘以上' },
  ]
}

function processPlayers(games: Array<GameObject>): Array<Filter<number>> {
  const players = games.reduce(
    (players, game) => [...players, game.minimalPlayers, game.maximalPlayers],
    [] as Array<number>
  )
  const minimalPlayers = Math.max(1, Math.min(...players))
  const maximalPlayers = Math.min(12, Math.max(...players))
  return Array(maximalPlayers - minimalPlayers)
    .fill(minimalPlayers)
    .map((basePlayer, value) => ({
      label: `${basePlayer + value}人`,
      value: basePlayer + value,
    }))
    .concat({ label: `${maximalPlayers}人以上`, value: maximalPlayers })
}

function processTags(games: Array<GameObject>): Array<Filter<string>> {
  const tags = new Set<string>()
  games.forEach(game => {
    Array.prototype.concat([], game.types, game.tags).forEach(tag => tags.add(tag))
  })
  return Array.from(tags).map(value => ({ label: value, value: value }))
}

export function sortGames(games: Array<GameObject>): Array<GameObject> {
  return [...games].sort((first, second) => {
    return first.order !== second.order
      ? first.order - second.order
      : first.name.localeCompare(second.name)
  })
}

export default function (): JSX.Element {
  const [searchParams] = useSearchParams()

  const [getSource, setSource] = createSignal<string | undefined>(
    import.meta.env.VITE_DEFAULT_STORE
  )

  const [getLoading, setLoading] = createSignal<boolean>(true)
  const [getError, setError] = createSignal<boolean>(false)

  const [getFullGames, setFullGames] = createSignal<Array<GameObject>>([])

  const [getTimes] = createSignal<Array<Filter<TimeFilter>>>(defaultTimes())
  const [getPlayers, setPlayers] = createSignal<Array<Filter<number>>>([])
  const [getTags, setTags] = createSignal<Array<Filter<string>>>([])

  const [getPlayerFilters, setPlayerFilters] = createSignal<Set<number>>(new Set())
  const [getTimeFilters, setTimeFilters] = createSignal<Set<TimeFilter>>(new Set())
  const [getTagFilters, setTagFilters] = createSignal<Set<string>>(new Set())

  const getGames = createMemo(() => {
    const games = getFullGames()

    const activePlayerFilters = Array.from(getPlayerFilters())
    const activeTimeFilters = Array.from(getTimeFilters())
    const activeTagFilters = Array.from(getTagFilters())

    const maximalPlayers = Math.max(...getPlayers().map(filter => filter.value))

    return games
      .filter(
        activePlayerFilters.length > 0
          ? game =>
              activePlayerFilters.filter(value => {
                switch (value) {
                  case maximalPlayers:
                    return game.maximalPlayers >= value
                  default:
                    return game.minimalPlayers <= value && value <= game.maximalPlayers
                }
              }).length > 0
          : () => true
      )
      .filter(
        activeTimeFilters.length > 0
          ? game =>
              activeTimeFilters.filter(value => {
                switch (value) {
                  case TimeFilter.SUPPORT_LESS_THAN_15:
                    return game.minimalMinutes <= value
                  case TimeFilter.SUPPORT_MORE_THAN_150:
                    return game.maximalMinutes >= value
                  default:
                    return game.minimalMinutes <= value && value <= game.maximalMinutes
                }
              }).length > 0
          : () => true
      )
      .filter(
        activeTagFilters.length > 0
          ? game =>
              activeTagFilters.filter(value => [...game.types, ...game.tags].includes(value))
                .length > 0
          : () => true
      )
  })

  const toggleFilter = <T extends Filters>(setter: Setter<Set<T>>, filter: T) => {
    return () =>
      setter(filters => {
        const exists = filters.delete(filter)
        return exists ? new Set([...filters.values()]) : new Set([...filters.values(), filter])
      })
  }

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
        setFullGames(sortGames(games))
        setPlayers(processPlayers(games))
        setTags(processTags(games))
        setError(false)
      } catch (error) {
        console.error(error)
        setError(true)
      }
    }
    setLoading(false)
  })

  return (
    <div class="flex min-h-screen flex-col">
      <header class="mb-2">
        <div class="container mx-auto">
          <Header />
          <div class="flex flex-col gap-2 px-4">
            <Switch>
              <Match when={getLoading()}>
                <Tag>
                  <Loading iconOnly={true} />
                </Tag>
              </Match>
              <Match when={true}>
                <Tags>
                  <Index each={getPlayers()}>
                    {player => (
                      <Tag
                        active={getPlayerFilters().has(player().value)}
                        onChange={toggleFilter(setPlayerFilters, player().value)}
                      >
                        {player().label}
                      </Tag>
                    )}
                  </Index>
                </Tags>
              </Match>
            </Switch>
            <Tags>
              <Index each={getTimes()}>
                {time => (
                  <Tag
                    active={getTimeFilters().has(time().value)}
                    onChange={toggleFilter(setTimeFilters, time().value)}
                  >
                    {time().label}
                  </Tag>
                )}
              </Index>
            </Tags>
            <Switch>
              <Match when={getLoading()}>
                <Tag>
                  <Loading iconOnly={true} />
                </Tag>
              </Match>
              <Match when={true}>
                <Tags>
                  <Show when={getTags().length > 0}>
                    <Index each={getTags()}>
                      {tag => (
                        <Tag
                          active={getTagFilters().has(tag().value)}
                          onChange={toggleFilter(setTagFilters, tag().value)}
                        >
                          {tag().label}
                        </Tag>
                      )}
                    </Index>
                  </Show>
                </Tags>
              </Match>
            </Switch>
          </div>
        </div>
      </header>

      <main class="mb-2">
        <div class="container mx-auto">
          <Switch fallback={<Loading />}>
            <Match when={!getSource()}>
              <Message>沒有資料來源⋯⋯</Message>
            </Match>
            <Match when={getLoading()}>
              <Message>
                <Loading />
              </Message>
            </Match>
            <Match when={getError()}>
              <Message>發生錯誤！</Message>
            </Match>
            <Match when={!getLoading() && !getError()}>
              <div
                class="grid grid-cols-1 gap-4 p-4"
                classList={{
                  'sm:grid-cols-2': getGames().length > 0,
                  'md:grid-cols-3': getGames().length > 0,
                  'lg:grid-cols-4': getGames().length > 0,
                  '2xl:grid-cols-6': getGames().length > 0,
                }}
              >
                <ImageCacheProvider>
                  <Index each={getGames()} fallback={<Message>沒有任何資料⋯⋯</Message>}>
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
                                  <span class="mx-1 h-4 w-4 fill-none stroke-current stroke-2">
                                    <svg
                                      class="h-full w-full"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                    >
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

      <footer class="footer footer-center mt-auto bg-gray-700 p-4">
        <div class="container mx-auto">
          <Footer />
        </div>
      </footer>
    </div>
  )
}
