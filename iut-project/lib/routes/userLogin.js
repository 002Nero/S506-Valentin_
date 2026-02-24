'use strict';

const Joi = require('joi');

module.exports = {
    method: 'post',
    path: '/user/login',
    options: {
        auth: false,
        tags: ['api'],
        validate: {
            payload: Joi.object({
                mail: Joi.string().email().required(),
                password: Joi.string().required()
            })
        }
    },
    handler: async (request, h) => {
        const { userService } = request.services();
        return await userService.login(request.payload.mail, request.payload.password);
    }
};