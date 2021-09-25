import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
var faunadb = require('faunadb'), q = faunadb.query;

const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

const getProfile = async (req: NextApiRequest, res: NextApiResponse) => {

  const session = await getSession({ req })

  if (!session) {
      res.status(401).send('not authorized');
      return;
  }

  try {
    const userProfile = await client.query(q.Call('getUserProfile',req.body.username));  
    res.status(200).json({
      username: userProfile.username,
      email: userProfile.email,
      source: userProfile.source,
      avatar: userProfile.avatar
    })
  }
  catch (err) {
    res.status(400).send('no user id found')
  }
};

export default getProfile;