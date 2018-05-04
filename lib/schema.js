/**
 *Created by Mikael Lindahl on 2018-01-09
 */

"use strict"

const Joi = require('joi');

module.exports = {
    options: {
        actions: Joi.array().items(Joi.object({

            redirect: Joi.func().description(' Function that returns a redirect path'),
            status_code: Joi.string().required().description('Request status code to redirect e.g. 401 - unauthorized'),

        })).required()
    },
    redirect:Joi.alternatives({

        host:Joi.string(),
        url:Joi.string().required(),
        include_query: Joi.boolean()
        

    }, {})
};