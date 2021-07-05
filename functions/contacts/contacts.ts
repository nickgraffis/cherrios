import { list } from '../lib/list';
import { get } from '../lib/get';
import { post } from '../lib/post';
import { Handler } from '@netlify/functions';
import { put } from '../lib/put';
import { del } from '../lib/delete';
import { segment } from '../lib/segments';
import { safeAwait } from '../lib/safeawait';
import { updateGroupCount } from '../lib/updateGroupCount';

const handler: Handler = async (event, context) => {
  const segments: string[] = segment(event)
  const user: { sub: false } | any = context?.clientContext?.user || { sub: false };

  if (!user.sub) return {
    statusCode: 401,
    body: JSON.stringify({ message: 'User authentication was not provided.' })
  }

  switch (event.httpMethod) {
    case 'GET':
      if (segments.length === 0) {
        if (!event?.queryStringParameters?.group_id) return {
          statusCode: 403,
          body: JSON.stringify({ message: 'You must provide a group id.' })
        }
        const [error, response] = await safeAwait(
          list({
            base: 'Contacts',
            filters: {
              id: user.sub,
              group_id: event.queryStringParameters.group_id,
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
      if (segments.length === 1) {
        const [id] = segments
        const [error, response] = await safeAwait(
          get({
            base: 'Contacts',
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
        body: JSON.stringify({ message: 'Pass a max of 1 segment to find a particular record.' })
      }
    case 'POST':
      if (!event?.body) return {
        statusCode: 406,
        body: JSON.stringify({ message: 'You have to provide a body to create a record.' })
      }

      const { group_id } = JSON.parse(event.body)[0]
      
      const [updateGroupError, updateGroupResponse] = await safeAwait(
        updateGroupCount(group_id, user.sub, true)
      )

      if (updateGroupError || !updateGroupResponse) return {
        statusCode: 500,
        body: JSON.stringify({ updateGroupError })
      }

      const [error, response] = await safeAwait(
        post({
          base: 'Contacts',
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
            base: 'Contacts',
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
        const [contactError, contactResponse] = await safeAwait(
          get({
            base: 'Contacts',
            id,
            user: user.sub
          })
        )
        
        if (contactError || !contactResponse?.body) return {
          statusCode: 500,
          body: JSON.stringify({ contactError })
        }

        const { group_id } = JSON.parse(contactResponse.body).record.fields
      
        const [updateGroupError, updateGroupResponse] = await safeAwait(
          updateGroupCount(group_id, user.sub, false)
        )
  
        if (updateGroupError || !updateGroupResponse) return {
          statusCode: 500,
          body: JSON.stringify({ updateGroupError })
        }

        const [error, response] = await safeAwait(
          del({
            base: 'Contacts',
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

