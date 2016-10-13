[![Build Status](https://travis-ci.org/mickelindahl/hapi_redirect.svg?branch=master)](https://travis-ci.org/mickelindahl/hapi_redirect)
[![Coverage Status](https://coveralls.io/repos/github/mickelindahl/hapi_redirect/badge.svg?branch=master)](https://coveralls.io/github/mickelindahl/hapi_redirect?branch=master)

Hapi redirect
=============

A small library for redirecting requests based on http/s status code to another endpoint

## Installation

  npm install hapi-redirect

## Usage
```js
'use strict'

const Hapi = require( 'hapi' );

const server = new Hapi.Server( { port: 3000 } );

server.register( {
    register: require( 'hapi-redirect' ),
    options: { 
        status_code: "401"
        redirect: "/login"
    }
}, ( err ) => {
    // Oh no!
} );
```

- `options` Object or list of objects with the following keys
  - `status_code` Request status code to redirect e.g. 401 - unauthorized  
  - `redirect` Endpoint that you want to redirect ro
  - `host` Host that redirection comes from. Only necessary to set if it differs from the host you are redirecting to. 

## Tests

  Lab.cmd

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 1.0.0 Initial release
* 1.0.1 Bug fix
* 1.0.2 Bug fix
* 1.0.3 100 % coverage and bug fix
