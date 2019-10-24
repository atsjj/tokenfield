export interface DictionaryMap<T = unknown> {
    get(key: string): T | undefined;
    set(key: string, value: T): void;
    has(key: string): boolean;
}
export interface Dictionary<T = unknown> {
    [key: string]: T | undefined;
}
export declare type Indexable<T = unknown> = Readonly<Dictionary<T>>;
export declare function dictionary<T = unknown>(): Dictionary<T> & DictionaryMap<T>;
export declare function isIndexable(v: unknown): v is Indexable;
export default dictionary;
