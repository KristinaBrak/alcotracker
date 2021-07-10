import { Attr } from './vynoteka.types';
import * as O from 'fp-ts/Option';
import { flow } from 'fp-ts/lib/function';
import { prop, replace } from '../../../utils/functions';

export const atIndex = (attr: Attr) => (index: number) => O.fromNullable(attr[index]);
export const extract = (obj: any): O.Option<any> => O.fromNullable(Object.values(obj)[0]);

export const parseNumeric = flow(replace(',')('.'), Number);

export const propToNumber = (propStr: string) =>
  flow(prop(propStr), O.fromNullable, O.map(parseNumeric));

const toZeroFold = O.fold<number, number>(
  () => 0,
  val => val,
);

export const getVolume = (qtyProp: string) => (volProp: string) => (val: any) => {
  const qty = flow(propToNumber(qtyProp), toZeroFold)(val);
  const vol = flow(propToNumber(volProp), toZeroFold)(val);
  const result = qty * vol;
  return result ? O.some(result) : O.none;
};

export const extractAttr = (attr: Attr) => flow(atIndex(attr), O.map(extract), O.flatten);

export const parseAlcVolume = (attr: Attr) => (prop: string) =>
  flow(extractAttr(attr), O.map(propToNumber(prop)), O.flatten, O.toUndefined);

export const parseVolume = (attr: Attr) => (qtyProp: string) => (volProp: string) =>
  flow(extractAttr(attr), O.map(getVolume(qtyProp)(volProp)), O.flatten, O.toUndefined);
