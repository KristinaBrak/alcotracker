import { Attr } from './vynoteka.types';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import * as ROA from 'fp-ts/ReadonlyArray';
import { flow } from 'fp-ts/lib/function';
import { prop, replace } from '../../../utils/functions';

export const atIndex = (attr: Attr) => (index: number) => O.fromNullable(attr[index]);
export const extract = (obj: any): O.Option<any> => O.fromNullable(Object.values(obj)[0]);

export const parseNumeric = flow(replace(',')('.'), Number, val =>
  isNaN(val) ? O.none : O.some(val),
);

export const propToNumber = (propStr: string) =>
  flow(prop(propStr), O.fromNullable, O.map(parseNumeric), O.flatten);

type VolumeType = {
  qty: number;
  vol: number;
};

const transformEntry = flow(
  ([, value]) => value as string | undefined,
  O.fromNullable,
  O.map(parseNumeric),
  O.flatten,
);

export const getVolume = (props: Array<keyof VolumeType>) =>
  flow(
    Object.entries,
    A.filter(([key]) => props.includes(key as keyof VolumeType)),
    A.map(transformEntry),
    O.sequenceArray,
    O.map(ROA.reduce(1, (acc, item) => acc * (item ? item : 1))),
  );

export const extractAttr = (attr: Attr) => flow(atIndex(attr), O.map(extract), O.flatten);

export const parsePrice = flow(
  parseNumeric,
  O.fold(
    () => 0,
    p => p,
  ),
);

export const parseAlcVolume = (attr: Attr) => (prop: string) =>
  flow(extractAttr(attr), O.map(propToNumber(prop)), O.flatten, O.toUndefined);

export const parseVolume = (attr: Attr) => (props: Array<keyof VolumeType>) =>
  flow(extractAttr(attr), O.chain(getVolume(props)), O.toUndefined);
