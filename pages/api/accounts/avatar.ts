import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { putImageOnS3 } from '../../../helpers/s3helper';
var faunadb = require('faunadb'), q = faunadb.query;

const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

const updateAvatar = async (req: NextApiRequest, res: NextApiResponse) => {

  const session = await getSession({ req })

  if (!session) {
      res.status(401).send('not authorized');
      return;
  }

  const buffer = Buffer.from(req.body.img.split(",")[1], 'base64')

  const userProfile = await client.query(q.Call('getUserProfile',req.body.username));  

  if (userProfile.username === req.body.username) {
    const url = await putImageOnS3(req.body.username, buffer);
    try {
      const avatarUpdate = await client.query(q.Call('updateAvatar', [req.body.username, url]));
      res.status(200).json({ avatar: url });
      return;
    }
    catch (err) {
      console.log(err);
      res.status(400).send('something went wrong');
      return;
    }
  }
  else {
    res.status(401).send('something went wrong');
    return;
  }
};

export default updateAvatar;
