/**
 * Created by Mikael Lindahl (mikael) on 10/3/16.
 */

'use strict';


const Lab = require( 'lab' );
const code = require( 'code' );
const debug = require( 'debug' )( 'hapi_redirect:test' );
const start_server = require( '../test_server.js' );

let lab = exports.lab = Lab.script();

lab.experiment( 'redirect', ()=> {

    lab.test( 'redirect at 401 (unauthorized)', ( done )=> {

        start_server( {
            redirect: {
                status_code: "401",
                redirect: "/login"
            }
        } ).then( ( server )=> {
            let options = {
                method: "GET",
                url: "/private",
                //credentials: {} // To bypass auth strategy
            };

            server.inject( options, ( response )=> {

                code.expect( response.statusCode ).to.equal( 302 );
                server.stop()
                done();

            } );
        } );
    } );

    lab.test( 'redirect at 200 (authorized)', ( done )=> {

        start_server( {
            redirect: {
                status_code: "401",
                redirect: "/login"
            }
        } ).then( ( server )=> {

            let options = {
                method: "GET",
                url: "/private",
                credentials: {} // To bypass auth strategy
            };

            server.inject( options, ( response )=> {

                code.expect( response.statusCode ).to.equal( 200 );
                server.stop()
                done();

            } );
        } );
    } );

    lab.test( 'redirect at 404 with host defined (unauthorized)', ( done )=> {

        start_server( {
            host: 'localhost',
            redirect: {
                status_code: "401",
                redirect: "/login",
                host:"http://0.0.0.0:300"
            }
        } ).then( ( server )=> {

            let options = {
                method: "GET",
                url: "/private",
                // credentials: {} // To bypass auth strategy
            };

            server.inject( options, ( response )=> {

                code.expect( response.statusCode ).to.equal( 302 );
                server.stop()
                done();

            } );
        } );
    } );

    lab.test( 'no redirect at 404 (not found)', ( done )=> {
        start_server( {
            redirect: {
                status_code: "401",
                redirect: "/login"
            }
        } ).then( ( server )=> {
            let options = {
                method: "GET",
                url: "/no",
                credentials: {} // To bypass auth strategy
            };

            debug( 'before inject' )

            server.inject( options, ( response )=> {

                code.expect( response.statusCode ).to.equal( 404 );
                done();

            } );
        } );
    } )

    lab.test( 'login ok', ( done )=> {
        start_server( {
            redirect: {
                status_code: "401",
                redirect: "/login"
            }
        } ).then( ( server )=> {
            let options = {
                method: "GET",
                url: "/login",
                credentials: {} // To bypass auth strategy
            };

            debug( 'before inject' )

            server.inject( options, ( response )=> {

                code.expect( response.statusCode ).to.equal( 200 );
                done();

            } );
        } );
    } )

    lab.test( 'login ok', ( done )=> {
        start_server( {
            redirect: [{
                status_code: "401",
                redirect: "/login"
            },
                {
                status_code: "200",
                redirect: "/login"
            }
            ]
        } ).then( ( server )=> {
            let options = {
                method: "GET",
                url: "/login",
                credentials: {} // To bypass auth strategy
            };

            debug( 'before inject' )

            server.inject( options, ( response )=> {

                code.expect( response.statusCode ).to.equal( 200 );
                done();

            } );
        } );
    } )
} );
