type D = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type YYYY = `19${D}${D}` | `20${D}${D}`;
type MM = `0${Exclude<D, 0>}` | `1${1 | 2}`;
type DD = `0${Exclude<D, 0>}` | `${1 | 2}${D}` | `3${0 | 1}`;
type HT = `0${D}` | `${D}${D}`;
type MT = `0${D}` | `${1 | 2 | 3 | 4 | 5}${D}`;

export type TailorGqlDate = `${YYYY}-${MM}-${DD}`;
export type TailorGqlTime = `${HT}:${MT}`;
