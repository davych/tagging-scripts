import { isObject, reduce, merge } from 'lodash';

export const flattenKeys = (
  obj: Record<string, unknown>,
  path: string[] = []
): Record<string, string> =>
  !isObject(obj)
    ? { [path.join('.')]: obj }
    : reduce(
      obj,
      (cum: any, next: any, key: any) =>
        merge(
          cum,
          flattenKeys(next as Record<string, unknown>, [...path, key])
        ),
      {}
    );

export const replace = (str: string, obj: any) => str.replaceAll(/\{([^}]+)\}/gi, (_, a) => a.split('.').reduce((b: any, c: any) => b?.[c], obj));
export const getPictureFromDom = (domTarget: any) => {
  const { dataset, classList = [], id } = domTarget;
  return {
    dataset,
    classList,
    id
  };
}

export const getPathname = () => {
  return location.pathname;
}

export const getAppConfig = () => {
  return window.__TaggingConfiguration;
}

