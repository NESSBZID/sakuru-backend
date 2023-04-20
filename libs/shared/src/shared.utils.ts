import { MsPattern } from '@nestjs/microservices';
import { ModeFilter } from './enums/ModeFilter.enum';
import { ModsFilter } from './enums/ModsFilter.enum';

/* eslint-disable @typescript-eslint/no-use-before-define */
export const isUndefined = (obj: unknown): obj is undefined =>
  typeof obj === 'undefined';

export const isObject = (fn: unknown): fn is object =>
  !isNil(fn) && typeof fn === 'object';

export const isPlainObject = (fn: unknown): fn is object => {
  if (!isObject(fn)) {
    return false;
  }
  const proto = Object.getPrototypeOf(fn);
  if (proto === null) {
    return true;
  }
  const ctor =
    Object.prototype.hasOwnProperty.call(proto, 'constructor') &&
    proto.constructor;
  return (
    typeof ctor === 'function' &&
    ctor instanceof ctor &&
    Function.prototype.toString.call(ctor) ===
      Function.prototype.toString.call(Object)
  );
};

export const addLeadingSlash = (path?: string): string =>
  path && typeof path === 'string'
    ? path.charAt(0) !== '/'
      ? '/' + path
      : path
    : '';

export const normalizePath = (path?: string): string =>
  path
    ? path.startsWith('/')
      ? ('/' + path.replace(/\/+$/, '')).replace(/\/+/g, '/')
      : '/' + path.replace(/\/+$/, '')
    : '/';

export const stripEndSlash = (path: string) =>
  path[path.length - 1] === '/' ? path.slice(0, path.length - 1) : path;

export const isFunction = (val: unknown): boolean => typeof val === 'function';
export const isString = (val: unknown): val is string =>
  typeof val === 'string';
export const isNumber = (val: unknown): val is number =>
  typeof val === 'number';
export const isConstructor = (val: unknown): boolean => val === 'constructor';
export const isNil = (val: unknown): val is null | undefined =>
  isUndefined(val) || val === null;
export const isEmpty = (array: any[]): boolean => !(array && array.length > 0);
export const isSymbol = (val: unknown): val is symbol =>
  typeof val === 'symbol';

export function transformPatternToRoute(pattern: MsPattern): string {
  if (isString(pattern) || isNumber(pattern)) {
    return `${pattern}`;
  }
  if (!isObject(pattern)) {
    return pattern;
  }

  const sortedKeys = Object.keys(pattern).sort((a, b) =>
    ('' + a).localeCompare(b),
  );

  // Creates the array of Pattern params from sorted keys and their corresponding values
  const sortedPatternParams = sortedKeys.map((key) => {
    let partialRoute = `"${key}":`;
    partialRoute += isString(pattern[key])
      ? `"${transformPatternToRoute(pattern[key])}"`
      : transformPatternToRoute(pattern[key]);
    return partialRoute;
  });

  const route = sortedPatternParams.join(',');
  return `{${route}}`;
}

export function makeSafeName(unsafe_name: string): string {
  return unsafe_name.replace(/[^a-zA-Z0-9]/g, '_');
}

export function checkValidModsCombination(
  mode: ModeFilter,
  mods: ModsFilter,
): boolean {
  switch (mods) {
    case ModsFilter.vanilla:
      return (
        mode === ModeFilter.osu ||
        mode === ModeFilter.taiko ||
        mode === ModeFilter.catch ||
        mode === ModeFilter.mania
      );
    case ModsFilter.relax:
      return (
        mode === ModeFilter.osu ||
        mode === ModeFilter.catch ||
        mode === ModeFilter.mania
      );
    case ModsFilter.autopilot:
      return mode === ModeFilter.osu;
    default:
      return false;
  }
}
