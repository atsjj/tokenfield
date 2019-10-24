import { stripDiacritics } from './diacritics';
import { Option } from '../components/tf-state-manager';

interface FilterOptions {
  ignoreCase?: boolean;
  ignoreAccents?: boolean;
  stringify?: (value: Option) => string;
  trim?: boolean;
  matchFrom?: 'any' | 'start';
}

type Filter = (option: Option) => boolean;

const defaultOptions = {
  ignoreCase: true,
  ignoreAccents: true,
  stringify: toString,
  trim: true,
  matchFrom: 'any',
}

export function trimString(value: string, noop: boolean): string {
  return noop ? value : value.replace(/^\s+|\s+$/g, '');
}

export function isPresent(value?: string): boolean {
  return value ? trimString(value, false).length > 0 : false;
}

function toString({ label, value }: Option): string {
  return `${label} ${value}`
}

function toStripped(value: string, noop: boolean) {
  return noop ? value : stripDiacritics(value);
}

function toCased(value: string, noop: boolean) {
  return noop ? value : value.toLowerCase();
}

export default function createFilter(input: string, options?: FilterOptions): Filter {
  const { ignoreCase, ignoreAccents, stringify, trim, matchFrom } = { ...defaultOptions, ...options };
  const needle = toStripped(toCased(trimString(input, trim), ignoreCase), ignoreAccents);

  return function filter(option: Option): boolean {
    const haystack = toStripped(toCased(trimString(stringify(option), trim),
      ignoreCase), ignoreAccents);

    return ((matchFrom === 'start') ?
      haystack.substr(0, needle.length) === needle : haystack.indexOf(needle) > -1);
  }
}
