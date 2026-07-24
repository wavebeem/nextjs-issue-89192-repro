import { Demo } from "../components/Demo";

export default function HomePage() {
  return (
    <main style={{ maxWidth: "48rem" }}>
      <h1>Next.js runs a shared library once per compilation graph</h1>
      <p>
        <code>lib-l</code> keeps module-level state (an execution counter and a{" "}
        <code>Token</code> class). It is imported by{" "}
        <code>instrumentation.js</code>, an App Router route (
        <code>/create</code>), and a Pages Router route (
        <code>/api/create</code>). Each of those is a separate compilation
        graph, each embeds its own copy of the library, and nothing dedupes
        them at runtime — so in a single server process the module executes
        three times and <code>instanceof</code> breaks across graphs.
      </p>
      <Demo />
    </main>
  );
}
