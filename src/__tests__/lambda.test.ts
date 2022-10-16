import { evalGlobal } from "./utils";
import Eva from "../Eva";

describe("Eva", () => {
  const eva = new Eva();

  it("should evaluate lambda expression", () => {
    const exp = `
      (def onClick(callback)
          (begin
              (var x 10)
              (var y 20)
              (callback (+ x y))
          )
      )
      
      (onClick (lambda (data) (* data 10)))
    `;

    expect(evalGlobal(exp, eva)).toBe(300);
  });

  it("should evaluate IILE", () => {
    const exp = `
        ((lambda (x) (* x x)) 2)
    `;

    expect(evalGlobal(exp, eva)).toBe(4);
  });
});
