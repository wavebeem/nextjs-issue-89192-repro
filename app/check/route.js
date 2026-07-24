import { getExecCount, isToken } from "lib-l";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    route: "app router /check",
    pid: process.pid,
    execCount: getExecCount(),
    tokenFromAppIsToken: isToken(globalThis.__TOKEN_FROM_APP),
    tokenFromPagesIsToken: isToken(globalThis.__TOKEN_FROM_PAGES),
    tokenFromInstrumentationIsToken: isToken(
      globalThis.__TOKEN_FROM_INSTRUMENTATION
    ),
  });
}
