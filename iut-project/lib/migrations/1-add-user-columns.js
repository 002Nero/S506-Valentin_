'use strict';

module.exports = {
    async up(knex) {
        const hasTable = await knex.schema.hasTable('user');
        if (!hasTable) {
            return;
        }

        const hasUsername = await knex.schema.hasColumn('user', 'username');
        const hasPassword = await knex.schema.hasColumn('user', 'password');
        const hasMail = await knex.schema.hasColumn('user', 'mail');

        await knex.schema.alterTable('user', (table) => {
            if (!hasUsername) {
                table.string('username');
            }
            if (!hasPassword) {
                table.string('password');
            }
            if (!hasMail) {
                table.string('mail');
            }
        });

        if (!hasUsername) {
            await knex.raw('ALTER TABLE `user` MODIFY `username` varchar(255) NOT NULL');
            await knex.raw('ALTER TABLE `user` ADD UNIQUE `user_username_unique`(`username`)');
        }

        if (!hasPassword) {
            await knex.raw('ALTER TABLE `user` MODIFY `password` varchar(255) NOT NULL');
        }

        if (!hasMail) {
            await knex.raw('ALTER TABLE `user` MODIFY `mail` varchar(255) NOT NULL');
            await knex.raw('ALTER TABLE `user` ADD UNIQUE `user_mail_unique`(`mail`)');
        }
    },

    async down(knex) {
        const hasTable = await knex.schema.hasTable('user');
        if (!hasTable) {
            return;
        }

        const hasUsername = await knex.schema.hasColumn('user', 'username');
        const hasPassword = await knex.schema.hasColumn('user', 'password');
        const hasMail = await knex.schema.hasColumn('user', 'mail');

        if (hasUsername) {
            await knex.raw('ALTER TABLE `user` DROP INDEX `user_username_unique`');
        }
        if (hasMail) {
            await knex.raw('ALTER TABLE `user` DROP INDEX `user_mail_unique`');
        }

        await knex.schema.alterTable('user', (table) => {
            if (hasUsername) {
                table.dropColumn('username');
            }
            if (hasPassword) {
                table.dropColumn('password');
            }
            if (hasMail) {
                table.dropColumn('mail');
            }
        });
    }
};