import { evalGlobal } from "./utils";
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
    const exp = `
      ${module}
      ((prop Math abs) (- 10))
    `;
    expect(evalGlobal(exp, eva)).toBe(10);
  });

  it("should assign module method to variable", () => {
    const exp = `
      ${module}
      (var abs (prop Math abs))
      (abs (- 10))
    `;
    expect(evalGlobal(exp, eva)).toBe(10);
  });

  it("should evaluate module constants", () => {
    const exp = `
      ${module}
      (prop Math PI)
    `;
    expect(evalGlobal(exp, eva)).toBe(31415);
  });
});
