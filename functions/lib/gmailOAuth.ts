import { HandlerContext, HandlerEvent } from '@netlify/functions';
import axios from 'axios';
import qs from 'qs';
import { post } from '../lib/post';
import { list } from './list';
import { put } from './put';
const {
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
} = process.env;

export const authenticate = async(event: HandlerEvent, context: HandlerContext) => {
  const user: { sub: false } | any = context?.clientContext?.user || { sub: false };

  if (!user.sub) return {
    statusCode: 402,
    body: JSON.stringify({ message: 'User authentication was not provided.' })
  }

  if (!event?.body) return {
    statusCode: 404,
    body: JSON.stringify({ message: 'You have to provide a body to create a record.' })
  }

  const { code, login_hint } = JSON.parse(event.body)

  const gmail = await axios({
    method: 'post',
    url: 'https://www.googleapis.com/oauth2/v4/token',
    data: qs.stringify({
      code,
      scope: 'https://mail.google.com/',
      client_id: MAILING_SERVICE_CLIENT_ID,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:3000/gmail',
      client_secret: MAILING_SERVICE_CLIENT_SECRET,
      ...(login_hint) && { login_hint }
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
  .then(res => {
    console.log(res)
    return res.data
  })
  .catch(err => {
    console.log(err.response.data)
    return err.response.data
  })

  if (gmail?.error) {
    return {
      statusCode: 500,
      body: JSON.stringify(gmail)
    }
  }

  const userProfile = await axios({
    method: 'get',
    url: `https://gmail.googleapis.com/gmail/v1/users/me/profile?access_token=${gmail.access_token}`
  })
  .then(res => {
    console.log(res)
    return res.data
  })
  .catch(err => {
    console.log(err.response.data)
  })

  const accounts = await list({
    base: 'Accounts',
    filters: {
      id: user.sub,
      email_address: userProfile?.emailAddress
    }
  })

  console.log(accounts)

  if (accounts.body && JSON.parse(accounts.body).records.length) {
    const { id } = JSON.parse(accounts.body).records
    .find((account: any) => account.fields.email_address === userProfile?.emailAddress)
    const oldAccount = await put({
      base: 'Accounts',
      fields: {
        access_token: gmail.access_token,
        refresh_token: gmail.refresh_token,
        revoked: null
      },
      user: user.sub,
      id
    })
    return oldAccount
  }

  const newAccount = await post({
    base: 'Accounts',
    fields: [{
      access_token: gmail.access_token,
      refresh_token: gmail.refresh_token,
      email_address: userProfile?.emailAddress
    }],
    user: user.sub
  })
  return newAccount
}

export const revoke = async (event: HandlerEvent, context: HandlerContext) => {
  const user: { sub: false } | any = context?.clientContext?.user || { sub: false };

  if (!user.sub) return {
    statusCode: 402,
    body: JSON.stringify({ message: 'User authentication was not provided.' })
  }

  if (!event?.body) return {
    statusCode: 404,
    body: JSON.stringify({ message: 'You have to provide a body to create a record.' })
  }

  const { code, id } = JSON.parse(event.body)

  console.log(code)

  const { status } = await axios({
    method: 'post',
    url: `https://oauth2.googleapis.com/revoke?token=${code}`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })

  console.log(status)

  if (status !== 200) return {
    statusCode: 500,
    body: JSON.stringify({ message: `Error from google: ${status}` })
  }

  const updatedAccount = await put({
    base: 'Accounts',
    id,
    fields: {
      revoked: new Date(Date.now()).toISOString()
    },
    user: user.sub
  })

  return updatedAccount
}

export const refresh = async (event: HandlerEvent, context: HandlerContext) => {
  const user: { sub: false } | any = context?.clientContext?.user || { sub: false };

  if (!user.sub) return {
    statusCode: 402,
    body: JSON.stringify({ message: 'User authentication was not provided.' })
  }

  if (!event?.queryStringParameters) return {
    statusCode: 404,
    body: JSON.stringify({ message: 'You have to provide a body to create a record.' })
  }

  const { code, id } = event.queryStringParameters

  if (!code || !id) return {
    statusCode: 404,
    body: JSON.stringify({ message: 'You have to provide a body to create a record.' })
  }

  const gmail = await axios({
    method: 'post',
    url: 'https://oauth2.googleapis.com/token',
    data: qs.stringify({
      client_id: MAILING_SERVICE_CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: code,
      client_secret: MAILING_SERVICE_CLIENT_SECRET
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
  .then(res => {
    console.log(res)
    return res.data
  })
  .catch(err => {
    console.log(err.response.data)
    return err.response.data
  })

  const updatedAccount = await put({
    base: 'Accounts',
    id,
    fields: {
      access_token: gmail.access_token
    },
    user: user.sub
  })

  return {
    statusCode: 200,
    body: gmail.access_token
  }
}

export const getDisplayName = async (access_token: string) =>{
  const data = await axios({
    method: 'get',
    url: `https://gmail.googleapis.com/gmail/v1/users/me/settings/sendAs?access_token=${access_token}`
  })
  .then(res => {
    console.log(res)
    return res.data
  })
  .catch(err => {
    console.log(err.response.data)
    return err.response.data
  })

  if (data?.error) {
    return {
      statusCode: 500,
      body: JSON.stringify(data)
    }
  }

  const { sendAs } = data

  return {
    statusCode: 200,
    body: JSON.stringify({ 
      displayName: sendAs[0].displayName, 
      sendAsEmail: sendAs[0].sendAsEmail, 
      replyToAddress: sendAs[0].replyToAddress, 
      signature: sendAs[0].signature 
    })
  }
}