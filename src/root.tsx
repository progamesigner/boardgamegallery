import { Suspense } from 'solid-js'
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title,
} from 'solid-start'

import './root.css'

export default function Root() {
  return (
    <Html lang="en" class="bg-gray-900 text-gray-100">
      <Head>
        <Title>Board Game Gallery</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta name="description" content="Board Game Gallery" />
        <Link rel="apple-touch-icon" type="image/png" href="/apple-touch-icon.png" />
        <Link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  )
}
