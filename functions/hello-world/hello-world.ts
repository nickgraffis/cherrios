// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
import { Handler } from '@netlify/functions';

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
}

const handler: Handler = async (event) => {
  try {
    const names: string[] = ['Rick', 'Morty', 'Summer', 'Gerry', 'Korvo', 'Terry']
    const subject: string = event.queryStringParameters?.name || names[getRandomInt(names.length)]
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello from Netlify, ${subject}` }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({message: error.toString()}) }
  }
}

module.exports = { handler }
