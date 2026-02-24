'use strict';

const Joi = require('joi');

module.exports = {
    method: 'delete',
    path: '/user/{id}',
    options: {
        auth: { scope: ['admin'] },
        tags: ['api'],
        validate: {
            params: Joi.object({ id: Joi.number().integer().required() })
        }
    },
    handler: async (request, h) => {
        const { userService } = request.services();
        await userService.delete(request.params.id);
        return '';
    }
};