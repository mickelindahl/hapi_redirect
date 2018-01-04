/**
 * Created by Mikael Lindahl on 9/9/16.
 */

'use strict';

const debug = require('debug')('hapi-redirect:index');
const Package = require('./package.json');

exports.plugin={
    register : async function ( server, options) {

        if (options.constructor !== Array ) options=[options];

        let lookup={};
        options.forEach((val)=>{

            lookup[val.status_code]={}

            for (let key in val){

                lookup[val.status_code][key]=val[key];

            }
        });

        // onPreResponse intercepts ALL errors
        server.ext( 'onPreResponse', ( request, h ) => {

            debug('onPreResponse');

            const response = request.response;

            if ( response.isBoom ) {
                let statusCode = response.output.payload.statusCode;

                if ( lookup[statusCode] && lookup[statusCode].redirect ) {

                    let redirect = lookup[statusCode].host
                        ? lookup[statusCode].host + request.url.path
                        : request.url.path;

                    return h.redirect( lookup[statusCode].redirect
                        + '?redirect=' + redirect )
                }
            }

            return h.continue;

        } );
    },
    pkg:Package

};

