import Eva from "../Eva";
import { evalGlobal } from "./utils";

describe("Eva", () => {
  const eva = new Eva();

  it("shoud evaluate for loops", () => {
    const exp = `
      (var y 0)

      (for (var x 0) (< x 10) (++ x) 
        (set y (+ y x))
      )

      y
    `;

    expect(evalGlobal(exp, eva)).toBe(45);
  });
});
