import * as response from '../response';

test('extracting count from an API response', () => {
  const json = {
    meta: { count: 3, page_number: 1, page_count: 1, page_size: 20 },
    results: [
      { key: 'widgets', id: '3' },
      { key: 'widgets', id: '666' },
      { key: 'widgets', id: '1001' },
    ],
  };
  expect(response.count(json)).toEqual(3);
});

test('extracting the messages of errors returned via API request', () => {
  const json = {
    errors: [
      { type: 'system', message: 'Your account has been canceled' },
      { type: 'oauth', message: 'Invalid OAuth 2 Request' },
    ],
  };
  expect(response.errors(json)).toEqual(['Your account has been canceled', 'Invalid OAuth 2 Request']);
});

test('extracting the ids of results returned via API request', () => {
  const json = {
    count: 3,
    results: [
      { key: 'widgets', id: '3' },
      { key: 'widgets', id: '666' },
      { key: 'widgets', id: '1001' },
    ],
  };
  expect(response.ids(json)).toEqual(['3', '666', '1001']);
});

test('extracting all returned objects from an API response', () => {
  const json = {
    count: 2,
    meta: { count: 2, page_number: 1, page_count: 1, page_size: 20 },
    results: [
      { key: 'foos', id: '2' },
      { key: 'foos', id: '10' },
    ],
    foos: {
      1: { id: '1', name: 'a' },
      2: { id: '2', name: 'b' },
    },
    bars: {
      3: { id: '3', name: 'c' },
      4: { id: '4', name: 'd' },
      5: { id: '5', name: 'e' },
    },
    baz: {
      6: { id: '6', name: 'f' },
      7: { id: '7', name: 'g' },
    },
  };
  expect(response.objects(json)).toEqual({
    foos: {
      1: { id: '1', name: 'a' },
      2: { id: '2', name: 'b' },
    },
    bars: {
      3: { id: '3', name: 'c' },
      4: { id: '4', name: 'd' },
      5: { id: '5', name: 'e' },
    },
    baz: {
      6: { id: '6', name: 'f' },
      7: { id: '7', name: 'g' },
    },
  });
});

test('extracting the total number of pages available from API responses', () => {
  const json = {
    meta: { count: 14, page_number: 1, page_count: 2, page_size: 20 },
    results: [
      { key: 'widgets', id: '3' },
      { key: 'widgets', id: '666' },
      { key: 'widgets', id: '1001' },
    ],
  };
  expect(response.pages(json)).toEqual(2);
});
