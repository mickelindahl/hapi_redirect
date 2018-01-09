/**
 * Created by Mikael Lindahl (mikael) on 10/3/16.
 */

'use strict';


const Lab = require('lab');
const code = require('code');
const debug = require('debug')('hapi_redirect:test');
const test_server = require('../test_server.js');
const getServer = test_server.getServer;
const tokenHeader = test_server.tokenHeader;
let lab = exports.lab = Lab.script();

lab.experiment('hapi redirect', () => {

    lab.test('redirect at 302 (authorized)',
        async () => {

            await getServer({
                actions: [{
                    status_code: "401",
                    redirect: () => {
                        return {url: "/login"}
                    }
                },
                    {
                    status_code: "404s",
                    redirect: () => {
                        return {url: "/login"}
                    }
                }]
            }).then(server => {

                let options = {
                    method: "GET",
                    url: "/private"
                };

                return server.inject(options).then(response => {

                    // server.stop();
                    code.expect(response.statusCode).to.equal(302);

                });
            });
        });

    lab.test('no redirect 401',
        async () => {

            await getServer({
                actions: [{
                    status_code: "401",
                    redirect: () => {
                        return null
                    }
                }]
            }).then(server => {

                let options = {
                    method: "GET",
                    url: "/private"
                };

                return server.inject(options).then(response => {

                    console.log(response.result)
                    // server.stop();
                    code.expect(response.statusCode).to.equal(401);

                })
            });
        });


    lab.test('bad action return request 401',
        async () => {

            await getServer({
                actions: [{
                    status_code: "401",
                    redirect: () => {
                        return {bad: '!'}
                    }
                }]
            }).then(server => {

                let options = {
                    method: "GET",
                    url: "/private"
                };

                return server.inject(options).then(response => {

                    console.log(response.result)
                    // server.stop();
                    code.expect(response.statusCode).to.equal(400);

                })
            });
        });

    lab.test('authorized 200 (authorized)',
        async () => {

            await getServer({
                actions: [{
                    status_code: "401",
                    redirect: () => {
                        return {url: "/login"}
                    }
                }]
            }).then(server => {

                let options = {
                    method: "GET",
                    url: "/private",
                    headers: {authorization: tokenHeader('john', {})},
                    // credentials: {} // To bypass auth strategy
                };

                return server.inject(options).then(response => {

                    // server.stop();
                    code.expect(response.statusCode).to.equal(200);

                });
            });
        });

    lab.test('redirect at 401 with host defined (unauthorized)',
        async () => {

            await getServer({
                actions: [{
                    status_code: "401",
                    redirect: () => {
                        return {url: "/login", host: "http://host.com"}
                    }
                }]
            }).then(server => {

                let options = {
                    method: "GET",
                    url: "/private",
                    headers: {authorization: tokenHeader('adam')}

                    // credentials: {} // To bypass auth strategy
                };

                return server.inject(options).then(response => {

                    code.expect(response.statusCode).to.equal(302);
                    server.stop();

                });
            });
        });
    //
    // lab.test('no redirect at 404 (not found)',
    //     async () => {
    //
    //         await getServer({
    //             redirect: {
    //                 status_code: "401",
    //                 redirect: "/login"
    //             }
    //         }).then((server) => {
    //             let options = {
    //                 method: "GET",
    //                 url: "/no",
    //                 credentials: {} // To bypass auth strategy
    //             };
    //
    //             debug('before inject')
    //
    //             return server.inject(options).then(response => {
    //
    //                 code.expect(response.statusCode).to.equal(404);
    //                 server.stop();
    //
    //             });
    //         });
    //     })
    //
    // lab.test('login ok',
    //     async () => {
    //         getServer({
    //             redirect: {
    //                 status_code: "401",
    //                 redirect: "/login"
    //             }
    //         }).then((server) => {
    //             let options = {
    //                 method: "GET",
    //                 url: "/login",
    //                 headers: { authorization: tokenHeader('john', { algorithm: 'HS256' }) }
    //
    //                 // credentials: {} // To bypass auth strategy
    //             };
    //
    //             debug('before inject')
    //
    //             return server.inject(options).then(response => {
    //
    //                 code.expect(response.statusCode).to.equal(200);
    //                 server.stop();
    //
    //             });
    //         });
    //     })
    //
    // lab.test('login ok set tow entries',
    //     async () => {
    //         await getServer({
    //             redirect: [{
    //                 status_code: "401",
    //                 redirect: "/login"
    //             },
    //                 {
    //                     status_code: "200",
    //                     redirect: "/login"
    //                 }
    //             ]
    //         }).then((server) => {
    //             let options = {
    //                 method: "GET",
    //                 url: "/login",
    //                 headers: { authorization: tokenHeader('john', { algorithm: 'HS256' }) }
    //
    //                 // credentials: {} // To bypass auth strategy
    //             };
    //
    //             debug('before inject');
    //
    //             return server.inject(options).then(response => {
    //
    //                 code.expect(response.statusCode).to.equal(200);
    //                 server.stop();
    //
    //             });
    //         });
    //     })
});
