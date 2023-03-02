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
      <Body class="flex h-screen flex-col">
        <header class="mb-2">
          <div class="container mx-auto py-8">
            <h1 class="text-5xl font-bold">Board Game Gallery</h1>
          </div>
        </header>

        <main class="mb-2">
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

        <footer class="footer footer-center mt-auto bg-base-300 p-4">
          <div class="container mx-auto">
            <p>
              Made with <span class="text-red-600">♥</span> by{' '}
              <a class="link link-hover" href="https://progamesigner.com">progamesigner</a>.
            </p>
          </div>
        </footer>

        <Scripts />
      </Body>
    </Html>
  )
}
