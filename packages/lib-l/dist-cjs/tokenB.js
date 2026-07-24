"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenB = exports.registerB = exports.isBaseToken = void 0;
const state_1 = require("./state");

class TokenB extends state_1.BaseToken {}
exports.TokenB = TokenB;

function registerB() {
  state_1.registry.push("B");
  return state_1.registry;
}
exports.registerB = registerB;

function isBaseToken(value) {
  return value instanceof state_1.BaseToken;
}
exports.isBaseToken = isBaseToken;
