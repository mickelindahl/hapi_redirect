/**
 * Created by Mikael Lindahl (mikael) on 10/3/16.
 */

'use strict';

const Hapi = require('hapi');
const handlebars = require('handlebars');
const path = require('path');
const debug = require('debug')('hapi-redirect:server')
const Jwt = require('jsonwebtoken');
const hapi_auth_jwt = require('@tanepiper/hapi-auth-jwt');


const privateKey = 'PajeH0mz4of85T9FB1oFzaB39lbNLbDbtCQ';

const tokenHeader = (username, options = {}) =>
    `Bearer ${Jwt.sign({user: username}, privateKey, {algorithm: 'HS256'})}`;


let users={

    'john':{data:{}}

}

const validate = async function (request, decodedToken) {

    const credentials = users[decodedToken.user];
    if (!credentials) {
        throw Boom.notFound();
    }
    return credentials;
};


async function _getServer(options) {

    let server = new Hapi.Server({});

    await server.register([
        {

            plugin: hapi_auth_jwt,
            options: {key: 'secret'}
        },
        require('vision'),
        {
            plugin: require('./index.js'),
            options: options
        },
    ])

    server.auth.strategy('jwt', 'jwt', {
        key: privateKey,
        validateFunc: validate,
        verifyOptions: {algorithms: ['HS256']}  // only allow HS256 algorithm
    });

    debug(path.basename(path.resolve()));

    server.views({
        engines: {
            html: handlebars
        },
        // relativeTo: __dirname,
        path: __dirname + '/views'

    });

    server.route([
        {
            method: 'GET',
            path: '/private',
            config: {
                auth: 'jwt'
            },
            handler: (request, h) => {
                return h.view('private');
            }
        }

    ]);

    await server.initialize();

    server.app.readyForTest = true;


    return server
}

function getServer(options) {
    let server = _getServer(options);
    return new Promise(resolve => {
        resolve(server)

    })

}

module.exports = {
    getServer,
    tokenHeader
}

