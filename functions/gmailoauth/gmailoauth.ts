import { Handler } from '@netlify/functions';
import { authenticate, getDisplayName, refresh, revoke } from '../lib/gmailOAuth';

const handler: Handler = async (event, context) => {
  switch (event.httpMethod) {
    case 'GET': 
      const access_token = await refresh(event, context)
      return getDisplayName(access_token.body)
    case 'POST':
      return authenticate(event, context)
    case 'PUT':
      return revoke(event, context)
    default:
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'We coudn\'t figure out what you were trying to do.' })
      }
  }
}

module.exports = { handler }
