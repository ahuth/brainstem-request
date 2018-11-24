export default function compact(object) {
  const cloned = {};
  for (let property in object) {
    if (object.hasOwnProperty(property) && object[property] != null) {
      cloned[property] = object[property];
    }
  }
  return cloned;
}
