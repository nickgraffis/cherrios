import { HandlerResponse } from '@netlify/functions';
import { get } from './get';
const Airtable = require('airtable');
const airtable = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('app93GlT9ctaTE8lI');

const {
  CHAO_ADMIN_KEY
} = process.env;

export type DeleteInput = {
  base: string,
  id: string,
  user: string
}

export const del = async ({ base, id, user }: DeleteInput): Promise<HandlerResponse> => {
  const auth = await get({ base, id, user })
  .then((res: any) => JSON.parse(res.body).record.fields.id)
  .catch(err => { 
    console.log(err)
    return ''
  })
  console.log(user)
  console.log(auth)
  if (auth != user && user !== CHAO_ADMIN_KEY) return {
    statusCode: 500,
    body: JSON.stringify({ message: 'User not authorized to update this record.' })
  }

  return new Promise(resolve => {
    airtable(base).destroy([id], (err: any, records: any) => {
        if (err) {
          resolve({
            statusCode: 500,
            body: JSON.stringify({ err })
          }); 
          return;
        }
        resolve({
          statusCode: 200,
          body: JSON.stringify({ message: 'Record ' + id + ' deleted.' })
        }); 
      });    
  })
}