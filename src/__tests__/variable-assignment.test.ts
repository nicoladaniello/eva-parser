import Eva from "../Eva";
import { evalGlobal } from "./utils";

describe("Eva", () => {
  const eva = new Eva();

  it("should assign to variable", () => {
    const exp = `
      (var y 0)
      (set y (+ y 10))

      y
    `;

    expect(evalGlobal(exp, eva)).toBe(10);
  });

  it("should increase variable", () => {
    const exp = `
      (var y 0)
      (++ y)
      y
    `;

    expect(evalGlobal(exp, eva)).toBe(1);
  });

  it("should decrease variable", () => {
    const exp = `
      (var y 0)
      (-- y)
      y
    `;

    expect(evalGlobal(exp, eva)).toBe(-1);
  });

  it("should add to variable", () => {
    const exp = `
      (var y 0)
      (+= y 10)
      y
    `;

    expect(evalGlobal(exp, eva)).toBe(10);
  });

  it("should subtract from variable", () => {
    const exp = `
      (var y 0)
      (-= y 10)
      y
    `;

    expect(evalGlobal(exp, eva)).toBe(-10);
  });
});
