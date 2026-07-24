"use client";

import { useState } from "react";

const steps = [
  { path: "/create", label: "App Router route creates a Token" },
  { path: "/api/create", label: "Pages Router route creates a Token" },
  { path: "/check", label: "App Router route checks every token" },
];

function Verdict({ report }) {
  const checks = [
    {
      ok: report.execCount === 1,
      text: `lib-l executed ${report.execCount} time(s) in pid ${report.pid} (expected: 1)`,
    },
    {
      ok: report.tokenFromAppIsToken,
      text: "Token from the App Router route is instanceof Token",
    },
    {
      ok: report.tokenFromPagesIsToken,
      text: "Token from the Pages Router route is instanceof Token",
    },
    {
      ok: report.tokenFromInstrumentationIsToken,
      text: "Token from instrumentation.js is instanceof Token",
    },
  ];

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {checks.map((check) => (
        <li key={check.text}>
          {check.ok ? "✅" : "❌"} {check.text}
        </li>
      ))}
    </ul>
  );
}

export function Demo() {
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);

  async function runDemo() {
    setRunning(true);
    const next = [];
    for (const step of steps) {
      const response = await fetch(step.path);
      next.push({ ...step, data: await response.json() });
    }
    setResults(next);
    setRunning(false);
  }

  return (
    <div>
      <button
        disabled={running}
        style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}
        onClick={() => {
          void runDemo();
        }}
      >
        {running ? "Running…" : "Run the demo"}
      </button>
      {results && (
        <>
          <h2>Verdict</h2>
          <Verdict report={results.at(-1).data} />
          <h2>Raw responses</h2>
          {results.map((result) => (
            <div key={result.path}>
              <h3>
                <code>GET {result.path}</code> — {result.label}
              </h3>
              <pre
                style={{
                  background: "#f4f4f4",
                  padding: "0.75rem",
                  overflowX: "auto",
                }}
              >
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          ))}
          <p>
            The server log shows each execution as it happens:{" "}
            <code>[lib-l] module executed, count=N</code>
          </p>
        </>
      )}
    </div>
  );
}
