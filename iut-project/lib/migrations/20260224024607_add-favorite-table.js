'use strict';

exports.up = async (knex) => {
    await knex.schema.createTable('favorite', (table) => {
        table.integer('userId').unsigned().notNullable().references('id').inTable('user').onDelete('CASCADE');
        table.integer('movieId').unsigned().notNullable().references('id').inTable('movie').onDelete('CASCADE');
        table.primary(['userId', 'movieId']);
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTableIfExists('favorite');
};