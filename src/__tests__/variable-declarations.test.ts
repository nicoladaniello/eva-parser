import Environment from "../Environment";
import Eva from "../Eva";

describe("Eva", () => {
  const eva = new Eva(
    new Environment({
      true: true,
    })
  );

  it("should evaluate variable declarations", () => {
    const actual = eva.eval(["var", "x", 10]);

    expect(actual).toBe(10);
  });

  it("should access variables", () => {
    eva.eval(["var", "x", 10]);
    const actual = eva.eval("x");

    expect(actual).toBe(10);
  });

  it("should access pre-defined variables", () => {
    const actual = eva.eval("true");

    expect(actual).toBe(true);
  });

  it("should throw when accessing an undeclared variable", () => {
    const actual = () => eva.eval("y");

    expect(actual).toThrowError();
  });

  it("should allow variables values to be other variables.", () => {
    eva.eval(["var", "x", "true"]);
    const actual = eva.eval("x");

    expect(actual).toBe(true);
  });

  it("should allow variables values to be result of expressions.", () => {
    eva.eval(["var", "x", ["*", 2, 3]]);
    const actual = eva.eval("x");

    expect(actual).toBe(6);
  });
});
