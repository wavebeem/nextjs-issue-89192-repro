# Next.js runs a shared library once per compilation graph---singletons break

Minimal reproduction for the runtime side of
https://github.com/vercel/next.js/issues/89192, specifically the question in
[this comment](https://github.com/vercel/next.js/issues/89192#issuecomment-4898840598):
if two bundles both embed module M, what prevents M's code from running twice
in the same process?

The answer ([per the maintainer](https://github.com/vercel/next.js/issues/89192#issuecomment-5062318897))
is the runtime's module-id dedup ([`runtime-utils.ts`](https://github.com/vercel/next.js/blob/canary/turbopack/crates/turbopack-ecmascript-runtime/js/src/shared/runtime/runtime-utils.ts#L614)).
This repro shows that guard only spans a single compilation graph. Next.js
compiles `instrumentation.ts`, App Router routes, and Pages Router routes as
**separate graphs**, each embedding its own copy of a shared library---and
nothing dedupes across them. One `next start` process, **three executions** of
the same module, three separate copies of its module-level state.

## The library

`lib-l` is a stand-in for any package that keeps module-level state (the AWS
SDK's exception classes, `@react-aria`'s `observerStack`, Sentry's singletons,
any `Context`/registry/cache). It's a single ESM file
([`packages/lib-l/index.js`](packages/lib-l/index.js)) that counts how many
times it runs and exports a class for `instanceof` checks:

```js
globalThis.__L_EXEC = (globalThis.__L_EXEC ?? 0) + 1;
console.log(`[lib-l] module executed, count=${globalThis.__L_EXEC}`);

export function getExecCount() {
  return globalThis.__L_EXEC;
}

export class Token {}

export function isToken(value) {
  return value instanceof Token;
}
```

The `isToken` check mirrors the AWS SDK's
`error instanceof AccessDeniedException` pattern from the original issue.

Three entry points import it:

- `instrumentation.js` --- creates a `Token` at boot
- `app/create/route.js` (App Router) --- creates a `Token` per request
- `pages/api/create.js` (Pages Router) --- creates a `Token` per request

and `app/check/route.js` (App Router) checks all three tokens with `isToken`.

## Steps to reproduce

```bash
npm install
npm run build && npm run start   # http://localhost:9030
```

Open http://localhost:9030 and click **Run the demo** --- it hits the three
routes and renders a pass/fail verdict. Or curl them directly:

```bash
curl localhost:9030/create
curl localhost:9030/api/create
curl localhost:9030/check
```

Or run it without cloning:

- **CodeSandbox** (VM sandbox via synced template):
  https://githubbox.com/wavebeem/nextjs-issue-89192-repro ---
  `.codesandbox/tasks.json` auto-installs, builds, and starts the production
  server; the `count=1/2/3` log lines show up in the task terminal and the
  preview opens the demo page.
- **GitHub Codespaces**:
  https://codespaces.new/wavebeem/nextjs-issue-89192-repro?quickstart=1 ---
  the devcontainer does the same on attach; open the forwarded port 9030.

Either way, if the server isn't running, `npm run build && npm run start`
starts it manually. Requires Node 20+ (anything that runs Next.js 16).

**Expected:** the server log shows `count=1` once, and `/check` reports
`true` for every token.

**Actual** (Next.js 16.2.11, Turbopack production build):

Server log --- one process, three executions:

```
[lib-l] module executed, count=1
[instrumentation] created a Token, lib-l exec count=1
[lib-l] module executed, count=2
[lib-l] module executed, count=3
```

`/check` --- a `Token` made by instrumentation or by the Pages Router is
**not** `instanceof Token` according to App Router code:

```json
{
  "route": "app router /check",
  "pid": 93037,
  "execCount": 3,
  "tokenFromAppIsToken": true,
  "tokenFromPagesIsToken": false,
  "tokenFromInstrumentationIsToken": false
}
```

Any library relying on a module-level singleton silently splits into three
independent instances: three registries, three class identities, three caches.

## Why the runtime guard can't catch this

The module-id dedup in `[turbopack]_runtime.js` uses a per-process
`moduleFactories`/`moduleCache`, and within one graph it works. We verified
that the *original* shape in #89192 (two App Router routes importing the same
CJS package) **is** deduplicated at runtime in `next start` on both 15.5.10
and 16.2.11: the class definition is duplicated across chunk *files*, but both
copies register under the same module id, so the second copy is dropped and
`instanceof` passes across routes.

But `instrumentation.js` and the Pages Router are compiled as separate graphs.
Instrumentation's chunk doesn't even go through the `TURBOPACK` chunk
registration---it's a plain `module.exports = [id, factory]` array
(`.next/server/chunks/instrumentation_*.js`) with lib-l's code merged directly
into its modules. The App Router's copy lives in
`.next/server/chunks/[root-of-the-server]__*.js`, and the Pages Router route
loads its own third copy. Same process, no shared module registry, so
module-id dedup never gets a chance to fire:

```bash
grep -rl "module executed" .next/server --include="*.js"
```

## Notes

- **Reproduces in dev too** (`npm run dev`): same `count=3`, same `instanceof`
  failures.
- **Reproduces on canary**: verified on `next@16.3.0-canary.94`.
- **Webpack has the same cross-graph gap** (`npm run build:webpack`): also
  `count=3`. This isn't a Turbopack regression---it's a Next.js architecture
  gap. The per-graph guard the maintainer described is real, but the "something
  that prevents running another copy of M" does not exist across
  instrumentation / App Router / Pages Router graphs in either bundler.
- **Why this often looks prod-only:** instrumentation (Sentry, OTel, APM) is
  commonly enabled only in production, so the second copy of the library only
  appears there---matching reports of `instanceof`/singleton failures that
  never reproduce locally (e.g. AWS SDK clients initialized in
  instrumentation, https://github.com/getsentry/sentry-javascript/issues/19367,
  and react-aria overlay state in
  https://github.com/adobe/react-spectrum/issues/8784).

## Workaround

`serverExternalPackages` opts the package out of bundling entirely, so every
graph `require()`s the same file from `node_modules` via Node's module cache:

```js
// next.config.mjs
serverExternalPackages: ["lib-l"];
```

With that enabled, `execCount` stays `1` and every `isToken` check passes.
(This only works for real packages in `node_modules`: we verified that with a
symlinked `file:packages/lib-l` directory dependency,
`serverExternalPackages` has no effect and the count stays 3---which is why
this repo installs lib-l from a packed tarball instead.)

## Versions

- next 16.2.11 (also verified on 16.3.0-canary.94), react 19.2.8
- `lib-l` is installed from a packed tarball (`packages/lib-l-1.0.0.tgz`) so
  it's a real copy in `node_modules`, like any npm dependency. If you edit
  `packages/lib-l`, re-run:
  `(cd packages/lib-l && npm pack --pack-destination ..) && npm i`
