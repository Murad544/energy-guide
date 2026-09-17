import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { translateArticleWithGemini } from './gemini';

const models = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
];
const raw = {
  title: 'Solar news',
  snippet: 'New solar panels',
  link: 'https://example.com/news',
  sourceName: 'Example',
};
const translated = {
  title: 'Günəş xəbərləri',
  excerpt: 'Yeni günəş panelləri',
  paragraphs: ['Yeni günəş panelləri hazırlanıb.'],
};
const fetchMock = vi.fn<typeof fetch>();
function success() {
  return new Response(
    JSON.stringify({
      candidates: [
        { content: { parts: [{ text: JSON.stringify(translated) }] } },
      ],
    }),
    { status: 200 },
  );
}
function limited() {
  return new Response(
    JSON.stringify({ error: { status: 'RESOURCE_EXHAUSTED' } }),
    { status: 429 },
  );
}
function requestedModels() {
  return fetchMock.mock.calls.map(
    ([url]) => String(url).match(/models\/([^:]+):/)?.[1],
  );
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

it.each(models.map((model, index) => ({ model, index })))(
  'reaches $model after stronger models hit limits and stops on success',
  async ({ index }) => {
    for (let i = 0; i < index; i++) fetchMock.mockResolvedValueOnce(limited());
    fetchMock.mockResolvedValueOnce(success());

    const result = await translateArticleWithGemini(raw, 'test-key');

    expect(requestedModels()).toEqual(models.slice(0, index + 1));
    expect(result.title).toBe(translated.title);
    expect(result.sourceUrl).toBe(raw.link);
    expect(result.contentJson.type).toBe('doc');
    const bodies = fetchMock.mock.calls.map(([, options]) =>
      JSON.parse(options?.body as string),
    );
    expect(
      bodies.every(
        (body) => JSON.stringify(body) === JSON.stringify(bodies[0]),
      ),
    ).toBe(true);
  },
);

it('preserves the draft fallback after every model hits its limit', async () => {
  fetchMock.mockImplementation(async () => limited());
  const result = await translateArticleWithGemini(raw, 'test-key');
  expect(requestedModels()).toEqual(models);
  expect(result.title).toBe('[Qaralama] Solar news');
});

it('continues past an unavailable model', async () => {
  fetchMock.mockResolvedValueOnce(new Response('Not found', { status: 404 }));
  fetchMock.mockResolvedValueOnce(success());
  expect((await translateArticleWithGemini(raw, 'test-key')).title).toBe(
    translated.title,
  );
  expect(requestedModels()).toEqual(models.slice(0, 2));
});

it('makes no API requests without a key', async () => {
  vi.stubEnv('GEMINI_API_KEY', '');
  expect((await translateArticleWithGemini(raw)).title).toBe(
    '[Qaralama] Solar news',
  );
  expect(fetchMock).not.toHaveBeenCalled();
});
