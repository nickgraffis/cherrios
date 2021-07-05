import React, { FC } from 'react'
import { useState } from 'react'
import { useCreateContacts } from '../lib/Queries'

type Props = {
  setAddNewContact: (arg: boolean) => void,
  addNewContact: boolean,
  groupId: string
}

export const NewContact: FC<Props> = ({ setAddNewContact, addNewContact, groupId }: Props) => {
  const newContact = useCreateContacts(groupId)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const createNewContact = () => {
    newContact.mutate({
      group_id: groupId,
      name,
      email
    })
    setAddNewContact(false)
  }

  return (
    <div className="absolute top-14 right-0">
      <div className="w-96 rounded-lg bg-white p-4 flex justify-center items-center space-y-3 flex-col shadow-lg border-2 border-rose-500">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="appearance-none rounded-md p-2 border-2 w-full border-gray-200 focus:outline-none focus:border-rose-500" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="appearance-none rounded-md p-2 w-full border-2 border-gray-200 focus:outline-none focus:border-rose-500" />
        <div className="flex space-x-3 w-full">
          <div onClick={createNewContact} className="text-white items-center flex justify-center font-semibold px-4 py-2 bg-rose-500 flex-grow rounded-md">
            Create Contact
          </div>
          <div onClick={() => setAddNewContact(false)} className="text-white items-center flex justify-center font-semibold px-4 py-2 bg-rose-500 rounded-md">
            Cancel
          </div>
        </div>
      </div>
    </div>
  )
}