'use strict';

module.exports = {
    method: 'post',
    path: '/user',
    options: {
        auth: false,
        tags: ['api'],
        validate: {
            payload: require('../models/user').joiSchema
        }
    },
    handler: async (request, h) => {
        const { userService } = request.services();
        return await userService.create(request.payload);
    }
};