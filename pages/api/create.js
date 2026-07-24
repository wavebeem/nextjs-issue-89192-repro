import { Token, getExecCount } from "lib-l";

export default function handler(request, response) {
  globalThis.__TOKEN_FROM_PAGES = new Token();
  response.json({
    route: "pages router /api/create",
    pid: process.pid,
    execCount: getExecCount(),
  });
}
