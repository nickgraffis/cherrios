import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
  try {
    const user: { sub: false } | any = context?.clientContext?.user || { sub: false };

  if (!user.sub) return {
    statusCode: 402,
    body: JSON.stringify({ message: 'User authentication was not provided.' })
  }

  if (!event?.body) return {
    statusCode: 404,
    body: JSON.stringify({ message: 'You have to provide a body to create a record.' })
  }

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'You have to provide a body to create a record.' })
    }
  }
}

module.exports = { handler }
