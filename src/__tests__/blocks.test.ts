import Eva from "../Eva";
import { evalGlobal } from "./utils";

describe("Eva", () => {
  const eva = new Eva();

  it("should evaluate block scopes", () => {
    const exp = `
      (begin
        (var x 10)  
        (var y 20)  
        (+ (* x y) 30)  
      )
    `;

    expect(evalGlobal(exp, eva)).toBe(230);
  });

  it("should evaluate nested blocks", () => {
    const exp = `
      (begin
        (var x 10)
        (begin
          (var x 20)
        )
        x  
      )
    `;

    expect(evalGlobal(exp, eva)).toBe(10);
  });

  it("should allow nested blocks to access parent scopes", () => {
    const exp = `
      (begin
        (var value 10)
        (var result (begin
          (var x (+ value 10))
          x
        ))
        result
      )
    `;

    expect(evalGlobal(exp, eva)).toBe(20);
  });

  it("should allow nested blocks to modify parent scopes", () => {
    const exp = `
      (begin
        (var data 10)
        (begin
          (set data 100)  
        )
        data
      )
    `;

    expect(evalGlobal(exp, eva)).toBe(100);
  });

  it("should allow nested blocks to modify parent scopes", () => {
    const exp = `
      (begin
        (var x 10)
        (var y 20)
        (+ (* x 10) y)
      )
    `;
    expect(evalGlobal(exp, eva)).toBe(120);
  });

  it("should throw if nested block tries to modify an undefined variable", () => {
    const exp = `
      (begin
        (begin
          (set data 100)
        )
      )
    `;

    expect(() => evalGlobal(exp, eva)).toThrowError();
  });
});
