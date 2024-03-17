

const CamelToSnake = (str: string) =>
  str.replace(/([A-Z])/g, g => '_' + g[0].toLowerCase());
const SnakeToCamel = (str: string) =>
  str.replace(/(\_\w)/g, g => g[1].toUpperCase());

export const toSnake = <T extends object | string>(input: T) =>
  converter(input, 'CamelToSnake');

export const toCamel = <T extends object | string>(input: T) =>
  converter(input, 'SnakeToCamel');

function converter<T extends object | string, P extends ParserType>(
  input: T,
  type: P,
) {
  let result;
  if (typeof input === 'string') result = stringParser(input, type);
  if (isArray(input)) result = arrayParser(input, type);
  if (isObject(input)) result = objectParser(input, type);
  return result as Result<T, P>;
}

function stringParser(input: string, type: ParserType) {
  return {
    CamelToSnake,
    SnakeToCamel,
  }[type](input);
}

function arrayParser<T extends Array<unknown>, P extends ParserType>(
  input: T,
  type: P,
): Array<unknown> {
  return input.map(item => {
    if (isArray(item)) return arrayParser(item, type);
    if (isObject(item)) return objectParser(item, type);
    return item;
  });
}

function objectParser<T extends object, P extends ParserType>(
  input: T,
  type: P,
) {
  const result = {} as any;
  for (const property in input) {
    const parsedKey = stringParser(property, type);
    const value = input[property];
    if (isArray(value)) {
      result[parsedKey] = arrayParser(value, type);
    } else if (isObject(value)) {
      result[parsedKey] = objectParser(value, type);
    } else {
      result[parsedKey] = value;
    }
  }
  return result;
}

function isObject(input: unknown): input is object {
  return typeof input === 'object' && input?.constructor === Object;
}

function isArray(input: unknown): input is Array<unknown> {
  return Array.isArray(input);
}

type ParserType = 'CamelToSnake' | 'SnakeToCamel';

type CamelToSnake<T extends string> = T extends `${infer L}${infer R}`
  ? `${L extends Capitalize<L> ? '_' : ''}${Lowercase<L>}${CamelToSnake<R>}`
  : T;
type SnakeToCamel<T extends string> = T extends `${infer L}_${infer R}`
  ? `${L}${Capitalize<SnakeToCamel<R>>}`
  : T;

export type Result<T, P> = T extends string
  ? T
  : T extends Array<unknown>
  ? {
      [K in keyof T]: Result<T[K], P>;
    }
  : T extends object
  ? {
      [K in keyof T as P extends 'CamelToSnake'
        ? CamelToSnake<K & string>
        : P extends 'SnakeToCamel'
        ? SnakeToCamel<K & string>
        : never]: Result<T[K], P>;
    }
  : T;
