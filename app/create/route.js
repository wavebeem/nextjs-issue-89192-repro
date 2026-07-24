import { Token, getExecCount } from "lib-l";

export const dynamic = "force-dynamic";

export function GET() {
  globalThis.__TOKEN_FROM_ROUTE = new Token();
  return Response.json({
    route: "/create",
    pid: process.pid,
    execCount: getExecCount(),
  });
}
