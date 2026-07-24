import { getExecCount, isBaseToken } from "lib-l";

export const dynamic = "force-dynamic";

export function GET() {
  const tokenFromA = globalThis.__TOKEN_FROM_A;
  const tokenFromPages = globalThis.__TOKEN_FROM_PAGES;
  const tokenFromInstrumentation = globalThis.__TOKEN_FROM_INSTRUMENTATION;
  return Response.json({
    route: "b",
    pid: process.pid,
    execCount: getExecCount(),
    receivedTokenFromA: tokenFromA !== undefined,
    tokenFromAIsBaseToken: isBaseToken(tokenFromA),
    receivedTokenFromPages: tokenFromPages !== undefined,
    tokenFromPagesIsBaseToken: isBaseToken(tokenFromPages),
    receivedTokenFromInstrumentation: tokenFromInstrumentation !== undefined,
    tokenFromInstrumentationIsBaseToken: isBaseToken(tokenFromInstrumentation),
  });
}
