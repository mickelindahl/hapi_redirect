/**
 * Created by Mikael Lindahl (mikael) on 10/3/16.
 */

'use strict';


const Lab = require( 'lab' );
const code = require( 'code' );
const debug = require('debug')('hapi_redirect:test');
const server = require('../server.js');

//debug(server)

let lab = exports.lab = Lab.script();


debug('start server');

//start_server( ()=>{} )


lab.experiment( 'redirect', ()=> {

    lab.before( {}, ( done )=> {

        var iv = setInterval(function () {
            if (server.app.readyForTest == true) {
                clearInterval(iv);
                done();
            }
        }, 50);

    } );

    lab.test( 'redirect at 401 (unauthorized)', ( done )=> {

        let options = {
            method: "GET",
            url: "/private",
            //credentials: {} // To bypass auth strategy
        };

        debug('before inject');

        server.inject( options, ( response )=> {

            debug(response)

            code.expect( response.statusCode ).to.equal( 302 );
            done();

        } );

    } )

    lab.test( 'redirect at 200 (authorized)', ( done )=> {

        let options = {
            method: "GET",
            url: "/private",
            credentials: {} // To bypass auth strategy
        };

        debug('before inject')

        server.inject( options, ( response )=> {

            debug(response)

            code.expect( response.statusCode ).to.equal( 200 );
            done();

        } );

    } )



} );





//module.exports = server;