import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { NextApiHandler } from "next";
import login, { emailLogin } from '../../../helpers/login'
import faunadb from "faunadb"
import Adapter from '../../../adapters/fauna'
import { ethers } from 'ethers'
const faunaClient = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});
const q = faunadb.query;

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

interface credentialsInterface {
  address: string;
  signature: string;
}

const options = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Providers.Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM
    }),
    Providers.Credentials({
      id: 'web3',
      name: 'Web3',
      credentials: {
        address: {
          label: 'address',
          type: 'text',
        },
        signature: {
          label: 'signature',
          type: 'text'
        }
      },
      async authorize(credentials: credentialsInterface) {
        try {
          let secretNumber = await faunaClient.query(q.Call('getCurrentNumber', credentials.address))
          let res;

          const signatureAddress = ethers.utils.verifyMessage('login'+ secretNumber, credentials.signature).toLowerCase();

          if (signatureAddress === credentials.address) {
            res = true;
            await faunaClient.query(q.Call('deleteNumber', credentials.address));
          }

          if (res) {
            const user = { name: credentials.address, email: undefined, source: 'web3' };
            return user;
          }
        }
        catch (err) {
          console.log('ERR', err);
          throw '/'
        }
      }
    }
    )
  ],
  adapter: Adapter.Adapter({ faunaClient }),
  session: {
    jwt: true,
  },
  callbacks: {
    async signIn(user, account, profile) {
      const provider = account.provider ?? account.id;
      const username = user.name ?? user.email;
      const res = await login(username, user.email, provider, user.image);
      if (res) {
        return true
      }
      else {
        return false;
      }
    },
  },
  pages: {
    //   signIn: '/auth/signin'
  },
  debug: true
};
