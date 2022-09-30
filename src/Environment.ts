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
