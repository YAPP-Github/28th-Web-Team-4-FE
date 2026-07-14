type ObjectEntries<T extends object> = {
  [K in keyof T]-?: [K, T[K]];
}[keyof T][];

export const keys = <T extends object>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

export const values = <T extends object>(obj: T): T[keyof T][] => {
  return Object.values(obj) as T[keyof T][];
};

export const entries = <T extends object>(obj: T): ObjectEntries<T> => {
  return Object.entries(obj) as ObjectEntries<T>;
};
