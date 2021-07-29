import React, { FC, useMemo, useRef, useState } from 'react'
import { useAuth } from '../Init';
import netlifyIdentity from 'netlify-identity-widget';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { useContacts, useGroup } from '../lib/Queries';
import { InView } from 'react-intersection-observer';
import { useCallback } from 'react';
import _ from 'lodash';
import { NewContact } from './NewContact';
import { ContactRow } from './ContactRow';
import { NavBar } from '../NavBar';

type Props = { }

export const Group: FC<Props> = () => {
  const [name, setName] = useState('')
  const [addNewContact, setAddNewContact] = useState<boolean>(false);
  const [editing, setEditing] = useState(false)
  const auth = useAuth()
  const { id }: any = useParams()
  const [filter, setFilter] = useState('')
  const { data, isLoading, isSuccess, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useContacts(id, filter ? { name: filter }: {})
  const { data: groupData, isLoading: groupLoading, isSuccess: groupSuccess, isError: groupError } = useGroup(id)
  const changeFilter = useCallback(_.debounce((name) => {
        console.log('starting timer')
        setFilter(name)
        console.log(name)
      }, 1000), []
  )

  const handleInput = (e: any) => {
    console.log('here')
    if (!e.target.value) changeFilter('')
    setName(e.target.value)
    changeFilter(e.target.value)
  }

  return (
    <div className="">
        {groupLoading ? 
          <div className="rounded-lg h-12 w-96 mb-6 bg-white"></div> :
          <p className={`font-black text-3xl text-rose-500 pb-6`}>{groupData?.fields.name || ''}</p>
        }
        <div className="w-full flex space-x-4">
          <input value={name} onChange={handleInput} className="appearance-none p-2 focus:outline-none flex-grow border border-gray-200 rounded-md" placeholder="Search" />
          <div className="relative">
            <div onClick={() => setAddNewContact(true)} className="px-4 py-2 cursor-pointer shadow-md hover:shadow-lg transform transition-transform duration-150 ease-in-out hover:-translate-y-1 bg-rose-500 text-white flex items-center justify-center font-semibold rounded-md">
              New Contact
            </div>
            {
            addNewContact ? <NewContact 
              setAddNewContact={setAddNewContact}
              addNewContact={addNewContact}
              groupId={id}
            /> 
            : ''
            }
          </div>
          <div className="px-4 py-2 cursor-pointer shadow-md hover:shadow-lg transform transition-transform duration-150 ease-in-out hover:-translate-y-1 bg-rose-500 text-white flex items-center justify-center font-semibold rounded-md">
            Import Contacts
          </div>
        </div>
        {isLoading ? 
          <div className="w-full py-24 flex items-center justify-center">
            <svg className="animate-spin text-rose-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        : data?.pages.map((page: any[]) => page.map
          ((e: any, i: number) => 
            <ContactRow 
              name={e.fields.name}
              email={e.fields.email}
              createdTime={e.createdTime}
              id={e.id}
              key={i}
              groupId={id}
            />
          )
        )}
        {hasNextPage ? <InView onChange={() => {if(hasNextPage) fetchNextPage()}}>
          <div>
            {isFetchingNextPage ? 
              <div className="w-full py-24 flex items-center justify-center">
                <svg className="animate-spin text-rose-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            : ''}
          </div>
        </InView> : ''}
        <div>
          {!hasNextPage && !isLoading ? 
            <div className="py-24 flex items-center justify-center font-black text-xl text-rose-500"> That's Everyone! </div> : ''}
        </div>
      </div>
  )
}