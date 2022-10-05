import Eva from "../Eva";
import parser from "../../parser";

describe("Eva", () => {
  const eva = new Eva();

  it("should evaluate user defined functions", () => {
    const exp = parser.parse(`
        (begin
            (def square (x)
                (* x x)
            )

            (square 2)
        )
    `);

    expect(eva.eval(exp)).toBe(4);
  });
});
