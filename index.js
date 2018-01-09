/**
 * Created by Mikael Lindahl on 9/9/16.
 */

'use strict';

const boom = require('boom');
const debug = require('debug')('hapi-redirect:index');
const Joi = require('joi');
const Package = require('./package.json');
const schema = require('./lib/schema');


/**@module hapi-redirect*/

/**
 * - `options` Object with the following keys
 *   - `default`
 *     - redirect {string} Default redirect endpoint
 *     - `host` {string} Host that redirection comes from.
 *     Only necessary to set if it differs from the host you are redirecting to.
 *   - actions {array} List with redirect actions
 *     - `status_code` {string} Request status code to redirect e.g. 401 - unauthorized
 *     - `redirect(url)` {function} Function that should return `{ url: ..., [host:...]}`
 *     if redirect should be done or null if not
 */
exports.plugin = {
    register: async function (server, options) {

        Joi.assert(options, schema.options, "Bad plugin options for hapi-redirect");

        // onPreResponse intercepts ALL errors
        server.ext('onPreResponse', (request, h) => {

            debug('onPreResponse');

            const response = request.response;

            if (response.isBoom) {
                let status_code = response.output.payload.statusCode;

                let candidates = []

                for (let i = 0; i < options.actions.length; i++) {

                    let a = options.actions[i];

                    if (a.status_code != status_code) {

                        continue

                    }

                    let response = a.redirect(request.url.path);

                    if (!response) {

                        continue
                    }

                    let result = Joi.validate(response, schema.redirect);

                    if (result.error){

                        return boom.badRequest(result.error)

                    }

                    candidates.push(result.value);

                }

                if (candidates.length) {

                    let response=candidates[0]

                    let redirect = response.host ?
                        response.host + response.url :
                        response.url;

                    return h.redirect(redirect + '?redirect=' + response.url)
                }


            }

            return h.continue;

        });
    },
    pkg: Package

};

