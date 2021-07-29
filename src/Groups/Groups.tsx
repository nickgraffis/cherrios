import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { GroupCard } from './GroupCard'
import { useAuth } from '../Init'
import netlifyIdentity from 'netlify-identity-widget';
import axios from 'axios';
import { useCreateGroup, useGroups } from '../lib/Queries';
import { NavBar } from '../NavBar';
import { useToasts } from '../Toast/Toast'

type Props = { }

export const Groups: FC<Props> = () => {
  const auth = useAuth()
  const { data, isLoading, isError, isSuccess } = useGroups();
  const createGroup = useCreateGroup();
  const newGroup = () => {
    createGroup.mutate({
      name: 'My New Group',
      color: 'bg-yellow-500'
    })
  }

  return (
    <div className="">
      <p className="font-black text-6xl pt-6 pb-4 pl-4 text-rose-500">
        Groups
      </p>
      <div onClick={newGroup} className="cursor-pointer bg-blue-400 m-4 flex items-center justify-center p-4 rounded-lg font-black text-blue-600 text-2xl w-80">
        New Group
      </div>
      <div className="flex items-center justify-start flex-wrap">
        {isError ? <p>Error</p> : ''}
        {isLoading ? <div className="w-full flex items-center justify-center">
                <svg className="animate-spin text-rose-600 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div> : data.map(({id, fields: { name, color, contactCount }}: any, index: number) => <GroupCard 
          key={index}
          groupName={name}
          groupColor={color}
          id={id}
          contactCount={contactCount}
        />)}
      </div>
    </div>
  )
}