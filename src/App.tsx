import React, { FC, useMemo, useRef, useState } from 'react'
import { useEffect } from 'react';
import SimpleMDE from "react-simplemde-editor";
import twemoji from 'twemoji'
import { Input } from './Input';
import { useAuth } from './main';
import netlifyIdentity from 'netlify-identity-widget';

type Props = { }

export const App: FC<Props> = () => {
  const [value, setValue] = useState("Initial value");
  const [sending, setSending] = useState<boolean>(false);

  const auth = useAuth()

  if (!auth) {
    netlifyIdentity.open();
  } else {
    netlifyIdentity.close();
  }

  console.log(auth)

  const onChange = (value: string) => {
    console.log(value)
    setValue(value);
  };

  const groups = [
    'Vanguard 10U Blue',
    'Vanguard 10U Silver',
    'Edison Summer Group'
  ];

  const sendEmail = () => {
    setSending(true);
    fetch('/api/hello-world', {
      method: 'POST',
      body: value
    }).then(res =>
      setSending(false)
    ).catch(err => err.json().then((err: any) => console.log(err)))
  }

  const options = useMemo(() => {
    return {
      sideBySideFullscreen: false
    };
  }, []);

  useEffect(() => {
    twemoji.parse(document.body)
  }, [value])

  return (
    <div className="w-screen min-h-screen flex flex-col space-y-12">
      <div className="flex pt-6 mx-4 lg:mx-48 justify-between items-center bg-white z-50">
        <p className="text-3xl font-black">Nick Graffis</p>
        <div className="flex space-x-4 items-center">
          <div className="flex items-center justify-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer group">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
              <path className="text-gray-400 group-hover:text-yellow-400" fill="currentColor" d="M12 13a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v3a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1 1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3zM7 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm10 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"></path>
              <path className="text-gray-600 group-hover:text-yellow-600" fill="currentColor" d="M12 13a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm-3 1h6a3 3 0 0 1 3 3v3a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-3a3 3 0 0 1 3-3z"></path>
            </svg>
          </div>
          <div className="flex items-center justify-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer group transition-colors duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
              <path className="text-gray-400 group-hover:text-gray-100 transition-colors duration-150" fill="currentColor" d="M9.08 21.57a10.02 10.02 0 0 1-6.65-6.65A2 2 0 0 1 1 13v-2a2 2 0 0 1 1.43-1.92 10.02 10.02 0 0 1 6.65-6.65A2 2 0 0 1 11 1h2a2 2 0 0 1 1.92 1.43c3.17.97 5.68 3.48 6.65 6.65A2 2 0 0 1 23 11v2a2 2 0 0 1-1.43 1.92 10.02 10.02 0 0 1-6.65 6.65A2 2 0 0 1 13 23h-2a2 2 0 0 1-1.92-1.43zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
              <path className="text-gray-600 group-hover:text-red-500 transition-colors duration-150" fill="currentColor" d="M7.53 3.05a9.96 9.96 0 0 1 8.94 0L13.8 8.42a3.98 3.98 0 0 0-3.58 0L7.53 3.05zM3.05 16.47a9.96 9.96 0 0 1 0-8.94l5.37 2.68a3.98 3.98 0 0 0 0 3.58l-5.37 2.68zm4.48 4.48l2.68-5.37a3.98 3.98 0 0 0 3.58 0l2.68 5.37a9.96 9.96 0 0 1-8.94 0zM20.95 7.53a9.96 9.96 0 0 1 0 8.94l-5.37-2.68a3.98 3.98 0 0 0 0-3.58l5.37-2.68z"></path>
            </svg>
          </div>
          <div className="flex items-center justify-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer group transition-colors duration-150 transition-colors duration-150 group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6 text-gray-400 transition-colors duration-150 group-hover:text-yellow-600" xmlnsXlink="http://www.w3.org/1999/xlink" focusable="false" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512">
              <path d="M440 6.5L24 246.4c-34.4 19.9-31.1 70.8 5.7 85.9L144 379.6V464c0 46.4 59.2 65.5 86.6 28.6l43.8-59.1l111.9 46.2c5.9 2.4 12.1 3.6 18.3 3.6c8.2 0 16.3-2.1 23.6-6.2c12.8-7.2 21.6-20 23.9-34.5l59.4-387.2c6.1-40.1-36.9-68.8-71.5-48.9zM192 464v-64.6l36.6 15.1L192 464zm212.6-28.7l-153.8-63.5L391 169.5c10.7-15.5-9.5-33.5-23.7-21.2L155.8 332.6L48 288L464 48l-59.4 387.3z"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full mx-4 lg:mx-48 pb-12 space-y-6">
          <Input 
          title="To Whom 🤔"
          helper="Use email addresses or your preset distribution groups."
          options={groups}
          offMenu={/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/}
          />
          <div className="flex w-full space-x-4 items-end">
            <div className="w-full space-y-2">
              <p className="font-black text-lg">Subject 💭</p>
              <p className="italic text-sm"> </p>
              <input className="apperance-none text-lg p-2 rounded-lg border border-blueGray-400 w-full my-1" />
            </div>
            <Input 
            title="From Whom 😃"
            helper="Choose one of your preset email addresses, or use Cherrio's default outbound email."
            options={['Nick Graffis', 'Nick Graffis - HBUHSD', 'Cherrio']}
            max={1}
            />
          </div>
          <SimpleMDE value={value} onChange={onChange} options={options}/>
          <div className="w-full flex justify-end">
            <div className="flex items-center space-x-2">
              <div 
              onClick={sendEmail}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold cursor-pointer transform transition-all duration-150 hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                Send Email ✈️
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}