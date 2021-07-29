import React, { FC, useMemo, useRef, useState } from 'react'
import netlifyIdentity from 'netlify-identity-widget';
import { useEffect } from 'react';
import { useEmails } from '../lib/Queries';
import { InView } from 'react-intersection-observer';
import { useCallback } from 'react';
import _ from 'lodash';
import { EmailRow } from './EmailRow';

type Props = { }

export const Emails: FC<Props> = () => {
  const useInterval = (callback, delay) => {
    const savedCallback = React.useRef();
  
    React.useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    React.useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };

  const [name, setName] = useState('')
  const [filter, setFilter] = useState('')
  const { data, isLoading, isSuccess, isError, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } = useEmails(filter ? { name: filter }: {})
  const changeFilter = useCallback(_.debounce((name) => {
        console.log('starting timer')
        setFilter(name)
        console.log(name)
      }, 1000), []
  )

  useInterval(() => {
    const d = data?.pages ? data.pages.map(
      page => page.filter(
        email => email.fields.status !== 'draft' && email.fields.status !== 'Email sent!'
      )
    ) : []
    const polls = [].concat.apply([], d)
    if (isSuccess && polls.length) {
      refetch()
    }
  }, 10000);

  const handleInput = (e: any) => {
    console.log('here')
    if (!e.target.value) changeFilter('')
    setName(e.target.value)
    changeFilter(e.target.value)
  }

  useEffect(() => {
    let user = netlifyIdentity.currentUser()
    console.log(user)
  }, [])

  return (<div>
        <p className={`font-black text-3xl text-rose-500 pb-6`}>Emails</p>
        <div className="w-full flex space-x-4">
          <input value={name} onChange={handleInput} className="appearance-none p-2 focus:outline-none flex-grow border border-gray-200 rounded-md" placeholder="Search" />
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
            <EmailRow
            accepted={e.fields.accepted}
            subject={e.fields.subject}
            to={e.fields.to}
            from={e.fields.from}
            id={e.id}
            key={i}
            lastModified={e.fields.lastModified}
            status={e.fields.status}
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
  </div>)
}