import pickBy from './pick-by';

/**
 * Remove the specified properties from an object.
 * @param {object} object
 * @param {string[]} keys
 */
export default function omit(object, keys = []) {
  return pickBy(object, (_, key) => !keys.includes(key));
}
