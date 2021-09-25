import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import axios from 'axios';
import bcrypt from 'bcryptjs';
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const getProfile = async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await getSession({ req })

    if (session) {
        res.status(401).send('already signed in');
        return;
    }

    const query = {
        query: `
            query {
                getProfile(username:"${req.body.username}") {
                _id
            }
        }`
    }

    const options = {
        headers: { authorization: `Bearer ${process.env.FAUNADB_SECRET}` }
    }
    const userDetails = await axios.post('https://graphql.fauna.com/graphql', query, options)

    if (userDetails.data.data?.getProfile?._id) {
        res.status(401).json({
            error: 'a user already exists with this name'
        })
    }
    else {
        const hash = await bcrypt.hash(req.body.password, 10);
        const newProfile = {
            query: `
        mutation {
          createAccount(data:{
            email:"${req.body.username}", 
            hash:"${hash}"
            })
            {
              email
          }
        }`
        }

        const res2 = await axios.post('https://graphql.fauna.com/graphql', newProfile, options)

        const newUser = {
            query: `
            mutation {
              createProfile(data:{
                  username:"${req.body.username}", 
                  source:"email", 
                  avatar:"", 
                  email:"${req.body.username}"})
                {
                  username
              }
            }`
        }
        const res3 = await axios.post('https://graphql.fauna.com/graphql', newUser, options)

        if (process.env.SENDGRID_API_KEY !== '' && req.body.username.includes('@')) {
            const msg = {
                to: req.body.username, 
              from: 'team@fakesystem.org', // This needs to be updated to whatever email address is setup for SendGrid
              subject: 'Welcome to Our Fake System',
              text: `${req.body.username}, welcome to Our Fake System`,
              html: `<strong>${req.body.username}, welcome to Our Fake System</strong>`,
              }
              
              sgMail
                .send(msg)
                .then((response) => {
                  console.log(response);
                })
                .catch((error) => {
                  console.error(error)
                })    
        }

        res.redirect('/')
    }
};

export default getProfile;