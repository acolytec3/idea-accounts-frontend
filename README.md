# Accounts Example

## Setup Fauna

FaunaDB isn't natively supported by NextAuth at present though there is a half-finished DB adapater that can be made to work.  To make it work, do the following:
- `npm install fauna-schema-migrate`
- Run `npx fauna-schema-migrate init` in the root directory
- Copy all the files/directories from `{RootDir}/fauna/resources` to the same folder in your project
- Run `npx fauna-schema-migrate generate`
- Run `npx fauna-schema-migrate apply all`
- Copy `adapters/fauna/index.js` to `{RootDir}/adapters/fauna` in your project
- Add the following sections in `[..nextauth].ts` 
```js
import Adapter from '../../../adapters/fauna'
// ...Add the global const
const faunaClient = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});
// ...Add this to the configuration object for nextauth
  adapter: Adapter.Adapter({faunaClient}),
```

