import Eva from "../Eva";
import parser from "../parser";

export function evalGlobal(src: string, eva: Eva) {
  const exp = parser.parse(`(begin ${src})`);
  return eva.evalGlobal(exp);
}
