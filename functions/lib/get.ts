import { HandlerResponse } from '@netlify/functions';
const airtable = require('airtable').base('app93GlT9ctaTE8lI');
const { CHAO_ADMIN_KEY } = process.env
export type GetInput = {
  base: string,
  id: string,
  user: string
}

export const get = async ({ base, id, user }: GetInput): Promise<HandlerResponse> => {
  return new Promise(resolve => {
    console.log('getting group')
    airtable(base).find(id, (err: any, record: any) => {
      if (err) { 
        console.log(err)
        resolve({
          statusCode: 500,
          body: JSON.stringify({ err })
        }); 
        return;
      }
      if (record.fields.id !== user && user !== CHAO_ADMIN_KEY && record.fields?.status !== 'Email sent!') resolve({
        statusCode: 402,
        body: JSON.stringify({ message: 'User credentials do not match this record.' })
      })

      resolve({
        statusCode: 200,
        body: JSON.stringify({ record })
      })
    });
  })
}