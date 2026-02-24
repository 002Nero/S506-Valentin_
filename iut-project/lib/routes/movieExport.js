'use strict';

module.exports = {
    method: 'get',
    path: '/movies/export',
    options: {
        auth: { scope: ['admin'] },
        tags: ['api'],
        description: 'Export all movies to CSV and send via email'
    },
    handler: async (request, h) => {
        const { movieService } = request.services();
        const userEmail = request.auth.credentials.email;

        return await movieService.exportMovies(userEmail);
    }
};