export type Record = { [name: string]: any };
/**
 *
 */
export default class Environment {
  public record: Record;
  private _parent: Environment | null;

  constructor(record: Record = {}, parent: Environment | null = null) {
    this.record = record;
    this._parent = parent;
  }
  /**
   * Create a variable with the given name and value.
   */
  define(name: string, value: any) {
    this.record[name] = value;
    return value;
  }

  /**
   * Update an existing variable.
   */
  assign(name: string, value: any) {
    this.resolve(name).record[name] = value;
    return value;
  }

  /**
   * Returns the value of a variable.
   * Throws a ReferenceError if the variable is not defined.
   */
  lookup(name: string) {
    return this.resolve(name).record[name];
  }

  /**
   * Returns specific environment in which a variable is defined.
   * Throws a ReferenceError if the variable is not defined.
   */
  resolve(name: string): Environment {
    if (this.record.hasOwnProperty(name)) {
      return this;
    }

    if (this._parent === null) {
      throw new ReferenceError(`Variable "${name}" is not defined.`);
    }

    return this._parent.resolve(name);
  }
}

/**
 * Default global environment
 */
export const GlobalEnvironment = new Environment({
  true: true,
  false: false,
  null: null,

  "+": (opt1: number, opt2: number) => (opt2 === null ? +opt1 : opt1 + opt2),
  "-": (opt1: number, opt2: number) => (opt2 === null ? -opt1 : opt1 - opt2),
  "*": (opt1: number, opt2: number) => opt1 * opt2,
  "/": (opt1: number, opt2: number) => opt1 / opt2,

  ">": (opt1: any, opt2: any) => opt1 > opt2,
  "<": (opt1: any, opt2: any) => opt1 < opt2,
  ">=": (opt1: any, opt2: any) => opt1 >= opt2,
  "<=": (opt1: any, opt2: any) => opt1 <= opt2,
  "=": (opt1: any, opt2: any) => opt1 === opt2,

  print: console.log,
});
