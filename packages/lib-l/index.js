globalThis.__L_EXEC = (globalThis.__L_EXEC ?? 0) + 1;
console.log(`[lib-l] module executed, count=${globalThis.__L_EXEC}`);

export function getExecCount() {
  return globalThis.__L_EXEC;
}

export class Token {}

export function isToken(value) {
  return value instanceof Token;
}
