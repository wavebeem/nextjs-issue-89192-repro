import { TokenA, getExecCount } from "lib-l";

export const dynamic = "force-dynamic";

export function GET() {
  globalThis.__TOKEN_FROM_A = new TokenA();
  return Response.json({
    route: "a",
    pid: process.pid,
    execCount: getExecCount(),
  });
}
