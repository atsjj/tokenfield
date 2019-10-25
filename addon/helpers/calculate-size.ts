import { helper } from '@ember/component/helper';
import calculateSize from '../-private/calculate-size';
import { htmlSafe } from '@ember/template';

type CalculateSizeHelper = [HTMLInputElement, number, string, string];

export function calculateSizeHelper(params: CalculateSizeHelper) {
  const [ element, minWidth, value, placeholder ] = params;
  const text = (((value || '').length > (placeholder || '').length) ? (value) : placeholder) || '';

  return htmlSafe(`width: ${((element && element.parentElement) ?
    calculateSize(element.parentElement, text).width : (minWidth || 0)) + 2}px`);
}

export default helper(calculateSizeHelper);
