import { Token, getExecCount } from "lib-l";

export const dynamic = "force-dynamic";

export function GET() {
  globalThis.__TOKEN_FROM_APP = new Token();
  return Response.json({
    route: "app router /create",
    pid: process.pid,
    execCount: getExecCount(),
  });
}
