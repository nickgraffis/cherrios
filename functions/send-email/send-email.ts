import { Handler } from '@netlify/functions';
import { get } from '../lib/get';
import { list } from '../lib/list';
import Mailer from '../lib/mailer';
import { post } from '../lib/post';
import { put } from '../lib/put';
const { chaoSignature } = require('../templates/chao-sig');

const handler: Handler = async (event, context) => {
  try {
    if (!event?.body) return { statusCode: 500, body: JSON.stringify({message: "not body"}) }

    const user: { sub: false } | any = context?.clientContext?.user || { sub: false };
    if (!user.sub) return {
      statusCode: 402,
      body: JSON.stringify({ message: 'User authentication was not provided.' })
    }

    const { to, body, id, subject, emailId } = JSON.parse(event.body)
    console.log(to, body, id, subject)
    let from: any = await get({
      base: 'Accounts',
      id,
      user: user.sub
    })
    from = from?.body ? JSON.parse(from.body) : {}
    console.log(emailId)
    let refreshToken = from?.record.fields.refresh_token
    from = from?.record.fields.email_address
    const queue = await put({
      base: 'Queue',
      id: emailId,
      user: user.sub,
      fields: {
        status: 'Queueing email.',
        advancedStatus: 'Queueing email',
        to: to.join(', '),
        body: `${body} <br></br> Click here to unsubscribe from these emails.`,
        subject,
        from
      }
    })
    console.log(queue?.body ? JSON.parse(queue.body) : 0)
    const queueId = queue?.body ? JSON.parse(queue.body).records[0].id : 0
    const readyEmail = async () => {
      const groups: any[] = []
      for (let i = 0; i < to.length; i++) {
        if (!to[i].match(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/)) {
          console.log('GROUP', to[i])
          console.log(to[i].match(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/))
          put({
            base: 'Queue',
            user: user.sub,
            id: queueId,
            fields: {
              status: 'Gathering email addresses.',
              advancedStatus: `Gathering email addresses from group ${to[i]}.`
            }
          })
  
          let group = await list({
            base: 'Contacts',
            limit: 10000,
            filters: {
              id: user.sub,
              group_id: to[i]
            }
          }).then(res => res?.body ? JSON.parse(res.body).records : [])

          group = group.map((g: any) => g.fields.email)
          groups.push(...group)
        } else {
          console.log('GROUP', to[i])
          groups.push(to[i])
        }
      }

      await put({
        base: 'Queue',
        user: user.sub,
        id: queueId,
        fields: {
          status: 'Preparing email to be sent.',
          advancedStatus: `Preparing email to be sent`
        }
      })

      console.log(groups)
  
      const mail = await Mailer.sendEmail({
        body: `${body} 
        ${chaoSignature}
        <p><br></br> Click [here](http://localhost:3000/unsubscribe/${user.sub}) to unsubscribe from these emails.</p>`,
        to: groups,
        from,
        refreshToken,
        subject
      })

      await put({
        base: 'Queue',
        user: user.sub,
        id: queueId,
        fields: {
          status: 'Email sent!',
          advancedStatus: `Sent email with messageId of ${mail.messageId}`,
          to: mail.accepted.join(', '),
          rejected: mail.rejected.join(', '),
          accepted: mail.accepted.join(', '),
          messageId: mail.messageId
        }
      })
    }

    await readyEmail()

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'yay' })
    } 

  } catch(err) {
    console.log(err)
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Couldn\'t find what you were looking for.' })
    }
  }
}

module.exports = { handler }

//Email Que Table Create a new que quickly, then update the que with a status