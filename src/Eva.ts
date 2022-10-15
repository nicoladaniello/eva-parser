import Environment, { GlobalEnvironment } from "./Environment";
import Transformer from "./transform/Transformer";
import parser from "./parser";
import * as fs from "fs";

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

  /**
   * Evaluates global code wrapper into a block.
   */
  evalGlobal(exp: any) {
    return this._evalBody(exp, this.global);
  }

  /**
   * Evaluates an expression in the given environment.
   */
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
      const [_, ref, value] = exp;

      // Assignment to a property

      if (ref[0] === "prop") {
        const [_tag, instance, propName] = ref;
        const instanceEnv: Environment = this.eval(instance, env);

        return instanceEnv.define(propName, this.eval(value, env));
      }

      // Simple assignment

      return env.assign(ref, this.eval(value, env));
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

    // Class declaration

    if (exp[0] === "class") {
      const [_tag, name, parent, body] = exp;
      const parentEnv = this.eval(parent, env) || env;
      const classEnv = new Environment({}, parentEnv);

      this._evalBody(body, classEnv);

      return env.define(name, classEnv);
    }

    // Super expression

    if (exp[0] === "super") {
      const [_tag, className] = exp;
      return this.eval(className, env).parent;
    }

    // Class instantiation

    if (exp[0] === "new") {
      const classEnv = this.eval(exp[1], env);
      const instanceEnv = new Environment({}, classEnv);
      const args = exp.slice(2).map((arg: any) => this.eval(arg, env));

      this._callUserDefinedFunction(classEnv.lookup("constructor"), [
        instanceEnv,
        ...args,
      ]);

      return instanceEnv;
    }

    // Property access

    if (exp[0] === "prop") {
      const [_tag, instance, name] = exp;
      const instanceEnv: Environment = this.eval(instance, env);
      return instanceEnv.lookup(name);
    }

    // Modules
    if (exp[0] === "module") {
      const [_tag, name, body] = exp;
      const moduleEnv = new Environment({}, env);
      this._evalBody(body, moduleEnv);
      return env.define(name, moduleEnv);
    }

    // Imports
    if (exp[0] === "import") {
      const [_tag, name] = exp;

      const moduleSrc = fs.readFileSync(`${__dirname}/modules/${name}.eva`, "utf-8");
      const body = parser.parse(`(begin ${moduleSrc})`);
      const moduleExp = ["module", name, body];

      return this.eval(moduleExp, this.global);
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

      return this._callUserDefinedFunction(fn, args);
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }

  /**
   * Helper function to run user defined functions.
   */
  private _callUserDefinedFunction(fn: UserFunctionDeclaration, args: any[]) {
    const activationRecord: Record<string, any> = {};

    fn.params.forEach((param, index) => {
      activationRecord[param] = args[index];
    });

    const activationEnv = new Environment(
      activationRecord,
      fn.env // Static scope
    );

    return this._evalBody(fn.body, activationEnv);
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
