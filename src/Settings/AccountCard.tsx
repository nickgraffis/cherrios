import axios from 'axios'
import React, { FC, useRef, useState, KeyboardEvent } from 'react'
import { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import { useAuth } from '../Init'
import { useAccount, useUpdateAccount } from '../lib/Queries'
import { timeSince } from '../lib/utils'

type Props = {
  id: string,
  url: string
}

export const AccountCard: FC<Props> = ({ id, url }: Props) => {
  const auth = useAuth()
  const [revoking, setRevoking] = useState<boolean>(false)
  const [editing, setEditing] = useState<boolean>(false)
  const [displayName, setDisplayName] = useState<string>('')
  const { data, isLoading, isError, isSuccess } = useAccount(id) 
  const queryClient = useQueryClient();
  const [nameInput, setNameInput] = useState<string>('')
  const updateAccount = useUpdateAccount(id)
  const nameRef = useRef<HTMLInputElement>(null)

  const startEditing = () => {
    setEditing(true)
    setTimeout(() => {
      if (nameRef?.current) {
        nameRef.current.focus()
      }
    }, 100)
  }

  const finishEditing = () => {
    updateAccount.mutate({
      name: nameInput
    })
    setEditing(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      finishEditing()
    }
  }

  const revoke = () => {
    setRevoking(true)
    axios.put('/api/gmailoauth', {
      id,
      code: data.fields.refresh_token
    },
    {
      headers: {
        Authorization: `Bearer ${auth?.user?.token?.access_token}`
      }
    }
    ).then(res => {
      console.log(res)
      setRevoking(false)
      queryClient.refetchQueries(['accounts', id], { active: true, exact: true })
    }).catch(err => {
      console.log(err.response.data)
      setRevoking(false)
      //Toast
    })
  }

  useEffect(() => {
    if (data) {
      setNameInput(data.fields.name)
      axios.get(`/api/gmailoauth?id=${id}&code=${data.fields.refresh_token}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.user?.token?.access_token}`
          }
        }
      ).then(res => {
        console.log(res.data.displayName)
        setDisplayName(res.data.displayName)
      }).catch(err => {
        console.log(err.response.data)
      })
    }
  }, [data])
  
  return (
    <div className="flex items-center w-2/3 px-4 py-2 border-4 border-[#ea4335] rounded-lg space-x-4 relative">
      { isSuccess && data.fields.type === 'gmail' ? <>
      <div className="w-1/4 absolute h-1 -top-1 bg-[#4285f4]"></div>
      <div className="w-1/4 absolute h-1 -top-1 left-1/4 bg-[#34a853]"></div>
      <div className="w-1/4 absolute h-1 -top-1 left-2/4 bg-[#fbbc04]"></div>
      <div className="w-1/4 absolute h-1 -bottom-1 bg-[#34a853]"></div>
      <div className="w-1/4 absolute h-1 -bottom-1 right-1 bg-[#4285f4]"></div>
      <div className="w-1/4 absolute h-1 -bottom-1 right-1/4 bg-[#fbbc04]"></div></> : ''}
      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" className="w-8 h-8 flex-shrink-0" focusable="false" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 193"><path d="M58.182 192.05V93.14L27.507 65.077L0 49.504v125.091c0 9.658 7.825 17.455 17.455 17.455h40.727z" fill="#4285F4"/><path d="M197.818 192.05h40.727c9.659 0 17.455-7.826 17.455-17.455V49.505l-31.156 17.837l-27.026 25.798v98.91z" fill="#34A853"/><path fill="#EA4335" d="M58.182 93.14l-4.174-38.647l4.174-36.989L128 69.868l69.818-52.364l4.67 34.992l-4.67 40.644L128 145.504z"/><path d="M197.818 17.504V93.14L256 49.504V26.231c0-21.585-24.64-33.89-41.89-20.945l-16.292 12.218z" fill="#FBBC04"/><path d="M0 49.504l26.759 20.07L58.182 93.14V17.504L41.89 5.286C24.61-7.66 0 4.646 0 26.23v23.273z" fill="#C5221F"/></svg>
      {isLoading ? <p></p> : <><div className="">
        <p className={`${editing ? 'hidden' : ''} font-bold`}>{data.fields.name || displayName}</p>
        <input onKeyDown={handleKeyDown} ref={nameRef} onChange={(e) => setNameInput(e.target.value)} className={`${!editing ? 'hidden' : ''} appearance-none bg-transparent font-bold focus:outline-none`} value={nameInput} />
        <p className="">{data.fields.email_address}</p>
        <p>{id}</p>
      </div>
      <div className="flex-grow justify-center w-full flex">
        {
          data.fields.revoked ? <p className="font-bold text-red-500">Revoked {timeSince(data.fields.revoked)} ago</p> :
          <p className="font-bold text-green-500">Active</p>
        }
      </div>
      <div className="flex items-center">
        { data.fields.revoked ? <a href={url + `&login_hint=${data.fields.email_address}`} className={`${revoking ? 'hidden' : ''} p-2 rounded-lg mx-2 flex items-center hover:bg-gray-200 justify-center cursor-pointer`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg> 
          </a>: <> 
          <div onClick={revoke} className={`${revoking ? 'hidden' : ''} p-2 rounded-lg mx-2 flex items-center hover:bg-gray-200 justify-center cursor-pointer`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <svg className={`${revoking ? '' : 'hidden'} animate-spin text-gray-500 w-6 h-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg> 
        </>
        }
        <div className={`${false ? 'hidden' : ''} transform mx-2 transition-transform duration-150 p-2 rounded-lg whitespace-nowrap flex space-x-4 items-center justify-center cursor-pointer`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <div className={`${false ? '' : 'hidden'} transform transition-transform mx-2 duration-150 p-2 rounded-lg whitespace-nowrap flex space-x-4 items-center justify-center  cursor-pointer`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div onClick={startEditing} className={`${editing ? 'hidden' : ''} p-2 rounded-lg mx-2 flex items-center hover:bg-gray-200 justify-center cursor-pointer`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <div className={`${editing ? '' : 'hidden'} p-2 rounded-lg mx-2 flex items-center hover:bg-gray-200 justify-center cursor-pointer`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div></>}
    </div>
  )
}