import type { JSX, ParentProps } from 'solid-js'

import type { Props as HeaderProps } from '~/components/Header'

import { Body } from '~/components/Body'
import { Footer } from '~/components/Footer'
import { Header } from '~/components/Header'

export interface Props extends HeaderProps, ParentProps {}

export function Page(props: Props): JSX.Element {
  return (
    <>
      <Header title={props.title} />
      <Body>{props.children}</Body>
      <Footer />
    </>
  )
}
