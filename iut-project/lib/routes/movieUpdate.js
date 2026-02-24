'use strict';

const Joi = require('joi');

module.exports = {
    method: 'patch',
    path: '/movie/{id}',
    options: {
        auth: { scope: ['admin'] },
        tags: ['api'],
        validate: {
            params: Joi.object({
                id: Joi.number().integer().required()
            }),
            payload: Joi.object({
                title: Joi.string().min(3),
                description: Joi.string(),
                releaseDate: Joi.date(),
                director: Joi.string()
            })
        }
    },
    handler: async (request, h) => {
        const { movieService } = request.services();
        return await movieService.update(request.params.id, request.payload);
    }
};