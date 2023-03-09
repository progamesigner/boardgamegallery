import type { JSX } from 'solid-js'

import { HttpStatusCode } from 'solid-start/server'

import { Footer } from '~/components/Footer'
import { Header } from '~/components/Header'

export default function (): JSX.Element {
  return (
    <div class="flex min-h-screen flex-col">
      <HttpStatusCode code={404} />

      <header class="mb-auto">
        <div class="container mx-auto">
          <Header />
        </div>
      </header>

      <main>
        <div class="container mx-auto">
          <div class="flex flex-col items-center justify-center p-4">
            <h2 class="pb-2 text-3xl font-bold">找不到網頁</h2>
            <p class="pb-4">找不到指定的網頁，請回到首頁。</p>
            <a class="link link-hover" href={import.meta.env.BASE_URL}>
              點此回到首頁
            </a>
          </div>
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
