// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
import { list } from '../lib/list';
import { get } from '../lib/get';
import { post } from '../lib/post';
import { Handler } from '@netlify/functions';
import { put } from '../lib/put';
import { del } from '../lib/delete';

const handler: Handler = async (event, context) => {
  console.log(context)
  const segments: string[] = event.path.replace(/\.netlify\/functions\/[^/]+/, '')
  .split('/').filter(Boolean)
  const user: { sub: false } | any = context?.clientContext?.user || { sub: false };

  if (!user.sub) return {
    statusCode: 402,
    body: JSON.stringify({ message: 'User authentication was not provided.' })
  }

  switch (event.httpMethod) {
    case 'GET':
      if (segments.length === 0) {
        return await list({
          base: 'Accounts',
          filters: {
            id: user.sub,
            ...(event.queryStringParameters?.name) && { name: event.queryStringParameters.name }
          },
          ...(event.queryStringParameters?.offset) && { offset: parseInt(event.queryStringParameters.offset) },
          ...(event.queryStringParameters?.limit) && { limit: parseInt(event.queryStringParameters.limit) }
        })
      }
      if (segments.length === 1) {
        const [id] = segments
        return get({
          base: 'Accounts',
          id,
          user: user.sub
        })
      } 

      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Pass a max of 1 segment to find a particular record.' })
      }
    case 'POST':
      if (!event?.body) return {
        statusCode: 404,
        body: JSON.stringify({ message: 'You have to provide a body to create a record.' })
      }

      return post({
        base: 'Accounts',
        fields: JSON.parse(event.body),
        user: user.sub
      })
    case 'PUT':
      if (!event?.body) return {
        statusCode: 404,
        body: JSON.stringify({ message: 'You have to provide a body to create a record.' })
      }

      if (segments.length === 1) {
        const [id] = segments
        return put({
          base: 'Accounts',
          user: user.sub,
          id,
          fields: JSON.parse(event.body)
        })
      } 

      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Pass a min of 1 segment to update a particular record.' })
      }
    case 'DELETE':
      if (segments.length === 1) {
        const [id] = segments
        return del({
          base: 'Accounts',
          id,
          user: user.sub
        })
      } 

      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Pass a min of 1 segment to delete a particular record.' })
      }

    default:
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Couldn\'t find what you were looking for.' })
      }
  }
}

module.exports = { handler }

