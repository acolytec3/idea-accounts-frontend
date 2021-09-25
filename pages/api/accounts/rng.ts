import type { NextApiRequest, NextApiResponse } from 'next'
import faunadb from 'faunadb'
const q = faunadb.query;

const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

const superSecretRandomNumber = async (req: NextApiRequest, res: NextApiResponse) => {
    const superSecretNumber = Math.random().toString();
    const newNumber = await client.query(q.Call('createNumber',[req.body.data.address, superSecretNumber]))
    res.status(200).send(superSecretNumber);
}

export default superSecretRandomNumber;