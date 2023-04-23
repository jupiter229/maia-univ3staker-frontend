export const findIndexAsync = async <T>(
  arr: T[],
  predicate: (value: T, index: number, arr: T[]) => Promise<boolean>
) => {
  const promises = arr.map(predicate);
  const results = await Promise.all(promises);
  const index = results.findIndex((result) => result);
  return index;
};

export const findAsync = async <T>(
  arr: T[],
  predicate: (value: T, index: number, arr: T[]) => Promise<boolean>
) => {
  const index = await findIndexAsync(arr, predicate);
  return arr[index] as T | undefined;
};

export const arrayify = <T>(arr: T[] | T) => {
  return Array.isArray(arr) ? arr : [arr];
};
