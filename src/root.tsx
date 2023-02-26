import { Suspense } from 'solid-js'
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from 'solid-start'

import './root.css'

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>Board Game Gallery</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <header>
          <div class="container mx-auto py-8">
            <h1 class="text-5xl font-bold">Board Game Gallery</h1>
          </div>
        </header>

        <main>
          <div class="container mx-auto">
            <Suspense>
              <ErrorBoundary>
                <Routes>
                  <FileRoutes />
                </Routes>
              </ErrorBoundary>
            </Suspense>
          </div>
        </main>

        <footer>
          <div class="container mx-auto max-w-xl py-8 text-center">
            Made with <span class="text-red-600">♥</span> By{' '}
            <a href="https://progamesigner.com">progamesigner</a>.
          </div>
        </footer>

        <Scripts />
      </Body>
    </Html>
  )
}
