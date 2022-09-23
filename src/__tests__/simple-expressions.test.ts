import Eva from "../Eva";

describe("Eva", () => {
  const eva = new Eva();

  it("shoud evaluate numbers", () => {
    const actual = eva.eval(1);

    expect(actual).toBe(1);
  });

  it("shoud evaluate strings", () => {
    const actual = eva.eval('"Hello"');

    expect(actual).toBe("Hello");
  });

  it("shoud evaluate additions", () => {
    const actual = eva.eval(["+", 1, 2]);

    expect(actual).toBe(3);
  });

  it("shoud evaluate nested additions", () => {
    const actual = eva.eval(["+", ["+", 3, 2], 5]);

    expect(actual).toBe(10);
  });
});
