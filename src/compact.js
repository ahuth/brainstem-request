import pickBy from './pick-by';

/**
 * Remove properties that have null or undefined values from an object.
 * @param {object} object
 */
export default function compact(object) {
  return pickBy(object, value => value != null);
}
