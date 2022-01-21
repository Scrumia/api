# 👋 Capuches d'Opale API

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](http://api-capuche-dopale.herokuapp.com/docs)

This API is built using AdonisJS.

### ✨ [Demo](http://api-capuche-dopale.herokuapp.com/)

## Installation

```sh
# Install dependencies
npm install

# Create an environment file - Change the values before continuing
cp .env.example .env

# You must create a database before continuing

# Run database migrations
node ace migration:run
```

The OpenAPI documentation is available [HERE](https://api-capuche-dopale.herokuapp.com/docs/index.html).
You can also view it with an OpenAPI readers like [Redoc](https://redocly.github.io/redoc/?url=http://localhost/swagger.json&nocors).

### Seeds

It's possible to populate database with some seeders. It will generate random `users`, `requests` and more.

```sh
# Run database seeders
node ace db:seed
```

By default, two users are created :

- `admin@scrumia.com / admin44`
- `john@scrumia.com / admin44`

## Usage

```sh
# Run server in watch mode
node ace serve --watch
```

By default, the server started at port `3333`.

## Tests

```sh
# Run tests
npm run test

# Run tests + show code coverage
npm run coverage
```
