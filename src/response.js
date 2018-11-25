import omit from './omit';

/**
 * Get the total number of matching records for the request.
 * @param {object} json - A Brainstem API response.
 */
export function count(json) {
  return json.meta.count;
}

/**
 * Extract the messages of errors returned by an API request.
 * @param {object} json - A Brainstem API response.
 */
export function errors(json) {
  return json.errors.map(error => error.message);
}

/**
 * Extract the IDs of objects returned by an API request.
 * @param {object} json - A Brainstem API response.
 */
export function ids(json) {
  return json.results.map(result => result.id);
}

/**
 * Extract the objects returned by an API request.
 * @param {object} json - A Brainstem API response.
 */
export function objects(json) {
  const nonResultKeys = ['count', 'meta', 'results'];
  return omit(json, nonResultKeys);
}

/**
 * Get the total number pages available.
 * @param {object} json - A Brainstem API response.
 */
export function pages(json) {
  return json.meta.page_count;
}
