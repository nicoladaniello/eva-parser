export default class Transformer {
  transformDefToVarLambda(defExp: any[]) {
    const [_tag, name, params, body] = defExp;
    return ["var", name, ["lambda", params, body]];
  }

  transformSwitchToIf(switchExp: any[]) {
    const [_tag, ...cases] = switchExp;

    const ifExp = ["if", null, null, null];

    let current: any[] = ifExp;

    for (let i = 0; i < cases.length - 1; i++) {
      const [currCondition, currBlock] = cases[i];

      current[1] = currCondition;
      current[2] = currBlock;

      const next = cases[i + 1];

      const [nextCondition, nextBlock] = next;

      current[3] = nextCondition === "else" ? nextBlock : ["if"];
      current = current[3];
    }

    return ifExp;
  }

  transformIncToSet(incExp: any[]) {
    const [_tag, varName] = incExp;
    return ["set", varName, ["+", varName, 1]];
  }

  transformPlusEqualToSet(decExp: any[]) {
    const [_tag, varName, value] = decExp;
    return ["set", varName, ["+", varName, value]];
  }

  transformDecToSet(decExp: any[]) {
    const [_tag, varName] = decExp;
    return ["set", varName, ["-", varName, 1]];
  }

  transformMinusEqualToSet(decExp: any[]) {
    const [_tag, varName, value] = decExp;
    return ["set", varName, ["-", varName, value]];
  }

  transformForToWhile(forExp: any[]) {
    const [_tag, init, condition, modifier, body] = forExp;

    const whileExp = [
      "begin",
      init,
      ["while", condition, ["begin", body, modifier]],
    ];

    return whileExp;
  }
}
