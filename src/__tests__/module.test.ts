import parser from "../parser";
import Eva from "../Eva";

describe("Eva", () => {
  const eva = new Eva();

  const module = `
    (module Math
        (begin
            
            (def abs (value)
                (if (< value 0)
                    (- value)
                    (value))
            )

            (def square (value)
                (* value value)
            )

            (var PI 31415)
        )
    )
  `;

  it("should evaluate module methods", () => {
    const exp = parser.parse(`
        (begin
            ${module}
            ((prop Math abs) (- 10))
        )
    `);
    expect(eva.evalGlobal(exp)).toBe(10);
  });

  it("should assign module method to variable", () => {
    const exp = parser.parse(`
        (begin
            ${module}
            (var abs (prop Math abs))
            (abs (- 10))
        )
    `);
    expect(eva.evalGlobal(exp)).toBe(10);
  });

  it("should evaluate module constants", () => {
    const exp = parser.parse(`
        (begin
            ${module}
            (prop Math PI)
        )
    `);
    expect(eva.evalGlobal(exp)).toBe(31415);
  });
});
