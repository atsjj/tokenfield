import { Option } from '../components/tf-state-manager';
interface FilterOptions {
    ignoreCase?: boolean;
    ignoreAccents?: boolean;
    stringify?: (value: Option) => string;
    trim?: boolean;
    matchFrom?: 'any' | 'start';
}
declare type Filter = (option: Option) => boolean;
export declare function trimString(value: string, noop: boolean): string;
export declare function isPresent(value?: string): boolean;
export default function createFilter(input: string, options?: FilterOptions): Filter;
export {};
