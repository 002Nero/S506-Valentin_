'use strict';

const Dotenv = require('dotenv');
const Confidence = require('@hapipal/confidence');
const Toys = require('@hapipal/toys');
const Schwifty = require('@hapipal/schwifty');

// Charge le fichier .env dans process.env
Dotenv.config({ path: `${__dirname}/.env` });

// Configuration du manifest pour Glue
module.exports = new Confidence.Store({
    server: {
        host: 'localhost',
        port: {
            $env: 'PORT',
            $coerce: 'number',
            $default: 3000
        },
        debug: {
            $filter: { $env: 'NODE_ENV' },
            $default: {
                log: ['error', 'start'],
                request: ['error']
            },
            production: {
                request: ['implementation']
            }
        }
    },
    register: {
        plugins: [
            {
                plugin: '../lib', // Plugin principal
                options: {}
            },
            {
                plugin: './plugins/swagger' // Ajouté par le flavor swagger
            },
            {
                plugin: '@hapipal/schwifty', // Ajouté par le flavor objection
                options: {
                    $filter: 'NODE_ENV',
                    $default: {},
                    $base: {
                        migrateOnStart: true,
                        knex: {
                            client: 'mysql',
                            connection: {
                                host: process.env.DB_HOST || '0.0.0.0',
                                user: process.env.DB_USER || 'root',
                                password: process.env.DB_PASSWORD || 'hapi',
                                database: process.env.DB_DATABASE || 'user',
                                port: process.env.DB_PORT || 3306
                            }
                        }
                    },
                    production: {
                        migrateOnStart: false
                    }
                }
            },
            {
                plugin: {
                    $filter: { $env: 'NODE_ENV' },
                    $default: '@hapipal/hpal-debug',
                    production: Toys.noop
                }
            }
        ]
    }
});