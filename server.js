/**
 * Created by Mikael Lindahl (mikael) on 10/3/16.
 */

'use strict';

const Hapi = require( 'hapi' );
const handlebars = require( 'handlebars' );
const path = require( 'path' );

let server = new Hapi.Server();

server.connection( { host: '0.0.0.0', port: 3000 } );

server.register( [{

    register: require( 'hapi-auth-jwt' ),
    options: { key: 'secret' }
},
    require( 'vision' ),
    {
        register: require( './index.js' ),
        options: {
            status_code: "401",
            redirect: "/login"
        }
    },
] ).then( ()=> {

    server.auth.strategy( 'jwt', 'jwt', { key: 'secret' } );

    server.views( {
        engines: {
            html: handlebars
        },
        relativeTo: path.resolve(),
        path: './views'
    } );

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

    server.start( ( err ) => {

        if ( err ) {
            throw err;
        }

        server.app.readyForTest = true;

    } );

} );

module.exports = server;