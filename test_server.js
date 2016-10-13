/**
 * Created by Mikael Lindahl (mikael) on 10/3/16.
 */

'use strict';

const Hapi = require( 'hapi' );
const handlebars = require( 'handlebars' );
const path = require( 'path' );
const Promise = require( 'bluebird' );
const debug = require( 'debug' )( 'hapi-redirect:server' )

function get_server( options ) {
    let server = new Hapi.Server();

    server.connection( { host: '0.0.0.0', port: 3000 } );

    server.register( [{

        register: require( 'hapi-auth-jwt' ),
        options: { key: 'secret' }
    },
        require( 'vision' ),
        {
            register: require( './index.js' ),
            options: options.redirect
        },
    ] ).then( ()=> {

        server.auth.strategy( 'jwt', 'jwt', { key: 'secret' } );

        debug( path.basename( path.resolve() ) )

        server.views( {
            engines: {
                html: handlebars
            },
            relativeTo: __dirname,
            path:'./views'

        } );

        server.route( [
            {
                method: 'GET',
                path: '/login',
                handler: ( request, reply )=> {
                    reply.view( 'public' );
                }
            },
            {
                method: 'GET',
                path: '/private',
                config: {
                    auth: 'jwt'
                },
                handler: ( request, reply ) => {
                    reply.view( 'private' );
                }
            }

        ] );

        server.app.readyForTest = true;

    } );
    return server
}

function start_servet( options ) {
    let server = get_server( options );
    let promise = new Promise( ( resolve, reject )=> {
        resolve( server )
    //
        //     var iv = setInterval( function () {
        //         if ( server.app.readyForTest == true ) {
        //             clearInterval( iv );
        //             resolve( server )
        //
        //         }
        //     }, 50 );
        } )
        // .catch( ( err )=> {
        //     console.log( err )
        // } )
    return promise
}

module.exports = start_servet;


