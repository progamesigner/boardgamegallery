import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { afterEach, test } from 'node:test';
import ts from 'typescript';

// Compile the route modules without starting a server or contacting Notion.
async function loadRoute(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
    },
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
  );
}

const originalEnv = { ...process.env };
afterEach(() => {
  for (const name of ['SERVER_ENABLE_NOTION_QUERY', 'SERVER_NOTION_TOKEN']) {
    setEnv(name, originalEnv[name]);
  }
});
function setEnv(name, value) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

const routes = await Promise.all([
  loadRoute('../src/routes/notion/v1/databases/[id]/query/games.ts'),
  loadRoute('../src/routes/notion/v1/blocks/[id]/children/image.ts'),
]);
const event = {
  params: { id: 'test-database' },
  request: new Request('https://example.test/notion?cursor=next-page'),
};

test('both Notion routes parse the query flag before requesting data', async (t) => {
  t.mock.method(globalThis, 'fetch', () => {
    throw new Error('Unexpected external request');
  });
  setEnv('SERVER_NOTION_TOKEN', '');
  for (const value of ['', 'false', '0', ' FALSE ', 'off', 'unexpected']) {
    setEnv('SERVER_ENABLE_NOTION_QUERY', value);
    for (const route of routes) {
      assert.equal((await route.GET(event)).status, 404, value);
    }
  }
  setEnv('SERVER_ENABLE_NOTION_QUERY', undefined);
  for (const route of routes) {
    assert.equal((await route.GET(event)).status, 404);
  }
  for (const value of ['true', '1', ' TRUE ', ' 1 ']) {
    setEnv('SERVER_ENABLE_NOTION_QUERY', value);
    for (const route of routes) {
      assert.equal((await route.GET(event)).status, 403, value);
    }
  }
});
