'use strict';

module.exports = class MovieService {

    constructor(server, options) {
        this.server = server;
        this.options = options;
    }

    async create(movie) {
        const { Movie, User } = this.server.models();
        const { mailService } = this.server.services();
        const newMessage = await Movie.query().insertAndFetch(movie);


        const users = await User.query();
        for (const user of users) {
            mailService.sendNewMovieEmail(user, newMessage);
        }
        return newMessage;
    }

    async update(id, movieData) {
        const { Movie, Favorite } = this.server.models();
        const { mailService } = this.server.services();
        const updatedMovie = await Movie.query().patchAndFetchById(id, movieData);

        // Notif aux FANS uniquement
        const fans = await Favorite.query().where('movieId', id).withGraphFetched('user');
        for (const fan of fans) {
            if (fan.user) await mailService.sendMovieModifiedEmail(fan.user, updatedMovie);
        }
        return updatedMovie;
    }

    async exportMovies(adminEmail) {
        const { Movie } = this.server.models();
        const { mailService } = this.server.services();
        const movies = await Movie.query();
        let csv = 'id;title;director\n';
        for (const m of movies) { csv += `${m.id};"${m.title}";"${m.director}"\n`; }

        await mailService.sendMovieExport(adminEmail, csv);
        return { status: 'Export queued' };
    }
};