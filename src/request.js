import { isArray } from 'underscore';
import { param as toQueryString } from 'jquery';
import compact from './compact';

/**
 * Request a resource from a Brainstem API endpoint.
 * @param {string} uri - URI of a resource. Can be a collection (`/api/v1/stories`) or a single item (`/api/v1/stories/1`)
 * @param {string} authToken - Authentication token for the requesting user.
 * @param {object} [brainstemParams] - Brainstem fetch parameters.
 * @param {object} [brainstemParams.filters]
 * @param {array} [brainstemParams.include]
 * @param {array} [brainstemParams.only]
 * @param {string} [brainstemParams.order]
 * @param {number} [brainstemParams.perPage]
 * @param {number} [brainstemParams.page]
 * @param {string} [brainstemParams.search]
 */
export function fetch(uri, authToken, brainstemParams) {
  const config = makeConfig('GET', authToken);
  const { filters, include, only, order, perPage, page, search } = brainstemParams;
  const urlParams = toQueryString(compact({
    include: isArray(include) ? include.join(',') : include,
    only: isArray(only) ? only.join(',') : only,
    order,
    page,
    per_page: perPage,
    search,
    ...filters,
  }));

  return window.fetch(`${uri}?${urlParams}`, config).then(normalizeResponse);
}

/**
 * Create a resource.
 * @param {string} uri - URI of the resource to create.
 * @param {string} authToken - Authentication token for the requesting user.
 * @param {string} modelName - Name of the resource to be created.
 * @param {object} modelAttributes
 * @param {object} additionalParams
 */
export function create(uri, authToken, modelName, modelAttributes, additionalParams) {
  const config = makeConfig('POST', authToken);
  config.body = JSON.stringify({
    [modelName]: modelAttributes,
    ...additionalParams,
  });
  return window.fetch(uri, config).then(normalizeResponse);
}

/**
 * Update a resource.
 * @param {string} uri - URI of the resource to update.
 * @param {string} authToken - Authentication token for the requesting user.
 * @param {string} modelName - Name of the resource to be updated.
 * @param {object} modelAttributes
 * @param {object} additionalParams
 */
export function update(uri, authToken, modelName, modelAttributes, additionalParams) {
  const config = makeConfig('PATCH', authToken);
  config.body = JSON.stringify({
    [modelName]: modelAttributes,
    ...additionalParams,
  });
  return window.fetch(uri, config).then(normalizeResponse);
}

/**
 * Destroy a resource.
 * @param {string} uri - URI identifying a resource.
 * @param {string} authToken - Authentication token for the requesting user.
 */
export function destroy(uri, authToken) {
  const config = makeConfig('DELETE', authToken);
  return window.fetch(uri, config).then(normalizeResponse);
}

function normalizeResponse(response) {
  if (response.ok) {
    return response.json();
  }
  return response.json().then((errors) => {
    return Promise.reject(errors);
  });
}

function makeConfig(httpMethod, authToken) {
  return {
    method: httpMethod,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': authToken,
    },
  };
}
