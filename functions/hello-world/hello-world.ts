// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
import { Handler } from '@netlify/functions';
const nodemailer =  require('nodemailer');
var markdown = require('nodemailer-markdown').markdown;

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
}

const handler: Handler = async (event) => {
  try {
    if (!event?.body) return { statusCode: 500, body: JSON.stringify({message: "not body"}) }
    /* eslint no-console: 0 */
    const body = event.body
// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  }).use('compile', markdown());

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "nicholasgraffis@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    markdown: body, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
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
