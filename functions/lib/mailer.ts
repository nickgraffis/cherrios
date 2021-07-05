import nodemailer from 'nodemailer';
const markdown = require('nodemailer-markdown').markdown;
const { OAuth2 } = require('googleapis').google.auth;
const OAUTH_PLAYGROUND = 'http://localhost:3000/gmail';
const {
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN
} = process.env;

const Mailing: any = {};
const oauth2Client = new OAuth2(
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  OAUTH_PLAYGROUND
);
/**
 * Send Email
 */
Mailing.sendEmail = async ({ body, to, refreshToken, from, subject }: any) => {
  return new Promise(async (resolve) => {
  console.log('got to mailer')
  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: from,
      clientId: MAILING_SERVICE_CLIENT_ID,
      clientSecret: MAILING_SERVICE_CLIENT_SECRET,
      refreshToken
    },
  }).use('compile', markdown());
  console.log(to.join(', '))
  const mailOptions = {
    from,
    bcc: to.join(', '), // list of receivers
    subject, // Subject line
    text: "Hello world?", // plain text body
    markdown: body, // html body
  };
  smtpTransport.sendMail(mailOptions, (err: any, info: any) => {
      console.log('Mailer', info)
      if (err) {
        console.log('Mailer Error', err)
      };
      resolve(info);
    });
  })
};

export default Mailing;

//So step one is to send the user to a new address
//step 2 is they authorize and then get redirected back to a special url that will send a netlfiy GET
//netlify will send a backend POST and get the correct information, once netlify responds it will redirect us