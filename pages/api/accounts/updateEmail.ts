import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
var faunadb = require('faunadb'), q = faunadb.query;

const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

const updateProfile = async (req: NextApiRequest, res: NextApiResponse) => {

  const session = await getSession({ req })

  if (!session) {
    res.status(401).send('not authorized');
    return;
  }

  const { username, email } = req.body

  const userProfile = await client.query(q.Call('getUserProfile',req.body.username));  
  if (userProfile.username === username) {
    try {
      const emailUpdate = await client.query(q.Call('updateEmail', [req.body.username, email]));
      res.status(200).json({ email: email });
      return;
    }
    catch (err) {
      console.log(err);
      res.status(400).send('something went wrong');
      return;
    }
    
  }
  else {
    res.status(400).send('invalid user id provided');
  }
};

export default updateProfile;
