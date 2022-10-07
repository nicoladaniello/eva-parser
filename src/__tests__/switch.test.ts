import parser from "../parser";
import Eva from "../Eva";

describe("Eva", () => {
  const eva = new Eva();

  it("should evaluate switch statement", () => {
    const exp = parser.parse(`
        (begin

            (var x 10)
            
            (switch 
                ((= x 10) 100)
                ((> x 10) 200)
                (else 300)
            )
        )
    `);

    expect(eva.eval(exp)).toBe(100);
  });
});
