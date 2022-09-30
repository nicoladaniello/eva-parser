import Environment from "../Environment";
import Eva from "../Eva";

describe("Eva", () => {
  const eva = new Eva(
    new Environment({
      true: true,
    })
  );

  it("should evaluate block scopes", () => {
    const actual = eva.eval([
      "begin",
      ["var", "x", 10],
      ["var", "y", 20],
      ["+", ["*", "x", "y"], 30],
    ]);

    expect(actual).toBe(230);
  });

  it("should evaluate nested blocks", () => {
    const actual = eva.eval([
      "begin",
      ["var", "x", 10],
      ["begin", ["var", "x", 20]],
      "x",
    ]);

    expect(actual).toBe(10);
  });

  it("should allow nested blocks to access parent scopes", () => {
    const actual = eva.eval([
      "begin",
      ["var", "value", 10],
      ["var", "result", ["begin", ["var", "x", ["+", "value", 10]], "x"]],
      "result",
    ]);

    expect(actual).toBe(20);
  });

  it("should allow nested blocks to modify parent scopes", () => {
    const actual = eva.eval([
      "begin",
      ["var", "data", 10],
      ["begin", ["set", "data", 100]],
      "data",
    ]);

    expect(actual).toBe(100);
  });

  it("should throw if nested block tries to modify an undefined variable", () => {
    const actual = () => eva.eval(["begin", ["begin", ["set", "data", 100]]]);

    expect(actual).toThrowError();
  });
});
