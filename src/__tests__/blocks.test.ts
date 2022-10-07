import parser from "../parser";
import Eva from "../Eva";

describe("Eva", () => {
  const eva = new Eva();

  it("should evaluate block scopes", () => {
    const exp = parser.parse(`
      (begin
        (var x 10)  
        (var y 20)  
        (+ (* x y) 30)  
      )
    `);

    expect(eva.eval(exp)).toBe(230);
  });

  it("should evaluate nested blocks", () => {
    const exp = parser.parse(`
      (begin
        (var x 10)
        (begin
          (var x 20)
        )
        x  
      )
    `);

    expect(eva.eval(exp)).toBe(10);
  });

  it("should allow nested blocks to access parent scopes", () => {
    const exp = parser.parse(`
      (begin
        (var value 10)
        (var result (begin
          (var x (+ value 10))
          x
        ))
        result
      )
    `);

    expect(eva.eval(exp)).toBe(20);
  });

  it("should allow nested blocks to modify parent scopes", () => {
    const exp = parser.parse(`
      (begin
        (var data 10)
        (begin
          (set data 100)  
        )
        data
      )
    `);

    expect(eva.eval(exp)).toBe(100);
  });

  it("should allow nested blocks to modify parent scopes", () => {
    const exp = parser.parse(`
      (begin
        (var x 10)
        (var y 20)
        (+ (* x 10) y)
      )
    `);
    expect(eva.eval(exp)).toBe(120);
  });

  it("should throw if nested block tries to modify an undefined variable", () => {
    const exp = parser.parse(`
      (begin
        (begin
          (set data 100)
        )
      )
    `);

    expect(() => eva.eval(exp)).toThrowError();
  });
});
