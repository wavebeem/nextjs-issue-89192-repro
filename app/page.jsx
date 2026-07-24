import { Demo } from "../components/Demo";

export default function HomePage() {
  return (
    <main style={{ maxWidth: "48rem" }}>
      <h1>Next.js runs a shared library once per compilation graph</h1>
      <p>
        <code>lib-l</code> keeps module-level state (an execution counter and a{" "}
        <code>Token</code> class). It is imported by both{" "}
        <code>instrumentation.js</code> and a route handler (
        <code>/create</code>). Those are separate compilation graphs, each
        embeds its own copy of the library, and nothing dedupes them at runtime
        — so in a single server process the module executes twice and{" "}
        <code>instanceof</code> breaks across graphs.
      </p>
      <Demo />
    </main>
  );
}
