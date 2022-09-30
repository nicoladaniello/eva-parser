import { isStringLiteral } from "@babel/types";
import Environment from "./Environment";

/**
 * Eva interpreter
 */
export default class Eva {
  global: Environment;

  constructor(env = new Environment()) {
    this.global = env;
  }

  eval(exp: any, env = this.global): any {
    if (isNumber(exp)) {
      return exp;
    }

    if (isString(exp)) {
      return String(exp).slice(1, -1);
    }

    // Math operations

    if (exp[0] === "+") {
      return this.eval(exp[1]) + this.eval(exp[2]);
    }

    if (exp[0] === "-") {
      return this.eval(exp[1]) - this.eval(exp[2]);
    }

    if (exp[0] === "*") {
      return this.eval(exp[1]) * this.eval(exp[2]);
    }

    if (exp[0] === "/") {
      return this.eval(exp[1]) / this.eval(exp[2]);
    }

    // Variable declarations

    if (exp[0] === "var") {
      const [_, name, value] = exp;
      return env.define(name, this.eval(value));
    }

    // Variable access

    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }
}

function isNumber(exp: any) {
  return typeof exp === "number";
}

function isString(exp: any) {
  return typeof exp === "string" && exp.startsWith('"') && exp.endsWith('"');
}

function isVariableName(exp: any) {
  return typeof exp === "string" && /^[a-zA-Z][a-zA-Z_]*$/.test(exp);
}
