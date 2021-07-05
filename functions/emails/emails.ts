import { list } from '../lib/list';
import { get } from '../lib/get';
import { post } from '../lib/post';
import { Handler } from '@netlify/functions';
import { put } from '../lib/put';
import { del } from '../lib/delete';
import { segment } from '../lib/segments';
import { safeAwait } from '../lib/safeawait';

const handler: Handler = async (event, context) => {
  const user: { sub: false } | any = context?.clientContext?.user || { sub: false };
  const segments: string[] = segment(event)
  
  switch (event.httpMethod) {
    case 'GET':
      //Get All - List
      if (segments.length === 0) {
        const [error, response] = await safeAwait(
          list({
            base: 'Queue',
            filters: {
              id: user.sub,
              ...(event.queryStringParameters?.name) && { name: event.queryStringParameters.name }
            },
            ...(event.queryStringParameters?.offset) && { offset: parseInt(event.queryStringParameters.offset) },
            ...(event.queryStringParameters?.limit) && { limit: parseInt(event.queryStringParameters.limit) }
          })
        )

        if (error) return {
          statusCode: 500,
          body: JSON.stringify({ error })
        }

        return response
      }
      //Get 1 - Get
      if (segments.length === 1) {
        const [id] = segments
        const [error, response] = await safeAwait(
          get({
            base: 'Queue',
            id,
            ...(user?.sub) && { user: user.sub }
          })
        )

        if (error) return {
          statusCode: 500,
          body: JSON.stringify({ error })
        }
        return response
      } 

      return {
        statusCode: 406,
        body: JSON.stringify({ message: `Pass a max of 1 segment to find a particular record.` })
      }
    case 'POST':
      if (!event?.body) return {
        statusCode: 406,
        body: JSON.stringify({ message: 'You have to provide a body to create a record.' })
      }

      const [error, response] = await safeAwait(
        post({
          base: 'Queue',
          fields: JSON.parse(event.body),
          user: user.sub
        })
      )

      if (error) return {
        statusCode: 500,
        body: JSON.stringify({ error })
      }
      return response
    case 'PUT':
      if (!event?.body) return {
        statusCode: 406,
        body: JSON.stringify({ message: 'You have to provide a body to create a record.' })
      }

      if (segments.length === 1) {
        const [id] = segments
        const [error, response] = await safeAwait(
          put({
            base: 'Queue',
            user: user.sub,
            id,
            fields: JSON.parse(event.body)
          })
        )
        if (error) return {
          statusCode: 500,
          body: JSON.stringify({ error })
        }
        return response
      } 

      return {
        statusCode: 406,
        body: JSON.stringify({ message: 'Pass a min of 1 segment to update a particular record.' })
      }
    case 'DELETE':
      if (segments.length === 1) {
        const [id] = segments
        const [error, response] = await safeAwait(
          del({
            base: 'Queue',
            id,
            user: user.sub
          })
        )
        if (error) return {
          statusCode: 500,
          body: JSON.stringify({ error })
        }
        return response
      } 

      return {
        statusCode: 406,
        body: JSON.stringify({ message: 'Pass a min of 1 segment to delete a particular record.' })
      }  

    default:
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Couldn\'t find what you were looking for.' })
      }
  }
}

module.exports = { handler }

