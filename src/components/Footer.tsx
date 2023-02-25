import type { JSX } from 'solid-js'

export function Footer(): JSX.Element {
  return (
    <footer>
      <div class="container mx-auto max-w-xl py-8 text-center">
        Made with <span class="text-red-600">♥</span> By{' '}
        <a href="https://progamesigner.com">progamesigner</a>.
      </div>
    </footer>
  )
}
