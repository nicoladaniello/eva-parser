import parser from "../parser";
import Eva from "../Eva";

describe("Eva", () => {
  const eva = new Eva();

  it("should evaluate module methods", () => {
    const exp = parser.parse(`
        (begin
            (import Math)

            ((prop Math abs) (- 10))
        )
    `);
    expect(eva.evalGlobal(exp)).toBe(10);
  });

  it("should assign module method to variable", () => {
    const exp = parser.parse(`
        (begin
            (import Math)

            (var abs (prop Math abs))
            (abs (- 10))
        )
    `);
    expect(eva.evalGlobal(exp)).toBe(10);
  });

  it("should evaluate module constants", () => {
    const exp = parser.parse(`
        (begin
            (import Math)
            
            (prop Math PI)
        )
    `);
    expect(eva.evalGlobal(exp)).toBe(31415);
  });
});
