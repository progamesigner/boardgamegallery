import { lazy, Suspense } from 'solid-js'
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

const Header = lazy(async () => {
  const module = await import('~/components/Header')
  return { default: module.Header }
})

const Footer = lazy(async () => {
  const module = await import('~/components/Footer')
  return { default: module.Footer }
})

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
          <div class="container mx-auto">
            <Suspense>
              <ErrorBoundary>
                <Header />
              </ErrorBoundary>
            </Suspense>
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
            <Suspense>
              <ErrorBoundary>
                <Footer />
              </ErrorBoundary>
            </Suspense>
          </div>
        </footer>

        <Scripts />
      </Body>
    </Html>
  )
}
