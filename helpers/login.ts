import axios from 'axios';
import bcrypt from 'bcryptjs';
var faunadb = require('faunadb'), q = faunadb.query;

const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

const options = {
  headers: { authorization: `Bearer ${process.env.FAUNADB_SECRET}` }
}

export const emailLogin = async (email: string, password: string): Promise<boolean> => {


  const loginQuery = {
    query: `
    query {
      login(email: "${email}") {
      email
      hash
      }
    }`
  }

  const login = await axios.post('https://graphql.fauna.com/graphql', loginQuery, options)

  if (login.data.data?.login) {
    let success = await bcrypt.compare(password, login.data.data.login.hash);
    return success;
  }
  else return false;
}

const oauthLogin = async (username: string, email: string, source: string, avatar: string ): Promise<boolean> => {
  
  let foundUser;
  try {
     foundUser = await client.query(q.Call(q.Function('doesUserExist'),username));
  }
  catch (err) {
    console.log(err)
  }

  if (foundUser) {
    return true;
  }
  else {
    try {
      const createUser = await client.query(q.Call(q.Function('createProfile'),[username, email, source, avatar]))
    }
    catch (err) {
      console.log(err)
    }
    return true
  }
};

export default oauthLogin;
