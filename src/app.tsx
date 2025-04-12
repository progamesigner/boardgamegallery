import { Meta, Title } from '@solidjs/meta';
import { MetaProvider } from '@solidjs/meta';
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';

import './app.css';

export default function App() {
  return (
    <MetaProvider>
      <Title>Board Game Gallery</Title>
      <Meta name="description" content="Board Game Gallery" />
      <Router root={(props) => <Suspense>{props.children}</Suspense>}>
        <FileRoutes />
      </Router>
    </MetaProvider>
  );
}
