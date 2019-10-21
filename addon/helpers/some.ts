import { helper } from '@ember/component/helper';
import { isEqual } from '@ember/utils';

type EqHelper = [any, any[]];

export function someHelper(params: EqHelper): boolean {
  const [value, items] = params;

  return items.some(item => isEqual(item, value));
}

export default helper(someHelper);
