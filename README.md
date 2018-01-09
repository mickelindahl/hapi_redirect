[![Build Status](https://travis-ci.org/mickelindahl/hapi_redirect.svg?branch=master)](https://travis-ci.org/mickelindahl/hapi_redirect)
[![Coverage Status](https://coveralls.io/repos/github/mickelindahl/hapi_redirect/badge.svg?branch=master)](https://coveralls.io/github/mickelindahl/hapi_redirect?branch=master)

Hapi redirect
=============

A small library for redirecting requests based on http/s status code to another endpoint

## Installation

  npm install --save hapi-redirect

## Usage
```js
'use strict'

const Hapi = require( 'hapi' );

const server = new Hapi.Server( { port: 3000 } );

server.register( {
    plugin: require( 'hapi-redirect' ),
    options: { 
        status_code: "401"
        redirect: "/login"
    }
}, ( err ) => {
    // Oh no!
} );
```

## API

<a name="module_hapi-redirect"></a>

## hapi-redirect
<a name="module_hapi-redirect.plugin"></a>

### hapi-redirect.plugin
- `options` Object with the following keys
  - actions {array} List with redirect actions
    - `status_code` {string} Request status code to redirect e.g. 401 - unauthorized
    - `redirect(url)` {function} Function that should return `{ url: ..., [host:...]}`
    if redirect should be done or null if not

**Kind**: static property of [<code>hapi-redirect</code>](#module_hapi-redirect)  
## Tests

`npm run-script test-locally`

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.
