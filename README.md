![](https://img.shields.io/badge/Built%20with%20%E2%9D%A4%EF%B8%8F-at%20Technologiestiftung%20Berlin-blue)

- [Giess den Kiez API](#giess-den-kiez-api)
  - [W.I.P. API Migration](#wip-api-migration)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Development](#development)
  - [Deploy](#deploy)
    - [Postgres DB with Supabase](#postgres-db-with-supabase)
    - [Vercel](#vercel)
        - [Vercel Environment Variables](#vercel-environment-variables)
  - [API Routes](#api-routes)
    - [API Authorization](#api-authorization)
  - [Develop](#develop)
  - [Tests](#tests)
  - [Giessdenkiez.de Supabase](#giessdenkiezde-supabase)
    - [Prerequisites](#prerequisites-1)
    - [Installation](#installation)
    - [Usage or Deployment](#usage-or-deployment)
    - [Radolan Harvester](#radolan-harvester)
    - [Development](#development-1)
    - [Tests](#tests-1)
  - [Contributors ✨](#contributors-)
  - [Credits](#credits)

# Giess den Kiez API

Build with Typescript connects to Supabase, runs on vercel.com.

🚨 Might become part of the [giessdenkiez-de](https://github.com/technologiestiftung/giessdenkiez-de) repo eventually.

Build with Typescript, Supabase and Auth0.com, runs on vercel.com

## W.I.P. API Migration

![](./docs/wip.png)

We are in the process of migrating the API fully to supabase. These docs are not up to date yet.

## Prerequisites

- [Vercel.com](https://vercel.com) Account
- [Auth0.com](https://auth0.com) Account
- [Supabase](https://supabase.com) Account
- Supabase CLI install with brew `brew install supabase/tap/supabase`
- [Docker](https://www.docker.com/) Dependency for Supabase

## Setup

Clone this repo and the Supabase repo

```bash
# for more info on supabase check out the giessdenkiez-de-supabase repo
git clone git@github.com:technologiestiftung/giessdenkiez-de-postgres-api.git
cd ../giessdenkiez-de-postgres-api
npm ci
# supabase only needed for local development
supabase start
# create .env file and populate with ENV variables from the supabase start command
cp .env.example .env
# SERVICE_ROLE_KEY=...
# SUPABASE_URL=...
# SUPABASE_ANON_KEY=...

```

<!--
### Auth0

Setup your auth0.com account and create a new API. Get your `jwksUri`, `issuer`, `audience`, `client_id` and `client_secret` values. The values for `client_id` and `client_secret` are only needed if you want to run local tests with tools like rest-client, Postman, Insomnia or Paw. This is explained later in this document. -->

## Development

In your supabase repo run

```bash
supabase start
```

Rename the file `.env.sample` to `.env` and fill in all the values you get from the command.

in your `giessdenkiez-de-postgres-api` repo run

```bash
npx vercel dev
```

## Deploy

### Postgres DB with Supabase

We use [Supabase](https://supabase.io/) to connect to our Postgres DB. Supabase is a free and open source alternative to Firebase. It is a hosted Postgres DB with a REST API and a realtime websocket API. It also comes with a web based GUI to manage your data.

### Vercel

Setup your vercel account. You might need to login. Run `npx vercel login`.
Deploy your application with `npx vercel`. This will create a new project on vercel.com and deploy the application.

##### Vercel Environment Variables

Add all your environment variables to the Vercel project by running the commands below. The cli will prompt for the values as input and lets you select if they should be added to `development`, `preview` and `production`. For local development you can overwrite these value with an `.env` file in the root of your project. It is wise to have one Supabase project for production and one for preview. The preview will then be used in deployment previews on GitHub. You can connect your vercel project with your GitHub repository on the vercel backend.

```bash
# the master key for supabase
vercel env add SUPABASE_SERVICE_ROLE_KEY
# the url to your supabase project
vercel env add SUPABASE_URL
# the user for the postgres db
# below are all taken from auth0.com
vercel env add jwksuri
vercel env add audience
vercel env add issuer
```

To let these variables take effect you need to deploy your application once more.

```bash
vercel --prod
```

<!-- Congrats. Your API should be up and running. You might need to request tokens for the your endpoints that need authentification. See the auth0.com docs for more info. -->

## API Routes

There are 3 main routes `/get`, `/post` and `/delete`.

On the `/get` route all actions are controlled by passing query strings. On the `/post` and `/delete` route you will work with the POST body. You will always have the `queryType` and sometimes additional values in all three of them. For example to fetch a specific tree run the following command.

```bash
curl --request GET \
  --url 'http://localhost:3000/get?queryType=byid&id=_01_' \

# to see a result from the prodcution api use
# https://giessdenkiez-de-postgres-api.vercel.app/get?queryType=byid&id=_0001wka6l
```

### API Authorization

Some of the request will need an authorization header. You can obtain a token by making a request to your auth0 token issuer.

```bash
curl --request POST \
  --url https://your-tenant.eu.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{"client_id": "abc","client_secret": "def","audience": "your-audience","grant_type": "client_credentials"}'
# fill in the dummy fields
```

This will respond with an `access_token`. Use it to make authenticated requests.

```bash
curl --request POST \
  --url http://localhost:3000/post \
  --header 'authorization: Bearer ACCESS_TOKEN' \
  --header 'content-type: application/json' \
  --data '{"queryType":"adopt","tree_id":"_01","uuid": "auth0|123"}'
```

Take a look into [docs/api.http](./docs/api.http). The requests in this file can be run with the VSCode extension [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client).

## Develop

```bash
# clone the supabase repo
git clone https://github.com/technologiestiftung/giessdenkiez-de-supabase/
cd giessdenkiez-de-supabase
# start the db
supabase start
```

## Tests

Locally you will need supabase running

```bash
cd giessdenkiez-de-supabase
supabase start

cd giessdenkiez-de-postgres-api
npm test
```

On CI the Supabase is started automagically. See [.github/workflows/tests.yml](.github/workflows/tests.yml)

<!-- redeploy dev 2021-03-15 16:00:51 -->

## Giessdenkiez.de Supabase

<!--


Bonus:

Use all-contributors

npx all-contributors-cli check
npx all-contributors-cli add ff6347 doc

You can use it on GitHub just by commeting on PRs and issues:

```
@all-contributors please add @ff6347 for infrastructure, tests and code
```
Read more here https://allcontributors.org/


Get fancy shields at https://shields.io
 -->

Running the giessdenkiez.de stack on supabase. WIP please ignore.

### Prerequisites

- Supabase account
- Docker
- Supabase CLI installed

### Installation

- Clone this repo
- install dependencies with `npm ci`
- Login into supabase with `supabase login`

### Usage or Deployment

- Create a project on supabase.com
- Configure your GitHub actions to deploy all migrations to staging and production. See [.github/workflows/deploy-to-supabase-staging.yml](.github/workflows/deploy-to-supabase-staging.yml) and [.github/workflows/deploy-to-supabase-production.yml](.github/workflows/deploy-to-supabase-production.yml) for an example. We are using actions environments to deploy to different environments. You can read more about it here: https://docs.github.com/en/actions/reference/environments.
  - Needed variables are:
    - `DB_PASSWORD`
    - `PROJECT_ID`
    - `SUPABASE_ACCESS_TOKEN`
- **(Not recommended but possible)** Link your local project directly to the remote `supabase link --project-ref <YOUR PROJECT REF>` (will ask you for your database password from the creation process)
- **(Not recommended but possible)** Push your local state directly to your remote project `supabase db push` (will ask you for your database password from the creation process)

### Radolan Harvester

if you want to use the [DWD Radolan harvester](https://github.com/technologiestiftung/giessdenkiez-de-dwd-harvester) you need to prepare some data in your database

- Update the table `radolan_harvester` with a time range for the last 30 days

```sql
INSERT INTO "public"."radolan_harvester" ("id", "collection_date", "start_date", "end_date")
	VALUES (1, (
			SELECT
				CURRENT_DATE - INTEGER '1' AS yesterday_date),
		(
			SELECT
				(
					SELECT
						CURRENT_DATE - INTEGER '31')::timestamp + '00:50:00'),
				(
					SELECT
						(
							SELECT
								CURRENT_DATE - INTEGER '1')::timestamp + '23:50:00'));
```

- Update the table `radolan_geometry` with sql file [radolan_geometry.sql](sql/radolan_geometry.sql) This geometry is Berlin only.
- Populate the table radolan_data with the content of [radolan_data.sql](sql/radolan_data.sql)

This process is actually a little blackbox we need to solve.

### Development

- Run `supabase start` to start the supabase stack
- Run `supabase stop` to stop the supabase stack (all changes not included in a migration will be lost)
- make changes to your db using sql and run `supabase db diff --file <MIGRATION FILE NAME> --schema public --use-migra` to create migrations
- Run `supabase gen types typescript --local > ./scripts/db-types.ts` to generate typescript types for your db

### Tests

- Run `npm test` to run the tests
-

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://fabianmoronzirfas.me/"><img src="https://avatars.githubusercontent.com/u/315106?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Fabian Morón Zirfas</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=ff6347" title="Code">💻</a> <a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=ff6347" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/fdnklg"><img src="https://avatars.githubusercontent.com/u/9034032?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Fabian</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=fdnklg" title="Code">💻</a> <a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=fdnklg" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/warenix"><img src="https://avatars.githubusercontent.com/u/1849536?v=4?s=64" width="64px;" alt=""/><br /><sub><b>warenix</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=warenix" title="Code">💻</a> <a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=warenix" title="Documentation">📖</a></td>
    <td align="center"><a href="https://it-freelancer.berlin/"><img src="https://avatars.githubusercontent.com/u/7558075?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Daniel Sippel</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=danielsippel" title="Documentation">📖</a></td>
    <td align="center"><a href="http://www.sebastianmeier.eu/"><img src="https://avatars.githubusercontent.com/u/302789?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Sebastian Meier</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=sebastian-meier" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/vogelino"><img src="https://avatars.githubusercontent.com/u/2759340?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Lucas Vogel</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=vogelino" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Credits

<table>
  <tr>
    <td>
      <a src="https://citylab-berlin.org/en/start/">
        <br />
        <br />
        <img width="200" src="https://logos.citylab-berlin.org/logo-citylab-berlin.svg" />
      </a>
    </td>
    <td>
      A project by: <a src="https://www.technologiestiftung-berlin.de/en/">
        <br />
        <br />
        <img width="150" src="https://logos.citylab-berlin.org/logo-technologiestiftung-berlin-en.svg" />
      </a>
    </td>
    <td>
      Supported by:
      <br />
      <br />
      <img width="120" src="https://logos.citylab-berlin.org/logo-berlin.svg" />
    </td>
  </tr>
</table>

[gdk-supabase]: https://github.com/technologiestiftung/giessdenkiez-de-supabase/
[supabase]: https://supabase.com/
<!-- bump -->
