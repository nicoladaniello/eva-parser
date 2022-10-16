import Eva from "../Eva";
import { evalGlobal } from "./utils";

describe("Eva", () => {
  const eva = new Eva();

  it("should evaluate user defined functions", () => {
    const exp = `
        (def square (x)
            (* x x))

        (square 2)
    `;

    expect(evalGlobal(exp, eva)).toBe(4);
  });

  it("should evaluate functions with complex bodies", () => {
    const exp = `
        (def calc (x y)
            (begin
                (var z 30)
                (+ (* x y) z)
            ))

        (calc 10 20)
    `;

    expect(evalGlobal(exp, eva)).toBe(230);
  });

  it("should evaluate closures", () => {
    const exp = `
        (var value 100)
        
        (def calc (x y)
            (begin
                (var z (+ x y))
                
                (def inner (foo)
                    (+ (+ foo z) value))

                inner
            ))

        (var fn (calc 10 20))

        (fn 30)
    `;

    expect(evalGlobal(exp, eva)).toBe(160);
  });
});
