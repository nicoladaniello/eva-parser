import Eva from "../Eva";
import parser from "../parser";

describe("Eva", () => {
  const eva = new Eva();

  it("shoud evaluate for loops", () => {
    const exp = parser.parse(`
      (begin

        (var y 0)
        
        (for (var x 0) (< x 10) (++ x) (set y (+ y x)) )

        y
      )
    `);

    expect(eva.eval(exp)).toBe(45);
  });
});
