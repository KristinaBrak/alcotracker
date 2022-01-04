import { inc, text } from './functions';

describe('a test utils', () => {
  // it('should replace substr properly', () => {
  //   const result = fun.replace(',')('.')('cabage');
  //   expect(result).toBe('cebege');
  // });
  it('should inc ', () => {
    // const res = inc(10);
    // console.log(res);
    // expect(res).toBe(11);
    expect(text('asd')).toBe('asd');
  });
});
