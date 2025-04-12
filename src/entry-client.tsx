// @refresh reload

import { StartClient, mount } from '@solidjs/start/client';

const app = window.document.getElementById('app');
if (app) {
  mount(() => <StartClient />, app);
}
