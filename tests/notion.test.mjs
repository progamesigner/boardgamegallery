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
const text = (...parts) => parts.map((plain_text) => ({ plain_text }));
const property = (type, parts) => ({ type, [type]: text(...parts) });

test('Notion games retain rich text and title fields across fragments', async (t) => {
  setEnv('SERVER_ENABLE_NOTION_QUERY', 'true');
  setEnv('SERVER_NOTION_TOKEN', 'test-only-placeholder');
  const pages = [
    {
      object: 'page',
      id: 'rich-text-game',
      properties: {
        '[BGG]: INCLUDE': { type: 'checkbox', checkbox: true },
        '[BGG]: NAME': property('rich_text', ['遊戲', '名稱']),
        '[BGG]: ORIGINAL-NAME': property('title', ['Original ', 'name']),
        '[BGG]: DESCRIPTION': property('rich_text', ['First\n', 'second']),
        '[BGG]: LABEL-TEXT': property('rich_text', []),
        '[BGG]: IMAGE': property('rich_text', [
          'https://example.test/',
          'cover.png',
        ]),
        '[BGG]: TYPES': property('rich_text', ['策略,', '合作、 家庭']),
        '[BGG]: TAGS': property('title', ['卡牌 ', '派對']),
      },
    },
    {
      object: 'page',
      id: 'title-game',
      properties: {
        '[BGG]: INCLUDE': { type: 'checkbox', checkbox: true },
        '[BGG]: NAME': property('title', ['Title ', 'game']),
      },
    },
    ...['rich_text', 'title'].map((type) => ({
      object: 'page',
      id: `empty-${type}`,
      properties: {
        '[BGG]: INCLUDE': { type: 'checkbox', checkbox: true },
        '[BGG]: NAME': property(type, []),
      },
    })),
  ];
  const requests = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    requests.push({ url, options });
    return Response.json(
      requests.length === 1
        ? { data_sources: [{ id: 'test-source' }] }
        : { results: pages, next_cursor: 'following-page' },
    );
  });
  const response = await routes[0].GET(event);
  assert.equal(response.status, 200);
  const { data, cursor } = await response.json();
  assert.equal(cursor, 'following-page');
  assert.deepEqual(
    data.map((game) => game.name),
    ['遊戲名稱', 'Title game'],
  );
  assert.equal(data[0].originalName, 'Original name');
  assert.equal(data[0].description, 'First\nsecond');
  assert.equal(data[0].label, '');
  assert.equal(data[0].image, 'https://example.test/cover.png');
  assert.deepEqual(data[0].types, ['策略', '合作', '家庭']);
  assert.deepEqual(data[0].tags, ['卡牌', '派對']);
  assert.equal(requests.length, 2);
  assert.equal(
    requests[1].url,
    'https://api.notion.com/v1/data_sources/test-source/query',
  );
  assert.deepEqual(JSON.parse(requests[1].options.body), {
    start_cursor: 'next-page',
  });
});
