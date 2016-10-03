/**
 * Created by Mikael Lindahl (mikael) on 10/3/16.
 */

'use strict';

const Hapi = require( 'hapi' );
const handlebars = require( 'handlebars' );
const path = require( 'path' );
const debug = require( 'debug' )( 'hapi_redirect:server' );

let server = new Hapi.Server();

server.connection( { host: '0.0.0.0', port: 3000 } );

debug( 'server connected' );

server.register( [{

    register: require( 'hapi-auth-jwt' ),
    options: { key: 'secret' }
},
    require( 'vision' ),
    {
        register: require( './index.js' ),
        options: {
            "401": {
                "redirect": "/login"
            }
        }
    },
] ).then( ()=> {

    debug( 'start kicking' );

    server.auth.strategy( 'jwt', 'jwt', { key: 'secret' } );

    debug( 'auth set' )

    server.views( {
        engines: {
            html: handlebars
        },
        relativeTo: path.resolve(),
        path: './views'
    } );

    debug( 'views set' );

    server.route( [
        {
            method: 'GET',
            path: '/login',
            handler: ( request, reply )=> { reply.view( 'public' );}
        },
        {
            method: 'GET',
            path: '/private',
            config: {
                auth: 'jwt'
            },
            handler: ( request, reply ) => { reply.view( 'private' );}
        }

    ] );

    debug( 'routes set' );

    server.start( ( err ) => {

        if ( err ) {
            throw err;
        }

        console.log( `Server running at: ${server.info.uri}` );
        server.app.readyForTest = true;
        //done()

    } );

} );

module.exports = server;