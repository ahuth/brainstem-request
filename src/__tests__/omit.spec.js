import omit from '../omit';

test('removing specified keys from an object', () => {
  const object = {
    a: 0,
    b: 1,
    d: 2,
    e: 3,
    f: 4,
  };
  const keys = ['b', 'd', 'f'];
  expect(omit(object, keys)).toEqual({
    a: 0,
    e: 3,
  });
});

test('no keys', () => {
  expect(omit({
    a: 1,
    b: 2,
  })).toEqual({
    a: 1,
    b: 2,
  });
});

test('empty objects', () => {
  expect(omit({})).toEqual({});
});

test('no input', () => {
  expect(omit()).toEqual({});
});
