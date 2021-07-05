import { HandlerResponse } from '@netlify/functions';
const Airtable = require('airtable');
const airtable = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('app93GlT9ctaTE8lI');

export type ListInput = {
  base: string,
  filters?: {
    [key: string]: any
  },
  limit?: number,
  offset?: number
}

type AirTableParams = {
  filterByFormula?: string,
  sort?: any[]
}

export const list = async ({ base, filters, limit, offset }: ListInput): Promise<HandlerResponse> => {
  return new Promise(resolve => {
    let count = 1
    const parameters: AirTableParams = {
      ...(filters) && { filterByFormula: `AND(${Object.keys(filters).map((key: string) => {
        if (filters[key]?.options) {
          
        } else {
          return `FIND("${filters[key]}", {${key}})`
        }
      }).join(', ')})` },
      sort: [{field: 'createdTime', direction: 'desc'}]
    }
    let records: any[] = []
    console.log(base, parameters, filters, limit, offset)
    airtable(base).select(parameters).eachPage((rec: any, fetchNextPage: () => void) => {
      console.log('starting')
      let done = false
      for (let i = 0; i < rec.length; i ++) {
        console.log(i, count, ((limit || 10) + (offset || 0)))
        if (count > ((limit || 25) + (offset || 0))) {
          console.log('We are done')
          done = true
          break
        }
        if (count > (offset || 0)) {
          let record = rec[i]._rawJson
          record.recordNumber = count
          records.push(record)
        }
        count++
      }
      if (!done) fetchNextPage()
      else resolve({
        statusCode: 200,
        body: JSON.stringify({ records })
      })
    }, (error: any) => {
      if (error) console.log(error)
      if (error) resolve({
        statusCode: 500,
        body: JSON.stringify({ error })
      })
      else resolve({
        statusCode: 200,
        body: JSON.stringify({ records })
      })
    })
  })
}