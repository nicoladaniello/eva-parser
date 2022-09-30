import Environment, { GlobalEnvironment } from "./Environment";

/**
 * Eva interpreter
 */
export default class Eva {
  global: Environment;

  constructor(env = GlobalEnvironment) {
    this.global = env;
  }

  eval(exp: any, env = this.global): any {
    if (isNumber(exp)) {
      return exp;
    }

    if (isString(exp)) {
      return String(exp).slice(1, -1);
    }

    // Blocks

    if (exp[0] === "begin") {
      const blockEnv = new Environment({}, env);
      return this._evalBlock(exp, blockEnv);
    }

    // Variable declarations

    if (exp[0] === "var") {
      const [_, name, value] = exp;
      return env.define(name, this.eval(value, env));
    }

    // Variable update

    if (exp[0] === "set") {
      const [_, name, value] = exp;
      return env.assign(name, this.eval(value, env));
    }

    // Variable access

    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    // If statement

    if (exp[0] === "if") {
      const [_tag, condition, consequent, alternate] = exp;

      return this.eval(condition, env)
        ? this.eval(consequent, env)
        : this.eval(alternate, env);
    }

    // While loop

    if (exp[0] === "while") {
      const [_tag, condition, body] = exp;
      let result: any = [];

      while (this.eval(condition, env)) {
        result = this.eval(body, env);
      }

      return result;
    }

    // Function calls
    if (Array.isArray(exp)) {
      const fn = this.eval(exp[0], env);
      const args = exp.slice(1).map((arg) => this.eval(arg, env));

      // Native function
      if (typeof fn === "function") {
        return fn(...args);
      }

      // User-defined functions TODO
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }

  /**
   * Helper function to evaluate nested blocks.
   */
  private _evalBlock(block: any, env: Environment) {
    let result: any;
    const [_tag, ...expressions] = block;

    expressions.forEach((exp: any) => {
      result = this.eval(exp, env);
    });

    return result;
  }
}

function isNumber(exp: any) {
  return typeof exp === "number";
}

function isString(exp: any) {
  return typeof exp === "string" && exp.startsWith('"') && exp.endsWith('"');
}

function isVariableName(exp: any) {
  return typeof exp === "string" && /^[+\-*\/<>=a-zA-Z0-9_]*$/.test(exp);
}
