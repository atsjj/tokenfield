export interface DictionaryMap<T = unknown> {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
  has(key: string): boolean;
}

export interface Dictionary<T = unknown> {
  [key: string]: T | undefined;
}

export type Indexable<T = unknown> = Readonly<Dictionary<T>>;

function CoreDictionaryGet<T>(this: any, key: string): T {
  return this[key];
}

function CoreDictionarySet<T>(this: any, key: string, value: T): void {
  this[key] = value;
}

const { hasOwnProperty } = Object.prototype;
const CoreDictionary = Object.create(null);
CoreDictionary['get'] = CoreDictionaryGet;
CoreDictionary['set'] = CoreDictionarySet;
CoreDictionary['has'] = hasOwnProperty;

Object.freeze(CoreDictionary);

export function dictionary<T = unknown>(): Dictionary<T> & DictionaryMap<T> {
  return Object.create(CoreDictionary);
}

export function isIndexable(v: unknown): v is Indexable {
  return v !== null && (typeof v === 'object' || typeof v === 'function');
}

export default dictionary;
