import { helper } from '@ember/component/helper';

export function join(params: [string, ...any[]]) {
  const [ char, ...items ] = params;

  return items.filter(s => s).join(char)
}

export default helper(join);
