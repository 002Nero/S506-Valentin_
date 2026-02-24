'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class User extends Model {

    static get tableName() {
        return 'user';
    }

    static get jsonAttributes() {
        return ['scope'];
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
            lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
            username: Joi.string().min(3).required().example('jdoe'),
            password: Joi.string().min(8).required().example('password123'),
            mail: Joi.string().email().required().example('john.doe@example.com'),
            scope: Joi.array().items(Joi.string()).example(['user']),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert() {
        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;

        if (!this.scope) {
            this.scope = ['user'];
        }
    }

    $beforeUpdate() {
        this.updatedAt = new Date();
    }
};