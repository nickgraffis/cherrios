import React, { KeyboardEvent, FC, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDestroyEmail, useUpdateContact } from '../lib/Queries';
import { timeSince } from '../lib/utils';
type Props = {
  subject: string,
  to: string,
  from: string,
  lastModified: string,
  id: string,
  status: string,
  accepted: string
}

export const EmailRow: FC<Props> = ({ subject, to, from, lastModified, id, status, accepted }: Props) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)

  const lookForConfirmation = () => {
    setConfirmDelete(true)
    setTimeout(() => {
      setConfirmDelete(false)
    }, 5000)
  }

  const destroyEmail = useDestroyEmail(id)

  const destory = () => {
    destroyEmail.mutate()
  }
  return (
      <div className="flex items-center border-b py-4 border-rose-500">
        <div className="w-12">
          {status !== 'Email sent!' ? 
            (status !== 'draft' ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>) : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
            <circle cx="12" cy="12" r="10" className="text-green-600" fill="currentColor"></circle>
              <path className="text-green-200" fill="currentColor" d="M10 14.59l6.3-6.3a1 1 0 0 1 1.4 1.42l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.42l2.3 2.3z"></path>
            </svg>
          }
        </div>
        <div className="w-72">
          <p className={`font-black text-rose-600 truncate title`}>{subject || 'Subject'}</p>
          <p className={`font-semibold text-gray-800 truncate`}>{from}</p>
        </div>
        <div className="flex w-72 self-end items-center space-x-2 mx-3">
          {status === 'Queueing email.' ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg> : ''
          }
          {status === 'Gathering email addresses.' ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg> : ''
          }
          {status === 'Preparing email to be sent.' ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg> : ''
          }
          {status === 'Email sent!' ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
            <circle cx="12" cy="12" r="10" className="text-green-600" fill="currentColor"></circle>
              <path className="text-green-200" fill="currentColor" d="M10 14.59l6.3-6.3a1 1 0 0 1 1.4 1.42l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.42l2.3 2.3z"></path>
            </svg> : ''
          }
          {status === 'draft' ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg> : ''
          }
          <span>{status === 'draft' ? 'Draft' : status}</span>
        </div>
        <div className="flex flex-grow items-center space-x-2 mx-3 self-end">
          <span>{status === 'Email sent!' ? <span>Sent to {accepted ? accepted.split(',').length : 'many'} contacts </span> : 'Status Updated'} {timeSince(lastModified)} ago</span>
        </div>
        <div className="flex items-center self-end">
          <div onClick={lookForConfirmation} className={`${status === 'draft' && !confirmDelete ? '' : 'hidden'} transform mx-2 transition-transform duration-150 p-2 rounded-lg whitespace-nowrap flex space-x-4 items-center justify-center cursor-pointer`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div onClick={destory} className={`${status === 'draft' && confirmDelete ? '' : 'hidden'} transform transition-transform mx-2 duration-150 p-2 rounded-lg whitespace-nowrap flex space-x-4 items-center justify-center  cursor-pointer`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <Link to={`/compose/${id}`} className={`${status === 'draft' ? '' : 'hidden'} p-2 rounded-lg mx-2 flex items-center hover:bg-gray-200 justify-center cursor-pointer`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </Link>
          <Link to={`/email/${id}`} className={`${status !== 'draft' ? '' : 'hidden'} p-2 rounded-lg mx-2 flex items-center hover:bg-gray-200 justify-center cursor-pointer`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Link>
        </div>
      </div>
  )
}