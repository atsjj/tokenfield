import { helper } from '@ember/component/helper';
import { isEqual } from '@ember/utils';

type EqHelper = [any, any];

export function eqHelper(params: EqHelper): boolean {
  return isEqual(...params);
}

export default helper(eqHelper);
