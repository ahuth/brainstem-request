export default function omit(object = {}, keys = []) {
  const cloned = {};

  for (let property in object) {
    if (object.hasOwnProperty(property) && !keys.includes(property)) {
      cloned[property] = object[property];
    }
  }

  return cloned;
}
