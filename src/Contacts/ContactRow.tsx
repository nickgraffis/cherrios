import React, { KeyboardEvent, FC, useRef, useState } from 'react';
import { useUpdateContact } from '../lib/Queries';
import { timeSince } from '../lib/utils';
type Props = {
  name: string,
  email: string,
  createdTime: string,
  id: string,
  groupId: string
}

export const ContactRow: FC<Props> = ({ name, email, createdTime, id, groupId }: Props) => {
  const [editing, setEditing] = useState<boolean>(false)
  const [emailInput, setEmailInput] = useState<string>(email)
  const [nameInput, setNameInput] = useState<string>(name)
  const updateContact = useUpdateContact(id, groupId)
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
    updateContact.mutate({
      email: emailInput,
      name: nameInput
    })
    setEditing(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      finishEditing()
    }
  }

  return (
      <div className="flex items-end border-b py-4 border-rose-500">
        <div className="w-72">
          <p className={`${!editing ? '' : 'hidden'} font-black text-rose-500 truncate`}>{name}</p>
          <p className={`${!editing ? '' : 'hidden'} font-semibold text-gray-800 truncate`}>{email}</p>
          <input onKeyDown={handleKeyDown} ref={nameRef} onChange={(e) => setNameInput(e.target.value)} className={`${!editing ? 'hidden' : ''} appearance-none bg-transparent font-black text-rose-500 focus:outline-none`} value={nameInput} />
          <input onKeyDown={handleKeyDown} onChange={(e) => setEmailInput(e.target.value)} className={`${!editing ? 'hidden' : ''} appearance-none bg-transparent font-semibold text-gray-800 focus:outline-none`} value={emailInput} />
        </div>
        <div className="flex-grow flex items-center space-x-2 mx-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
            <circle cx="12" cy="12" r="10" className="text-green-600" fill="currentColor"></circle>
            <path className="text-green-200" fill="currentColor" d="M10 14.59l6.3-6.3a1 1 0 0 1 1.4 1.42l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.42l2.3 2.3z"></path>
          </svg>
          <span>Added {timeSince(createdTime)} ago</span>
        </div>
        <div>
          <div className="flex items-center">
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
            <div onClick={finishEditing} className={`${editing ? '' : 'hidden'} p-2 rounded-lg mx-2 flex items-center hover:bg-gray-200 justify-center cursor-pointer`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
  )
}