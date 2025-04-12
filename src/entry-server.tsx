// @refresh reload

import { StartServer, createHandler } from '@solidjs/start/server';

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Board Game Gallery" />
          <link
            rel="apple-touch-icon"
            type="image/png"
            href="/apple-touch-icon.png"
          />
          <link rel="icon" type="image/png" href="/favicon.png" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body class="bg-gray-900 text-gray-100">
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
