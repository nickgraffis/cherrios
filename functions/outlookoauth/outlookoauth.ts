import { Handler } from '@netlify/functions';
import axios from 'axios';
import qs from 'qs';
// import { authenticate } from '../lib/outlookOAuth';

const handler: Handler = async (event, context) => {
  // switch (event.httpMethod) {
  //   case 'GET': 
  //     const access_token = await refresh(event, context)
  //     return getDisplayName(access_token.body)
  //   case 'POST':
  //     return authenticate(event, context)
  //   case 'PUT':
  //     return revoke(event, context)
  //   default:
  //     return {
  //       statusCode: 405,
  //       body: JSON.stringify({ message: 'We coudn\'t figure out what you were trying to do.' })
  //     }
  // }
  if (!event.body) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'You have to provide a body to create a record.' })
    }
  }
  const { code } = JSON.parse(event.body)

  const gmail = await axios({
    method: 'post',
    url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    data: qs.stringify({
      code,
      scope: 'offline_access user.read mail.read',
      client_id: 'd67a3ccf-2032-4694-aff8-d194f5a3340b',
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:3000/outlook',
      client_secret: 'J407Q~pzlZGNL9UvTYQEFo_kTuhyuDPK5nU9y',
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
  return { statusCode: 200, body: JSON.stringify({ gmail }) }
}

module.exports = { handler }
