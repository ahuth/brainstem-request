import pickBy from '../pick-by';

function predicate(val, key) {
  return val < 6 || key === 'fizzbuzz';
}

test('removing keys not matching the predicate', () => {
  expect(pickBy({
    a: 2,
    b: 4,
    c: 6,
    d: 8,
    fizzbuzz: 10,
    f: 12,
  }, predicate)).toEqual({
    a: 2,
    b: 4,
    fizzbuzz: 10,
  });
});

test('an empty object', () => {
  expect(pickBy({}, predicate)).toEqual({});
});

test('no object', () => {
  expect(pickBy(undefined, predicate)).toEqual({});
});

test('no predicate', () => {
  expect(pickBy({
    a: 2,
  }, undefined)).toEqual({
    a: 2,
  });
});
