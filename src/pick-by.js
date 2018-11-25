/**
 * Creates an object composed of the object properties that the predicate returns truthy for.
 * The predicate is invoked with two arguments: (value, key).
 * @param {object} object - Source object
 * @param {function} predicate - Function invoked per property
 */
export default function pickBy(object, predicate = () => true) {
  const cloned = {};

  for (let property in object) {
    const value = object[property];

    if (object.hasOwnProperty(property) && predicate(value, property)) {
      cloned[property] = value;
    }
  }

  return cloned;
}
