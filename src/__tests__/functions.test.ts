import Eva from "../Eva";
import parser from "../../parser";

describe("Eva", () => {
  const eva = new Eva();

  it("should evaluate user defined functions", () => {
    const exp = parser.parse(`
        (begin
            (def square (x)
                (* x x))

            (square 2)
        )
    `);

    expect(eva.eval(exp)).toBe(4);
  });

  it("should evaluate functions with complex bodies", () => {
    const exp = parser.parse(`
        (begin
            (def calc (x y)
                (begin
                    (var z 30)
                    (+ (* x y) z)
                ))

            (calc 10 20)
        )
    `);

    expect(eva.eval(exp)).toBe(230);
  });

  it("should evaluate closures", () => {
    const exp = parser.parse(`
        (begin
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
        )
    `);

    expect(eva.eval(exp)).toBe(160);
  });
});
