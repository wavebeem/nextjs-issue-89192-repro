import { Token, getExecCount } from "lib-l";

export function register() {
  globalThis.__TOKEN_FROM_INSTRUMENTATION = new Token();
  console.log(
    `[instrumentation] created a Token, lib-l exec count=${getExecCount()}`
  );
}
