// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
import { list } from '../lib/list';
import { get } from '../lib/get';
import { post } from '../lib/post';
import { Handler } from '@netlify/functions';
import { put } from '../lib/put';
import { del } from '../lib/delete';

const handler: Handler = async (event, context) => {
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
        if (! event?.queryStringParameters?.group_id) return {
          statusCode: 403,
          body: JSON.stringify({ message: 'You must provide a group id.' })
        }
        return await list({
          base: 'Contacts',
          filters: {
            id: user.sub,
            group_id: event.queryStringParameters.group_id,
            ...(event.queryStringParameters?.name) && { name: event.queryStringParameters.name }
          },
          ...(event.queryStringParameters?.offset) && { offset: parseInt(event.queryStringParameters.offset) },
          ...(event.queryStringParameters?.limit) && { limit: parseInt(event.queryStringParameters.limit) }
        })
      } 
      if (segments.length === 1) {
        const [id] = segments
        return get({
          base: 'Contacts',
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
      const { group_id } = JSON.parse(event.body)[0]
      
      const group = await get({
        base: 'Groups',
        id: group_id,
        user: user.sub
      }) 
      console.log(group)

      const oldCount = group?.body ? JSON.parse(group.body).record.fields.contactCount : 0

      await put({
        base: 'Groups',
        fields: {
          contactCount: oldCount + 1
        },
        user: user.sub,
        id: group_id
      })

      return post({
        base: 'Contacts',
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
          base: 'Contacts',
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

        const contact = await get({
          base: 'Contacts',
          id,
          user: user.sub
        })

        const { group_id } = contact?.body ? JSON.parse(contact.body).record.fields.group_id : { group_id: '' }
      
        const group = await get({
          base: 'Groups',
          id: group_id,
          user: user.sub
        }) 

        const oldCount = group?.body ? JSON.parse(group.body).record.fields.contactCount : 0

        await put({
          base: 'Groups',
          fields: {
            contactCount: oldCount - 1
          },
          user: user.sub,
          id: group_id
        })

        return del({
          base: 'Contacts',
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

