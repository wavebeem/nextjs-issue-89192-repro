import { getExecCount, isToken } from "lib-l";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    route: "/check",
    pid: process.pid,
    execCount: getExecCount(),
    tokenFromRouteIsToken: isToken(globalThis.__TOKEN_FROM_ROUTE),
    tokenFromInstrumentationIsToken: isToken(
      globalThis.__TOKEN_FROM_INSTRUMENTATION
    ),
  });
}
