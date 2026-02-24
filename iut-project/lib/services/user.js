'use strict';

const Boom = require('@hapi/boom');

module.exports = class UserService {

    constructor(server, options) {
        this.server = server;
        this.options = options;
    }

    async create(user) {
        const { User } = this.server.models();
        const { mailService } = this.server.services();
        const newUser = await User.query().insertAndFetch(user);
        await mailService.sendWelcomeEmail(newUser);
        return newUser;
    }

    async addFavorite(userId, movieId) {
        const { Favorite } = this.server.models();
        try {
            return await Favorite.query().insert({ userId, movieId });
        } catch (err) {
            if (err.nativeError && err.nativeError.code === 'ER_DUP_ENTRY') {
                throw Boom.conflict('Ce film est déjà dans vos favoris'); // Consigne : Erreurs appropriées
            }
            throw err;
        }
    }

    async removeFavorite(userId, movieId) {
        const { Favorite } = this.server.models();
        const rowsDeleted = await Favorite.query().delete().where({ userId, movieId });
        if (rowsDeleted === 0) {
            throw Boom.notFound('Ce film n\'est pas dans vos favoris'); // Consigne : Erreurs appropriées
        }
        return { message: 'Favori supprimé' };
    }
};