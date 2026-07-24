import { TokenA, getExecCount } from "lib-l";

export function register() {
  globalThis.__TOKEN_FROM_INSTRUMENTATION = new TokenA();
  console.log(
    `[instrumentation] created a TokenA, lib-l exec count=${getExecCount()}`
  );
}
