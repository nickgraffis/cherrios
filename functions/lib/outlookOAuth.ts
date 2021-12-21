const {
  OUTLOOK_SERVICE_CLIENT_ID,
  OUTLOOK_SERVICE_CLIENT_SECRET
} = process.env;
import axios from 'axios';
import qs from 'qs';

export const authenticate = async(event: HandlerEvent, context: HandlerContext) => {
  const user: { sub: false } | any = context?.clientContext?.user || { sub: false };

  if (!user.sub) return {
    statusCode: 402,
    body: JSON.stringify({ message: 'User authentication was not provided.' })
  }

  if (!event?.body) return {
    statusCode: 404,
    body: JSON.stringify({ message: 'You have to provide a body to create a record.' })
  }

  const { code, login_hint } = JSON.parse(event.body)

  const gmail = await axios({
    method: 'post',
    url: 'https://www.googleapis.com/oauth2/v4/token',
    data: qs.stringify({
      code,
      scope: 'https://mail.google.com/',
      client_id: OUTLOOK_SERVICE_CLIENT_ID,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:3000/gmail',
      client_secret: OUTLOOK_SERVICE_CLIENT_SECRET,
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
  .then(res => {
    console.log(res)
    return res.data
  })
  .catch(err => {
    console.log(err.response.data)
    return err.response.data
  })

  if (gmail?.error) {
    return {
      statusCode: 500,
      body: JSON.stringify(gmail)
    }
  }


  return {
    a: gmail.access_token,
    r: gmail.refresh_token,
  }
}
