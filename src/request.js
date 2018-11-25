import { stringify as toQueryString } from 'querystringify';
import compact from './compact';

/**
 * Request a resource from a Brainstem API endpoint.
 * @param {function} globalFetch - Fetch function to use - likely to be `window.fetch`
 * @param {string} csrfToken - Cross-site request forgery token
 * @param {string} uri - URI of a resource. Can be a collection (`/api/v1/stories`) or a single item (`/api/v1/stories/1`)
 * @param {object} [brainstemParams] - Brainstem fetch parameters.
 * @param {object} [brainstemParams.filters]
 * @param {array} [brainstemParams.include]
 * @param {array} [brainstemParams.only]
 * @param {string} [brainstemParams.order]
 * @param {number} [brainstemParams.perPage]
 * @param {number} [brainstemParams.page]
 * @param {string} [brainstemParams.search]
 */
export function fetch(globalFetch, csrfToken, uri, brainstemParams) {
  const config = makeConfig('GET', csrfToken);
  const { filters, include, only, order, perPage, page, search } = brainstemParams;
  const urlParams = toQueryString(compact({
    include: Array.isArray(include) ? include.join(',') : include,
    only: Array.isArray(only) ? only.join(',') : only,
    order,
    page,
    per_page: perPage,
    search,
    ...filters,
  }));

  return globalFetch(`${uri}?${urlParams}`, config).then(normalizeResponse);
}

/**
 * Create a resource.
 * @param {function} globalFetch - Fetch function to use - likely to be `window.fetch`
 * @param {string} csrfToken - Cross-site request forgery token
 * @param {string} uri - URI of the resource to create.
 * @param {string} modelName - Name of the resource to be created.
 * @param {object} modelAttributes
 * @param {object} additionalParams
 */
export function create(globalFetch, csrfToken, uri, modelName, modelAttributes, additionalParams) {
  const config = makeConfig('POST', csrfToken);
  config.body = JSON.stringify({
    [modelName]: modelAttributes,
    ...additionalParams,
  });
  return globalFetch(uri, config).then(normalizeResponse);
}

/**
 * Update a resource.
 * @param {function} globalFetch - Fetch function to use - likely to be `window.fetch`
 * @param {string} csrfToken - Cross-site request forgery token
 * @param {string} uri - URI of the resource to update.
 * @param {string} modelName - Name of the resource to be updated.
 * @param {object} modelAttributes
 * @param {object} additionalParams
 */
export function update(globalFetch, csrfToken, uri, modelName, modelAttributes, additionalParams) {
  const config = makeConfig('PATCH', csrfToken);
  config.body = JSON.stringify({
    [modelName]: modelAttributes,
    ...additionalParams,
  });
  return globalFetch(uri, config).then(normalizeResponse);
}

/**
 * Destroy a resource.
 * @param {function} globalFetch - Fetch function to use - likely to be `window.fetch`
 * @param {string} csrfToken - Cross-site request forgery token
 * @param {string} uri - URI identifying a resource.
 */
export function destroy(globalFetch, csrfToken, uri) {
  const config = makeConfig('DELETE', csrfToken);
  return globalFetch(uri, config).then(normalizeResponse);
}

function normalizeResponse(response) {
  if (response.ok) {
    return response.json();
  }
  return response.json().then((errors) => {
    return Promise.reject(errors);
  });
}

function makeConfig(httpMethod, csrfToken) {
  return {
    method: httpMethod,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
  };
}
