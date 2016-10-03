/**
 * Created by Mikael Lindahl on 9/9/16.
 */

'use strict';

const debug = require( 'debug' )( 'hapi_redirect' );

exports.register = function ( server, options, next ) {

    if (typeof options =='object') options=[options];

    let lookup={};
    options.forEach((val)=>{

        lookup[val.status_code]=options

    })

    // onPreResponse intercepts ALL errors
    server.ext( 'onPreResponse', ( request, reply ) => {

        const response = request.response;

        if ( response.isBoom ) {
            let statusCode = response.output.payload.statusCode;

            let redirect = lookup.host
                ? lookup.host + request.url.path
                : request.url.path;

            if ( lookup[statusCode] && lookup[statusCode].redirect ) {
                return reply.redirect( lookup[statusCode].redirect
                    + '?redirect=' + redirect )
            }
        }

        reply.continue();

    } );

    next();

};

exports.register.attributes = {
    name: 'hapi_redirect',
    version: '0.0.1'
};

