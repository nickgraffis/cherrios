import React, { FC, useMemo, useRef, useState, KeyboardEvent } from 'react'
import { Link } from 'react-router-dom';
import { useDestroyGroup, useUpdateGroup } from '../lib/Queries';
import { useToasts } from '../Toast/Toast';

type Props = {
  groupName: string,
  groupColor: string,
  contactCount: number,
  id: string
}

export const GroupCard: FC<Props> = ({ groupName, groupColor, contactCount, id }: Props) => {
  const [showColor, setShowColor] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [color, setColor] = useState<string>(groupColor)
  const [name, setName] = useState<string>(groupName);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const colorOptions = [
    'bg-cyan-500',
    'bg-lime-500',
    'bg-red-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-fuchsia-500',
    'bg-pink-500'
  ]
  const colors400 = [
    'bg-cyan-400',
    'bg-lime-400',
    'bg-red-400',
    'bg-blue-400',
    'bg-yellow-400',
    'bg-fuchsia-400',
    'bg-pink-400'
  ]
  const colors700 = [
    'text-cyan-700',
    'text-lime-700',
    'text-red-700',
    'text-blue-700',
    'text-yellow-700',
    'text-fuchsia-700',
    'text-pink-700'
  ]
  const colorsHover = [
    'hover:bg-cyan-500',
    'hover:bg-lime-500',
    'hover:bg-red-500',
    'hover:bg-blue-500',
    'hover:bg-yellow-500',
    'hover:bg-fuchsia-500',
    'hover:bg-pink-500'
  ]
  const colorsBorder = [
    'border-cyan-500',
    'border-lime-500',
    'border-red-500',
    'border-blue-500',
    'border-yellow-500',
    'border-fuchsia-500',
    'border-pink-500'
  ]
  const positions = [
    { true: '-top-4 right-7 scale-100', false: 'top-0 right-0 scale-50' },
    { true: 'top-4 right-7 scale-100', false: 'top-0 right-0 scale-50' },
    { true: 'top-8 left-0 scale-100', false: 'top-0 left-0 scale-50' },
    { true: 'top-4 left-7 scale-100', false: 'top-0 left-0 scale-50' },
    { true: '-top-4 left-7 scale-100', false: 'top-0 left-0 scale-50' },
    { true: '-top-8 scale-100', false: 'top-0 scale-50' },
  ]

  const updateGroup = useUpdateGroup(id)
  const { add } = useToasts()

  const nameRef = useRef<HTMLInputElement>(null)
  const setFocus = () => { 
    if (nameRef?.current) nameRef.current.focus() 
  }
  const edit = () => {
    setEditing(!editing)
    setTimeout(() => {
      setFocus()
    }, 0)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setEditing(false)
      updateGroup.mutate({ name })
    }
  }
  
  const destroyGroup = useDestroyGroup(id)

  const destory = () => {
    destroyGroup.mutate()
  }

  const chooseColor = (c: string) => { 
    console.log(c)
    setColor(c); 
    setShowColor(false) 
    updateGroup.mutate({ color: c })
    add("Click to dismiss!")
  }

  const lookForConfirmation = () => {
    setConfirmDelete(true)
    setTimeout(() => {
      setConfirmDelete(false)
    }, 5000)
  }

  return (
    <div className="relative m-4">
      <div className={`${colors400.find(c => c.split('-')[1] === color.split('-')[1])} text-white font-semibold p-4 rounded-lg space-y-2 transform transition-all duration-150`}>
      <div className="space-y-1 w-72">
        <input ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown} className={`${editing ? '' : 'hidden'} appearance-none focus:outline-none p-1 ${colors700.find(c => c.split('-')[1] === color.split('-')[1])} bg-transparent font-black text-2xl`} />
        <p className={`font-black text-2xl ${editing ? 'hidden' : ''} ${colors700.find(c => c.split('-')[1] === color.split('-')[1])}`}>{name}</p>
        <p className="">{contactCount} contacts</p>
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div onClick={lookForConfirmation} className={`${confirmDelete ? 'hidden' : ''} transform mx-2 transition-transform duration-150 p-2 rounded-lg whitespace-nowrap flex space-x-4 items-center justify-center ${colorsHover.find(c => c.split('-')[1] === color.split('-')[1])} cursor-pointer`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div onClick={destory} className={`${confirmDelete ? '' : 'hidden'} transform transition-transform mx-2 duration-150 p-2 rounded-lg whitespace-nowrap flex space-x-4 items-center justify-center ${colorsHover.find(c => c.split('-')[1] === color.split('-')[1])} cursor-pointer`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div onClick={edit} className={`p-2 rounded-lg mx-2 flex items-center justify-center ${colorsHover.find(c => c.split('-')[1] === color.split('-')[1])} cursor-pointer`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <Link to={`/groups/${id}`}>
            <div className={`p-2 rounded-lg flex items-center mx-2 justify-center ${colorsHover.find(c => c.split('-')[1] === color.split('-')[1])} cursor-pointer`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </Link>
        </div>
        <div className="relative">
          {colorOptions.filter(c => c !== color)
            .map((c, i) => <div 
            onClick={() => chooseColor(c)}
            key={i} 
            className={`absolute ${showColor ? positions[i].true : positions[i].false} h-7 w-7 cursor-pointer hover:scale-110 active:scale-90 transform transition-all duration-300 rounded-full ${c}`}
            >
            </div>)
          }
          <div onClick={() => setShowColor(!showColor)} className={`h-7 w-7 cursor-pointer hover:scale-110 active:scale-90 transform transition-all duration-150 rounded-full ${color}`}></div>
        </div>
      </div>
    </div>
  </div>
  )
}