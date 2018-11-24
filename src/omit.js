/**
 * Remove the specified properties from an object.
 * @param {object} object
 * @param {string[]} keys
 */
export default function omit(object = {}, keys = []) {
  const cloned = {};

  for (let property in object) {
    if (object.hasOwnProperty(property) && !keys.includes(property)) {
      cloned[property] = object[property];
    }
  }

  return cloned;
}
