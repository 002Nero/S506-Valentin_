'use strict';

const Nodemailer = require('nodemailer');

module.exports = class MailService {

    constructor(server, options) {
        this.server = server;
        this.options = options;
    }

    async getTransporter() {
        return Nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
        });
    }

    async sendWelcomeEmail(user) {
        const transporter = await this.getTransporter();
        const info = await transporter.sendMail({
            from: '"IUT Movie" <no-reply@iut.fr>',
            to: user.mail,
            subject: 'Bienvenue !',
            text: `Bonjour ${user.firstName}, votre compte est créé.`
        });
        console.log('Mail Bienvenue :', Nodemailer.getTestMessageUrl(info));
    }

    async sendNewMovieEmail(user, movie) {
        const transporter = await this.getTransporter();
        const info = await transporter.sendMail({
            from: '"IUT Movie" <no-reply@iut.fr>',
            to: user.mail,
            subject: `Nouveau film : ${movie.title}`,
            text: `Le film ${movie.title} est disponible.`
        });
        console.log('Notif Nouveau Film :', Nodemailer.getTestMessageUrl(info));
    }

    async sendMovieModifiedEmail(user, movie) {
        const transporter = await this.getTransporter();
        const info = await transporter.sendMail({
            from: '"IUT Movie" <no-reply@iut.fr>',
            to: user.mail,
            subject: `Mise à jour : ${movie.title}`,
            text: `Le film ${movie.title} dans vos favoris a été modifié.`
        });
        console.log('Notif Fan :', Nodemailer.getTestMessageUrl(info));
    }

    async sendMovieExport(email, csvContent) {
        const transporter = await this.getTransporter();

        const info = await transporter.sendMail({
            from: '"IUT Movie" <no-reply@iut.fr>',
            to: email,
            subject: 'Export CSV des films',
            text: 'Veuillez trouver ci-joint l\'export CSV de la liste des films demandée.',
            attachments: [
                {
                    filename: 'movies.csv',
                    content: csvContent
                }
            ]
        });

        console.log('Lien Export CSV :', Nodemailer.getTestMessageUrl(info));
    }
};