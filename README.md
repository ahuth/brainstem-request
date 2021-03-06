# Brainstem Request

Utility functions for:
1. Making API requests to a [Brainstem](https://github.com/mavenlink/brainstem) endpoint.
2. Extracting data from a Brainstem API response.

## Installation

Install with the dependency management tool of your choice. For example, to install with npm:

```
npm install --save brainstem-request
```

## Usage

### Making requests

Import the request helpers:

```js
import { request } from 'brainstem-request';
```

The imported object will have `fetch`, `create`, `update`, and `destroy` functions on it. Each returns a promise.

Note that a `fetch` implementation (such as `window.fetch`) must be passed to the functions, along with a CSRF token.

For example:

```js
const promise = request.fetch(window.fetch, 'csrf-token', '/api/tasks', { perPage: 50 });
```

To make this easier to use, you can bind the values for the fetch implementation and the authentication token. For example:

```js
const myFetch = request.fetch.bind(null, window.fetch, 'csrf-token');

const promise = myFetch('/api/tasks', { perPage: 50 });
```

### Processing responses

Import the response helpers:

```js
import { response } from 'brainstem-request';
```

The imported object will have `count`, `errors`, `ids`, `objects`, and `pages` functions.

Use them to extract information directly from responses from request functions.

For example:

```js
promise.then((resp) => {
  const ids = response.ids(resp);
  console.log('Got objects with ids: ', ids);
});
```
