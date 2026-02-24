'use strict';

const Dotenv = require('dotenv');
const Confidence = require('@hapipal/confidence');

Dotenv.config({ path: `${__dirname}/.env` });

module.exports = new Confidence.Store({
    server: {
        host: 'localhost',
        port: {
            $env: 'PORT',
            $coerce: 'number',
            $default: 3000
        },
        debug: {
            $filter: 'NODE_ENV',
            $default: {
                log: ['error', 'warn'],
                request: ['error', 'warn']
            },
            production: {
                request: ['implementation']
            }
        }
    },
    register: {
        plugins: [
            {
                plugin: '../lib',
                options: {}
            },
            {
                plugin: './plugins/swagger'
            },
            {
                plugin: '@hapipal/schwifty',
                options: {
                    $filter: 'NODE_ENV',
                    $default: {
                        migrateOnStart: true,
                        knex: {
                            client: 'mysql',
                            connection: {
                                host: { $env: 'DB_HOST', $default: 'localhost' },
                                user: { $env: 'DB_USER', $default: 'root' },
                                password: { $env: 'DB_PASSWORD', $default: 'hapi' },
                                database: { $env: 'DB_NAME', $default: 'user' },
                                port: { $env: 'DB_PORT', $coerce: 'number', $default: 3307 }
                            }
                        }
                    }
                }
            },
            {
                plugin: '@hapipal/schmervice'
            }
        ]
    }
});