import Environment, { GlobalEnvironment } from "./Environment";
import Transformer from "./transform/Transformer";

export type UserFunctionDeclaration = {
  params: string[];
  body: any;
  env: Environment;
};

/**
 * Eva interpreter
 */
export default class Eva {
  public readonly global: Environment;
  private readonly _transformer: Transformer;

  constructor(env = GlobalEnvironment) {
    this.global = env;
    this._transformer = new Transformer();
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

    // Variable increment

    if (exp[0] === "++") {
      const varExp = this._transformer.transformIncToSet(exp);
      return this.eval(varExp, env);
    }

    // Variable addition

    if (exp[0] === "+=") {
      const varExp = this._transformer.transformPlusEqualToSet(exp);
      return this.eval(varExp, env);
    }

    // Variable decrement

    if (exp[0] === "--") {
      const varExp = this._transformer.transformDecToSet(exp);
      return this.eval(varExp, env);
    }

    // Variable subtraction

    if (exp[0] === "-=") {
      const varExp = this._transformer.transformMinusEqualToSet(exp);
      return this.eval(varExp, env);
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

    // Function declaration

    if (exp[0] === "def") {
      // JIT transpile to a variable declaration.
      const varExp = this._transformer.transformDefToVarLambda(exp);
      return this.eval(varExp, env);
    }

    // Switch statement

    if (exp[0] === "switch") {
      const ifExp = this._transformer.transformSwitchToIf(exp);
      return this.eval(ifExp, env);
    }

    // For loop

    if (exp[0] === "for") {
      const ifExp = this._transformer.transformForToWhile(exp);
      return this.eval(ifExp, env);
    }

    // Lambda functions

    if (exp[0] === "lambda") {
      const [_tag, params, body] = exp;

      return {
        params,
        body,
        env, // Closure!
      } as UserFunctionDeclaration;
    }

    // Function calls

    if (Array.isArray(exp)) {
      const fn = this.eval(exp[0], env);
      const args = exp.slice(1).map((arg) => this.eval(arg, env));

      // Native functions

      if (typeof fn === "function") {
        return fn(...args);
      }

      // User-defined functions

      const activationRecord: Record<string, any> = {};

      (fn as UserFunctionDeclaration).params.forEach((param, index) => {
        activationRecord[param] = args[index];
      });

      const activationEnv = new Environment(
        activationRecord,
        fn.env // Static scope
      );

      return this._evalBody(fn.body, activationEnv);
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }

  /**
   * Helper function to evaluate function bodies.
   */
  private _evalBody(body: any, env: Environment) {
    if (body[0] === "begin") {
      return this._evalBlock(body, env);
    }
    return this.eval(body, env);
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
