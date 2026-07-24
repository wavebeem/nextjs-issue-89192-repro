"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenA = exports.registerA = void 0;
const state_1 = require("./state");

class TokenA extends state_1.BaseToken {}
exports.TokenA = TokenA;

function registerA() {
  state_1.registry.push("A");
  return state_1.registry;
}
exports.registerA = registerA;
