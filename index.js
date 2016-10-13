/**
 * Created by Mikael Lindahl on 9/9/16.
 */

'use strict';

const debug = require('debug')('hapi-redirect:index')

exports.register = function ( server, options, next ) {

    if (options.constructor !== Array ) options=[options];

    let lookup={};
    options.forEach((val)=>{

        lookup[val.status_code]={}

        for (let key in val){

            lookup[val.status_code][key]=val[key]

        }

    })

    // onPreResponse intercepts ALL errors
    server.ext( 'onPreResponse', ( request, reply ) => {

        const response = request.response;

        debug(lookup)

        if ( response.isBoom ) {
            let statusCode = response.output.payload.statusCode;

            if ( lookup[statusCode] && lookup[statusCode].redirect ) {

                let redirect = lookup[statusCode].host
                    ? lookup[statusCode].host + request.url.path
                    : request.url.path;

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

