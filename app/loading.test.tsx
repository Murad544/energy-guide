// @vitest-environment node
import { PassThrough } from "node:stream";
import { Suspense, use } from "react";
import { renderToPipeableStream } from "react-dom/server";
import { expect, it } from "vitest";
import Loading from "./loading";

it("streams the loading indicator before the server request resolves", async () => {
  let resolveRequest!: (value: string) => void;
  const request = new Promise<string>((resolve) => {
    resolveRequest = resolve;
  });
  function ServerContent() {
    return <article>{use(request)}</article>;
  }

  const output = new PassThrough();
  let html = "";
  output.on("data", (chunk) => {
    html += chunk.toString();
  });
  const firstChunk = new Promise<void>((resolve) =>
    output.once("data", () => resolve()),
  );
  const finished = new Promise<void>((resolve) => output.once("end", resolve));
  const stream = renderToPipeableStream(
    <html lang="az">
      <body>
        <header>Navigation</header>
        <main>
          <Suspense fallback={<Loading />}>
            <ServerContent />
          </Suspense>
        </main>
        <footer>Footer</footer>
      </body>
    </html>,
    {
      onShellReady() {
        stream.pipe(output);
      },
    },
  );

  try {
    await firstChunk;
    expect(html).toContain('role="status"');
    expect(html).toContain('class="page-loader"');
    expect(html).toContain("Səhifə yüklənir…");
    expect(html).not.toContain("Server response ready");

    resolveRequest("Server response ready");
    await finished;
    expect(html).toContain("Server response ready");
  } finally {
    stream.abort();
    output.destroy();
  }
});
