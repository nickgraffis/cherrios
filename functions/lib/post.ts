import { HandlerResponse } from '@netlify/functions';
const airtable = require('airtable').base('app93GlT9ctaTE8lI');

export type PostInput = {
  base: string,
  fields: any,
  user: string
}

export const post = async ({ base, fields, user }: PostInput): Promise<HandlerResponse> => {
  console.log(fields)
  return new Promise(resolve => {
    airtable(base).create(
      [...Object.keys(fields)
        .map(key => { 
          return {
            fields: { 
              id: user,
              ...fields[key] 
            }
          }
        })], (err: any, records: any) => {
        if (err) {
          console.log(err)
          resolve({
            statusCode: 500,
            body: JSON.stringify({ err })
          }); 
          return;
        }
        console.log(records)
        resolve({
          statusCode: 200,
          body: JSON.stringify({ records })
        }); 
      });    
  })
}