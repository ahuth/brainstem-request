import compact from '../compact';

test('removing null and undefined values from an object', () => {
  expect(compact({
    a: 0,
    b: 1,
    c: null,
    d: 2,
    e: undefined,
    f: false,
    g: 3,
    h: '',
  })).toEqual({
    a: 0,
    b: 1,
    d: 2,
    f: false,
    g: 3,
    h: '',
  });
});

test('objects without null or undefined values', () => {
  expect(compact({
    a: 1,
    b: 2,
  })).toEqual({
    a: 1,
    b: 2,
  });
});

test('empty objects', () => {
  expect(compact({})).toEqual({});
});

test('no input', () => {
  expect(compact()).toEqual({});
});
