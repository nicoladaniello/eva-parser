import Eva from "../Eva";

describe("Eva", () => {
  const eva = new Eva();

  it("shoud evaluate if statements", () => {
    const actual = eva.eval([
      "begin",

      ["var", "x", 10],
      ["var", "y", 0],

      ["if", [">", "x", 10], ["set", "y", 20], ["set", "y", 30]],

      "y",
    ]);

    expect(actual).toBe(30);
  });
});
