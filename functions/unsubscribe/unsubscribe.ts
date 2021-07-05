import { Handler } from "@netlify/functions";
import { del } from "../lib/delete";
import { list } from "../lib/list";
import { put } from "../lib/put";
import { get } from "../lib/get";
const {
  CHAO_ADMIN_KEY
} = process.env;

const handler: Handler = async (event, context) => {
  const segments: string[] = event.path.replace(/\.netlify\/functions\/[^/]+/, '')
  .split('/').filter(Boolean)
  const [id] = segments

  if (!id) return {
    statusCode: 404,
    body: JSON.stringify({ message: 'You have to provide a body to create a record.' })
  }

  const { email } = event?.body ? JSON.parse(event?.body) : { email: null }
  if (!email) return {
    statusCode: 404,
    body: JSON.stringify({ message: 'You have to provide a body to create a record.' })
  }

  const _emails = await list({
    base: 'Contacts',
    filters: {
      id,
      email
    }
  })

  const emails = _emails?.body ? JSON.parse(_emails.body).records : []
  console.log(emails)
  console.log(CHAO_ADMIN_KEY)

  for(let i = 0; i < emails.length; i++) {
    const contact = await get({
      base: 'Contacts',
      id: emails[i].id,
      user: CHAO_ADMIN_KEY || ''
    })

    console.log(contact)

    const { group_id } = contact?.body ? JSON.parse(contact.body).record.fields : { group_id: '' }
     console.log(group_id)
    const group = await get({
      base: 'Groups',
      id: group_id,
      user: CHAO_ADMIN_KEY || ''
    }) 

    const oldCount = group?.body ? JSON.parse(group.body).record.fields.contactCount : 0

    await put({
      base: 'Groups',
      fields: {
        contactCount: oldCount - 1
      },
      user: CHAO_ADMIN_KEY || '',
      id: group_id
    })
    await del({
      base: 'Contacts',
      id: emails[i].id,
      user: CHAO_ADMIN_KEY || ''
    })
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'You were unsubscribed' })
  }
}

module.exports = { handler }