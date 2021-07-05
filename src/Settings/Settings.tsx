import React, { FC, useState } from 'react'
import { useAuth } from '../Init';
import { useAccounts } from '../lib/Queries';
import { AccountCard } from './AccountCard';

type Props = { }

export const Settings: FC<Props> = () => {
  const [editing, setEditing] = useState<boolean>(false)
  const auth = useAuth()
  const [name, setName] = useState<string | undefined>(auth?.user.user_metadata.full_name)
  const [email, setEmail] = useState<string | undefined>(auth?.user.email)
  const [password, setPassword] = useState<string>('●●●●●●●●●●●●●●●')

  const saveProfile = () => {
    setEditing(false)

  }
  const { data, isLoading, isError, isSuccess } = useAccounts()
  const GoogleClientId = '893273143205-teb11av0vhccursp7v3f1roms8ngdftf.apps.googleusercontent.com'
  const GoogleScope = 'https://mail.google.com/'
  const GoogleAPIUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  const GoogleRedirect = 'http://localhost:3000/gmail'
  const GmailConnectionUrl = 
  `${GoogleAPIUrl}?client_id=${GoogleClientId}&response_type=code&scope=${GoogleScope}&redirect_uri=${GoogleRedirect}&access_type=offline`
  
  return (
      <div className="space-y-3 pb-6">
        <div className={`flex ${editing ? 'hidden' : ''}`}>
          <a onClick={() => setEditing(true)} className="flex border-4 border-lightBlue-600 items-center justify-center space-x-2 px-4 py-2 shadow-md rounded-md cursor-pointer transform hover:shadow-lg hover:-translate-y-1 transition-transform duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span className="font-bold text-blue-400">Edit Personal Information</span>
          </a>
        </div>
        <div className={`flex ${editing ? '' : 'hidden'}`}>
          <a className="flex border-4 border-lightBlue-600 items-center justify-center space-x-2 px-4 py-2 shadow-md rounded-md cursor-pointer transform hover:shadow-lg hover:-translate-y-1 transition-transform duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-bold text-blue-400">Save Personal Information</span>
          </a>
        </div>
        <div
        className="inline-block font-bold text-lightBlue-600 text-2xl"
        style={{boxShadow: 'inset 0 -0.1666666667em 0 0 #fff, inset 0 -0.3333333333em 0 0 #bae6fd'}}
        >
          <span>Name</span>
        </div>
        <p className={`text-lg ${editing ? 'hidden' : ''}`}>{auth?.user?.user_metadata.full_name}</p>
        <input value={name} className={`${editing ? '' : 'hidden'} block apperance-none rounded-md border-2 border-lightBlue-300 p-2 w-2/3`} />
        <div
        className="inline-block font-bold text-lightBlue-600 text-2xl"
        style={{boxShadow: 'inset 0 -0.1666666667em 0 0 #fff, inset 0 -0.3333333333em 0 0 #bae6fd'}}
        >
          <span>Email</span>
        </div>
        <p className={`text-lg ${editing ? 'hidden' : ''}`}>{auth?.user?.email}</p>
        <input value={email} className={`${editing ? '' : 'hidden'} block apperance-none rounded-md border-2 border-lightBlue-300 p-2 w-2/3`} />
        <div
        className="inline-block font-bold text-lightBlue-600 text-2xl"
        style={{boxShadow: 'inset 0 -0.1666666667em 0 0 #fff, inset 0 -0.3333333333em 0 0 #bae6fd'}}
        >
          <span>Password</span>
        </div>
        <p className={`text-lg ${editing ? 'hidden' : ''}`}>●●●●●●●●●●●●●●●</p>
        <input value={password} className={`${editing ? '' : 'hidden'} block apperance-none rounded-md border-2 border-lightBlue-300 p-2 w-2/3`} />
        <div className="flex items-center space-x-4">
          
        </div>
        <div
        className="inline-block font-bold text-lightBlue-600 text-2xl"
        style={{boxShadow: 'inset 0 -0.1666666667em 0 0 #fff, inset 0 -0.3333333333em 0 0 #bae6fd'}}
        >
          <span>Outgoing Email Accounts</span>
        </div>
        <div className="flex py-4 space-x-4">
          <a href={GmailConnectionUrl} className="flex relative border-4 border-[#ea4335] items-center justify-center space-x-2 px-4 py-2 shadow-md rounded-md cursor-pointer transform hover:shadow-lg hover:-translate-y-1 transition-transform duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" className="w-6 h-6" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 193"><path d="M58.182 192.05V93.14L27.507 65.077L0 49.504v125.091c0 9.658 7.825 17.455 17.455 17.455h40.727z" fill="#4285F4"/><path d="M197.818 192.05h40.727c9.659 0 17.455-7.826 17.455-17.455V49.505l-31.156 17.837l-27.026 25.798v98.91z" fill="#34A853"/><path fill="#EA4335" d="M58.182 93.14l-4.174-38.647l4.174-36.989L128 69.868l69.818-52.364l4.67 34.992l-4.67 40.644L128 145.504z"/><path d="M197.818 17.504V93.14L256 49.504V26.231c0-21.585-24.64-33.89-41.89-20.945l-16.292 12.218z" fill="#FBBC04"/><path d="M0 49.504l26.759 20.07L58.182 93.14V17.504L41.89 5.286C24.61-7.66 0 4.646 0 26.23v23.273z" fill="#C5221F"/></svg>
            <span className="font-bold text-blue-400">Connet Gmail Account</span>
            <div className="w-1/4 absolute h-1 -top-1 bg-[#4285f4]"></div>
            <div className="w-1/4 absolute h-1 -top-1 left-1/4 bg-[#34a853]"></div>
            <div className="w-1/4 absolute h-1 -top-1 left-2/4 bg-[#fbbc04]"></div>
            <div className="w-1/4 absolute h-1 -bottom-1 bg-[#34a853]"></div>
            <div className="w-1/4 absolute h-1 -bottom-1 right-1 bg-[#4285f4]"></div>
            <div className="w-1/4 absolute h-1 -bottom-1 right-1/4 bg-[#fbbc04]"></div>
          </a>
          <a className="flex border-4 border-lightBlue-600 items-center justify-center space-x-2 px-4 py-2 shadow-md rounded-md cursor-pointer transform hover:shadow-lg hover:-translate-y-1 transition-transform duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lightBlue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span className="font-bold text-blue-400">Connet With STMP</span>
          </a>
        </div>
        {isLoading ? <p>Loading...</p> : data.map(({ id }: any, i: number) => 
            <AccountCard id={id} key={i} url={GmailConnectionUrl} />
          )
        }
      </div>
  )
}