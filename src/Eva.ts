import { isStringLiteral } from "@babel/types";

/**
 * Eva interpreter
 */
export default class Eva {
  eval(exp: any): any {
    if (isNumber(exp)) {
      return exp;
    }

    if (isString(exp)) {
      return String(exp).slice(1, -1);
    }

    if (exp[0] === "+") {
      return this.eval(exp[1]) + this.eval(exp[2]);
    }

    throw "Unimplemented";
  }
}

function isNumber(exp: any) {
  return typeof exp === "number";
}

function isString(exp: any) {
  return typeof exp === "string" && exp.startsWith('"') && exp.endsWith('"');
}
