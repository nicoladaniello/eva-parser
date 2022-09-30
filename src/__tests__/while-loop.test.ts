import Eva from "../Eva";

describe("Eva", () => {
  const eva = new Eva();

  it("shoud evaluate while loops", () => {
    const actual = eva.eval([
      "begin",

      ["var", "counter", 0],
      ["var", "result", 0],

      [
        "while",
        ["<", "counter", 10],
        [
          "begin",
          ["set", "result", ["+", "result", 1]],
          ["set", "counter", ["+", "counter", 1]],
        ],
      ],

      "result",
    ]);

    expect(actual).toBe(10);
  });
});
