import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../Init';
import netlifyIdentity from 'netlify-identity-widget';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

type Props = { 
}

export const GmailOAuth2: FC<Props> = () => {
  const { search } = useLocation()
  const auth = useAuth()
  const [title, code] = search.match(/code=([^&]*)/) || ['code', 'unknown'];
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)
  const history = useHistory()

  useEffect(() => {
    axios.post(
      `/api/gmailoauth`,
      {
        code: code,
        name: 'Nick Graffis',
        email: 'nicholasgraffis@gmail.com'
      },
      {
        headers: {
          Authorization: `Bearer ${auth?.user?.token?.access_token}`
        }
      }
    ).then((res) => {
      console.log(res);
      setLoading(false)
      history.push('/settings')
    }).catch((err) => {
      console.log(err.response.data)
      setLoading(false)
      setError(true)
    })
  }, [])
  
  return (
    <div className="w-full flex items-center justify-center flex-grow">
      { error ?
        <div className="flex flex-col space-y-12">
          <p className="text-2xl font-black">There was an error!</p>
          <div className="flex space-x-4 w-full items-center justify-center">
            <div className="flex font-semibold rounded-lg px-4 py-2 border-4 border-yellow-500 bg-yellow-500 text-white">Try Again</div>
            <div className="flex font-semibold rounded-lg px-4 py-2 border-4 border-yellow-500 text-yellow-500">Go Back</div>
          </div>
        </div> : ''
      }
      { loading ? <div className="space-y-12 flex flex-col items-center">
        <svg className={`animate-spin text-gray-500 w-14 h-14`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-2xl font-black">Authenticating with Gmail!</p>
      </div> : ''}
      { !loading && !error ? <p className="text-2xl font-black">Redirecting you back to Cherrios!</p> : ''}
    </div>
  )
}