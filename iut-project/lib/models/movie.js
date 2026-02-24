'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Movie extends Model {
    static get tableName() { return 'movie'; }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer(),
            title: Joi.string().min(1).required(),
            description: Joi.string().required(),
            releaseDate: Joi.date().required(),
            director: Joi.string().required(),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeUpdate() { this.updatedAt = new Date(); }
};