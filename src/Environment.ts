export type Record = { [name: string]: any };
/**
 *
 */
export default class Environment {
  private _record: Record;

  constructor(record: Record = {}) {
    this._record = record;
  }
  /**
   * Create a variable with the given name and value.
   */
  define(name: string, value: any) {
    this._record[name] = value;
    return value;
  }

  /**
   * Returns the value of a variable.
   * Throws if the variable is not defined.
   */
  lookup(name: string) {
    if (!this._record.hasOwnProperty(name)) {
      throw new ReferenceError(`Variable "${name}" is not defined.`);
    }

    return this._record[name];
  }
}
