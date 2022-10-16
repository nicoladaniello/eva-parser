import Eva from "../Eva";
import { evalGlobal } from "./utils";

describe("Eva", () => {
  const eva = new Eva();

  it("should evaluate module methods", () => {
    const exp = `
      (import Math)
      ((prop Math abs) (- 10))
    `;
    expect(evalGlobal(exp, eva)).toBe(10);
  });

  it("should assign module method to variable", () => {
    const exp = `
      (import Math)

      (var abs (prop Math abs))
      (abs (- 10))
    `;
    expect(evalGlobal(exp, eva)).toBe(10);
  });

  it("should evaluate module constants", () => {
    const exp = `
      (import Math)
      (prop Math PI)
    `;
    expect(evalGlobal(exp, eva)).toBe(31415);
  });
});
