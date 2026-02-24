# IUT Project - API REST de Gestion de Films

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![Hapi.js](https://img.shields.io/badge/Hapi.js-v20-orange.svg)](https://hapi.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-v8+-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-ISC-lightgrey.svg)](LICENSE)

API REST complète pour la gestion d'utilisateurs et de films, construite avec le framework **Hapi.js** et l'écosystème **HapiPal**. Cette application propose une authentification JWT, un système de favoris, l'envoi d'emails automatisés et une documentation Swagger intégrée.

---

## Table des Matières

- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement](#lancement)
- [Documentation API](#documentation-api)
- [Authentification](#authentification)
- [Endpoints API](#endpoints-api)
- [Base de Données](#base-de-données)
- [Service Email](#service-email)
- [Tests](#tests)
- [Structure du Projet](#structure-du-projet)
- [Sécurité](#sécurité)
- [Contribution](#contribution)
- [Licence](#licence)

---

## Fonctionnalités

### Gestion des Utilisateurs
- Inscription avec envoi d'email de bienvenue
- Authentification JWT sécurisée
- Gestion des rôles (user, admin)
- CRUD complet des utilisateurs
- Hash des mots de passe (SHA256)

### Gestion des Films
- CRUD complet des films
- Export de films au format CSV
- Système de favoris utilisateur

### Technique
- Documentation Swagger auto-générée
- Validation des données avec Joi
- Migrations de base de données automatiques
- Architecture modulaire HapiPal

---

## Architecture

Le projet suit l'architecture **HapiPal** avec une organisation modulaire :

```
┌─────────────────────────────────────────────────────────────┐
│                        Client HTTP                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Hapi.js Server                           │
│                    (Port 3000)                              │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
       ┌──────────┐    ┌──────────┐    ┌──────────┐
       │  Routes  │    │   Auth   │    │ Swagger  │
       │          │    │   JWT    │    │   Docs   │
       └──────────┘    └──────────┘    └──────────┘
              │
              ▼
       ┌──────────┐
       │ Services │
       │ (Business│
       │  Logic)  │
       └──────────┘
              │
              ▼
       ┌──────────┐
       │  Models  │
       │(Objection│
       │   ORM)   │
       └──────────┘
              │
              ▼
       ┌──────────┐
       │  MySQL   │
       │ Database │
       └──────────┘
```

---

## Prérequis

- **Node.js** v14.x ou supérieur
- **npm** v6.x ou supérieur
- **MySQL** v8.x ou supérieur
- **Git**

---

## Installation

### 1. Cloner le repository

```bash
git clone <repository-url>
cd S506-Valentin
```

### 2. Installer les dépendances

```bash
# Installer les dépendances du module d'encryption
cd iut-encrypt
npm install

# Installer les dépendances du projet principal
cd ../iut-project
npm install
```

### 3. Configurer la base de données

Créez une base de données MySQL :

```sql
CREATE DATABASE user CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Configuration

### Variables d'environnement

Créez un fichier `.env` dans le dossier `iut-project/server/` :

```env
# Serveur
PORT=3000
NODE_ENV=development

# Base de données
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=hapi
DB_NAME=user

# Email (Ethereal pour le développement)
MAIL_HOST=smtp.ethereal.email
MAIL_PORT=587
MAIL_USER=votre_email@ethereal.email
MAIL_PASS=votre_mot_de_passe
```

> **Note** : Pour le développement, utilisez [Ethereal](https://ethereal.email/) pour capturer les emails de test.

---

## Lancement

### Développement

```bash
cd iut-project
npm start
```

Le serveur démarre sur `http://localhost:3000`

### Production

```bash
NODE_ENV=production npm start
```

---

## Documentation API

Une documentation Swagger interactive est disponible à l'adresse :

```
http://localhost:3000/documentation
```

Cette documentation permet de :
- Visualiser tous les endpoints disponibles
- Tester les requêtes directement depuis le navigateur
- Voir les schémas de données attendus

---

## Authentification

L'API utilise **JWT (JSON Web Tokens)** pour l'authentification.

### Obtenir un token

```http
POST /user/login
Content-Type: application/json

{
  "mail": "user@example.com",
  "password": "password123"
}
```

### Utiliser le token

Ajoutez le header `Authorization` à vos requêtes :

```
Authorization: Bearer <votre_token>
```

### Scopes (Rôles)

| Scope   | Description                                      |
|---------|--------------------------------------------------|
| `user`  | Accès aux fonctionnalités utilisateur standard   |
| `admin` | Accès complet incluant la gestion des utilisateurs |

---

## Endpoints API

### Utilisateurs

| Méthode  | Endpoint       | Auth | Scope       | Description              |
|----------|----------------|------|-------------|--------------------------|
| `POST`   | `/user`        | Non  | -           | Créer un utilisateur     |
| `POST`   | `/user/login`  | Non  | -           | Se connecter             |
| `GET`    | `/users`       | Oui  | user, admin | Lister les utilisateurs  |
| `PATCH`  | `/user/{id}`   | Oui  | admin       | Modifier un utilisateur  |
| `DELETE` | `/user/{id}`   | Oui  | admin       | Supprimer un utilisateur |

### Films

| Méthode  | Endpoint         | Auth | Scope       | Description       |
|----------|------------------|------|-------------|-------------------|
| `POST`   | `/movie`         | Oui  | admin       | Créer un film     |
| `GET`    | `/movies`        | Oui  | user, admin | Lister les films  |
| `PATCH`  | `/movie/{id}`    | Oui  | admin       | Modifier un film  |
| `DELETE` | `/movie/{id}`    | Oui  | admin       | Supprimer un film |
| `GET`    | `/movies/export` | Oui  | admin       | Exporter en CSV   |

### Favoris

| Méthode  | Endpoint                   | Auth | Scope | Description        |
|----------|----------------------------|------|-------|--------------------|
| `POST`   | `/user/favorite/{movieId}` | Oui  | user  | Ajouter un favori  |
| `DELETE` | `/user/favorite/{movieId}` | Oui  | user  | Retirer un favori  |

---

## Base de Données

### Schéma des tables

#### Table `user`

| Colonne     | Type         | Description                       |
|-------------|--------------|-----------------------------------|
| `id`        | INT (PK)     | Identifiant unique auto-incrémenté |
| `firstName` | VARCHAR(255) | Prénom                            |
| `lastName`  | VARCHAR(255) | Nom                               |
| `username`  | VARCHAR(255) | Nom d'utilisateur (unique)        |
| `password`  | VARCHAR(255) | Mot de passe hashé                |
| `mail`      | VARCHAR(255) | Adresse email (unique)            |
| `scope`     | JSON         | Rôles de l'utilisateur            |
| `createdAt` | DATETIME     | Date de création                  |
| `updatedAt` | DATETIME     | Date de mise à jour               |

#### Table `movie`

| Colonne       | Type         | Description        |
|---------------|--------------|--------------------|
| `id`          | INT (PK)     | Identifiant unique |
| `title`       | VARCHAR(255) | Titre du film      |
| `description` | TEXT         | Description        |
| `releaseDate` | DATE         | Date de sortie     |
| `director`    | VARCHAR(255) | Réalisateur        |
| `createdAt`   | DATETIME     | Date de création   |
| `updatedAt`   | DATETIME     | Date de mise à jour |

#### Table `favorite`

| Colonne   | Type     | Description            |
|-----------|----------|------------------------|
| `id`      | INT (PK) | Identifiant unique     |
| `userId`  | INT (FK) | Référence vers user    |
| `movieId` | INT (FK) | Référence vers movie   |

### Exécuter les migrations

Les migrations sont exécutées automatiquement au démarrage du serveur (`migrateOnStart: true`).

Pour les exécuter manuellement :

```bash
npx knex migrate:latest
```

---

## Service Email

Le service email utilise **Nodemailer** pour envoyer des emails automatisés.

### Fonctionnalités
- Email de bienvenue à l'inscription
- Support SMTP configurable

### Configuration pour le développement

Utilisez [Ethereal](https://ethereal.email/) pour tester :

1. Créez un compte sur https://ethereal.email/
2. Récupérez les identifiants SMTP
3. Configurez le fichier `.env`

---

## Tests

Exécuter les tests :

```bash
npm test
```

Exécuter le linter :

```bash
npm run lint
```

---

## Structure du Projet

```
S506-Valentin/
├── iut-encrypt/                  # Module d'encryption
│   ├── index.js                  # Fonction SHA256
│   └── package.json
│
├── iut-project/                  # Application principale
│   ├── lib/
│   │   ├── auth/                 # Configuration authentification
│   │   │   ├── default.js        # Stratégie par défaut
│   │   │   └── strategies/
│   │   │       └── jwt.js        # Stratégie JWT
│   │   │
│   │   ├── migrations/           # Migrations Knex
│   │   │   ├── 0-user.js
│   │   │   ├── 1-add-user-columns.js
│   │   │   ├── 2-add-scope-field.js
│   │   │   ├── 20260222002032_add-movie.js
│   │   │   └── 20260224024607_add-favorite-table.js
│   │   │
│   │   ├── models/               # Modèles Objection.js
│   │   │   ├── user.js
│   │   │   ├── movie.js
│   │   │   └── favorite.js
│   │   │
│   │   ├── plugins/              # Plugins HapiPal
│   │   │   ├── @hapi.jwt.js
│   │   │   ├── @hapipal.schmervice.js
│   │   │   └── @hapipal.schwifty.js
│   │   │
│   │   ├── routes/               # Routes API
│   │   │   ├── user.js
│   │   │   ├── userLogin.js
│   │   │   ├── userList.js
│   │   │   ├── userUpdate.js
│   │   │   ├── userDelete.js
│   │   │   ├── userFavorite.js
│   │   │   ├── movie.js
│   │   │   ├── movieUpdate.js
│   │   │   └── movieExport.js
│   │   │
│   │   ├── services/             # Services métier
│   │   │   ├── user.js
│   │   │   ├── movie.js
│   │   │   └── mail.js
│   │   │
│   │   └── index.js              # Point d'entrée du plugin
│   │
│   ├── server/
│   │   ├── index.js              # Initialisation serveur
│   │   ├── manifest.js           # Configuration Glue
│   │   └── plugins/
│   │       └── swagger.js        # Configuration Swagger
│   │
│   ├── test/                     # Tests
│   │   └── index.js
│   │
│   ├── .env                      # Variables d'environnement
│   ├── knexfile.js               # Configuration Knex
│   └── package.json
│
└── README.md
```

---

## Sécurité

### Mesures implémentées

- **Hashage des mots de passe** : SHA256 via le module `iut-encrypt`
- **JWT** : Tokens sécurisés avec expiration
- **Validation** : Toutes les entrées validées avec Joi
- **Scopes** : Contrôle d'accès basé sur les rôles
- **Gestion d'erreurs** : Messages d'erreur appropriés sans fuite d'informations

### Recommandations pour la production

- [ ] Utiliser HTTPS
- [ ] Configurer des secrets JWT robustes
- [ ] Mettre en place un rate limiting
- [ ] Utiliser bcrypt au lieu de SHA256 pour les mots de passe
- [ ] Configurer CORS correctement
- [ ] Mettre en place des logs de sécurité

---

## Technologies Utilisées

| Technologie                                                  | Version | Usage                     |
|--------------------------------------------------------------|---------|---------------------------|
| [Node.js](https://nodejs.org/)                               | 14+     | Runtime JavaScript        |
| [Hapi.js](https://hapi.dev/)                                 | 20.x    | Framework HTTP            |
| [HapiPal](https://hapipal.com/)                              | -       | Écosystème Hapi           |
| [Objection.js](https://vincit.github.io/objection.js/)       | 2.x     | ORM                       |
| [Knex.js](http://knexjs.org/)                                | 0.21.x  | Query Builder & Migrations |
| [MySQL](https://www.mysql.com/)                              | 8+      | Base de données           |
| [JWT](https://jwt.io/)                                       | -       | Authentification          |
| [Joi](https://joi.dev/)                                      | 17.x    | Validation                |
| [Nodemailer](https://nodemailer.com/)                        | 8.x     | Envoi d'emails            |
| [Swagger](https://swagger.io/)                               | -       | Documentation API         |

---

## Contribution

Les contributions sont les bienvenues. Voici comment participer :

1. **Fork** le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. **Commitez** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une **Pull Request**

### Guidelines

- Respectez le style de code existant
- Ajoutez des tests pour les nouvelles fonctionnalités
- Mettez à jour la documentation si nécessaire
- Vérifiez que les tests passent avant de soumettre

---

## Licence

Ce projet est sous licence **ISC**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## Auteur

**Valentin** - Projet IUT S506


