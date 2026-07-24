import { TokenA, getExecCount } from "lib-l";

export default function handler(req, res) {
  globalThis.__TOKEN_FROM_PAGES = new TokenA();
  res.json({
    route: "pages/api/p",
    pid: process.pid,
    execCount: getExecCount(),
  });
}
