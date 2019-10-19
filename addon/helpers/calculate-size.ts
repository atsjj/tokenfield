import { helper } from '@ember/component/helper';
import calculateSize from '../-private/calculate-size';
import { htmlSafe } from '@ember/template';

type CalculateSizeHelper = [HTMLInputElement, number, string];

export function calculateSizeHelper(params: CalculateSizeHelper) {
  const [ element, minWidth, value ] = params;

  return htmlSafe(`width: ${((element && element.parentElement) ?
    calculateSize(element.parentElement, (value || '')).width : (minWidth || 0)) + 2}px`);
}

export default helper(calculateSizeHelper);
