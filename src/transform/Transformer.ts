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
}
