import Eva from "../Eva";
import parser from "../parser";

describe("Eva", () => {
  const eva = new Eva();

  it("should assign to variable", () => {
    const exp = parser.parse(`
      (begin
        (var y 0)
        (set y (+ y 10))

        y
      )
    `);

    expect(eva.eval(exp)).toBe(10);
  });

  it("should increase variable", () => {
    const exp = parser.parse(`
      (begin
        (var y 0)
        (++ y)
        y
      )
    `);

    expect(eva.eval(exp)).toBe(1);
  });

  it("should decrease variable", () => {
    const exp = parser.parse(`
      (begin
        (var y 0)
        (-- y)
        y
      )
    `);

    expect(eva.eval(exp)).toBe(-1);
  });

  it("should add to variable", () => {
    const exp = parser.parse(`
      (begin
        (var y 0)
        (+= y 10)
        y
      )
    `);

    expect(eva.eval(exp)).toBe(10);
  });

  it("should subtract from variable", () => {
    const exp = parser.parse(`
      (begin
        (var y 0)
        (-= y 10)
        y
      )
    `);

    expect(eva.eval(exp)).toBe(-10);
  });
});
