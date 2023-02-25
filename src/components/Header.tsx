import type { JSX } from 'solid-js'

import { Title } from 'solid-start'

export interface Props {
  title: string
}

export function Header(props: Props): JSX.Element {
  return (
    <>
      <Title>{props.title}</Title>

      <header>
        <div class="container mx-auto py-8">
          <h1 class="text-5xl font-bold">{props.title}</h1>
        </div>
      </header>
    </>
  )
}
