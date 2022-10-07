import parser from "../../parser";
import Eva from "../Eva";

describe("Eva", () => {
  const eva = new Eva();

  it("should evaluate lambda expression", () => {
    const exp = parser.parse(`
        (begin
            (def onClick(callback)
                (begin
                    (var x 10)
                    (var y 20)
                    (callback (+ x y))
                )
            )
            
            (onClick (lambda (data) (* data 10)))
        )
    `);

    expect(eva.eval(exp)).toBe(300);
  });

  it("should evaluate IILE", () => {
    const exp = parser.parse(`
        ((lambda (x) (* x x)) 2)
    `);

    expect(eva.eval(exp)).toBe(4);
  });
});
