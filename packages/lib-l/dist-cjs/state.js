"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseToken = exports.registry = exports.getExecCount = void 0;

globalThis.__L_EXEC = (globalThis.__L_EXEC ?? 0) + 1;
console.log(`[lib-l] state module executed, count=${globalThis.__L_EXEC}`);

function getExecCount() {
  return globalThis.__L_EXEC;
}
exports.getExecCount = getExecCount;

exports.registry = [];

class BaseToken {}
exports.BaseToken = BaseToken;
