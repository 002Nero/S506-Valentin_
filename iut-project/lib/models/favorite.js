'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Favorite extends Model {

    static get tableName() {
        return 'favorite';
    }

    static get joiSchema() {
        return Joi.object({
            userId: Joi.number().integer().required(),
            movieId: Joi.number().integer().required()
        });
    }
    static get relationMappings() {
        const User = require('./user');
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: { from: 'favorite.userId', to: 'user.id' }
            }
        };
    }
};