"use client";

import { useState } from "react";

const steps = [
  { path: "/a", label: "App Router route creates a TokenA" },
  { path: "/api/p", label: "Pages Router route creates a TokenA" },
  { path: "/b", label: "App Router route checks every token" },
];

function Verdict({ report }) {
  const checks = [
    {
      ok: report.execCount === 1,
      text: `lib-l module executed ${report.execCount} time(s) in pid ${report.pid} (expected: 1)`,
    },
    {
      ok: report.tokenFromAIsBaseToken,
      text: "TokenA from the App Router route is instanceof BaseToken",
    },
    {
      ok: report.tokenFromPagesIsBaseToken,
      text: "TokenA from the Pages Router route is instanceof BaseToken",
    },
    {
      ok: report.tokenFromInstrumentationIsBaseToken,
      text: "TokenA from instrumentation.js is instanceof BaseToken",
    },
  ];

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {checks.map((check) => (
        <li key={check.text} style={{ margin: "0.25rem 0" }}>
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

  const report = results?.at(-1)?.data;

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
          <Verdict report={report} />
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
            <code>[lib-l] state module executed, count=N</code>
          </p>
        </>
      )}
    </div>
  );
}
