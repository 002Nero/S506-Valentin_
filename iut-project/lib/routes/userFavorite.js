'use strict';

const Joi = require('joi');

module.exports = [
    {
        method: 'post',
        path: '/user/favorite/{movieId}',
        options: {
            auth: { scope: ['user'] },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    movieId: Joi.number().integer().required()
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            return await userService.addFavorite(request.auth.credentials.id, request.params.movieId);
        }
    },
    {
        method: 'delete',
        path: '/user/favorite/{movieId}',
        options: {
            auth: { scope: ['user'] },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    movieId: Joi.number().integer().required()
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            return await userService.removeFavorite(request.auth.credentials.id, request.params.movieId);
        }
    }
];