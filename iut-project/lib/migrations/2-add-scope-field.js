'use strict';

module.exports = {
    async up(knex) {
        const hasTable = await knex.schema.hasTable('user');
        if (!hasTable) {
            return;
        }

        const hasScope = await knex.schema.hasColumn('user', 'scope');
        if (hasScope) {
            return;
        }

        await knex.schema.alterTable('user', (table) => {
            table.json('scope').notNull();
        });
    },

    async down(knex) {
        const hasTable = await knex.schema.hasTable('user');
        if (!hasTable) {
            return;
        }

        const hasScope = await knex.schema.hasColumn('user', 'scope');
        if (!hasScope) {
            return;
        }

        await knex.schema.alterTable('user', (table) => {
            table.dropColumn('scope');
        });
    }
};