import React, { FC, useMemo, useRef, useState } from 'react'
import { useEffect } from 'react';
import twemoji from 'twemoji'

type Props = {
  title: string,
  helper: string,
  options: string[],
  max?: number,
  offMenu?: RegExp,
  setInput: React.Dispatch<React.SetStateAction<{
    name: string;
    id: string;
  }[]>>,
  input: any
}

export const Input: FC<Props> = ({ options, title, helper, max, offMenu, setInput, input }: Props) => {
  const [whom, setWhom] = useState('');
  const [focus, setFocus] = useState<boolean>(false);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    twemoji.parse(document.body)
  }, [])

  const addChip = (chip: any): void => {
    if (max && input.length >= max) return
    if (typeof chip === 'object') {
      setInput(init => [...init, { name: chip.fields.name, id: chip.id }])
    } else {
      setInput(init => [...init, { name: chip, id: chip }])
    }
    setWhom('')
  }

  const removeChip = (chip: string) => {
    setInput(init => init.filter(c => c.name !== chip))
  }

  const handleKeyDown = (event: any) => {
    let filteredGroups = options.filter((g: any) => {
      if (g?.fields.name) {
        return g.fields.name.toLowerCase().includes(whom.toLowerCase())
      }
    })
    if (
      event.key === 'ArrowDown' &&
      (pos + 1) < filteredGroups.length
    ) setPos(init => init + 1)
    if (
      event.key === 'ArrowUp' && 
      (pos - 1) >= 0
    ) setPos(init => init - 1)
    if (event.key === 'Enter' && filteredGroups[pos]) {
      addChip(filteredGroups[pos])
    }
    if (event.key === 'Enter' && offMenu && offMenu.test(whom)) {
      addChip(whom)
    }
    if (event.key === 'Backspace' && !whom) {
      removeChip(input[input.length - 1].name)
    }
  }

  const inputRef = useRef<HTMLInputElement>(null);
  const focusInput = () => {
    if (inputRef?.current) inputRef.current.focus()
  }

  const node = useRef<HTMLInputElement>(null);
  const handleClick = (e: any) => {
    if (node.current?.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setFocus(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
  <div className="w-full space-y-2">
    <p className="font-black text-lg">{title}</p>
    <p className="italic text-sm">{helper}</p>
    <div ref={node} onClick={focusInput} className="p-2 rounded-lg border border-blueGray-400 flex flex-wrap">
      {input.map((chip: {name: string, id: string}, index: number) => <div 
      key={index} 
      className="bg-rose-500 font-semibold text-white rounded-lg px-3 py-1 whitespace-nowrap mx-2 text-sm flex items-center space-x-2 my-1"
      >
        <svg onClick={() => removeChip(chip.name)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 cursor-pointer hover:animate-wiggle transform">
          <rect width="18" height="18" x="3" y="3" className="text-white" fill="currentColor" rx="2"></rect>
          <path className="text-rose-500" fill="currentColor" d="M13.41 12l2.83 2.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 1 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12z"></path>
        </svg>
        <span>{chip.name}</span>
      </div>)}
      <div className="relative">
        <input 
        ref={inputRef}
        onFocus={() => setFocus(true)}
        value={whom} 
        onKeyDown={handleKeyDown}
        onChange={(event) => setWhom(event?.target.value)} 
        className="apperance-none focus:outline-none flex-grow text-lg w-full" 
        />
        <div 
        className={`border border-gray-200 min-w-72 h-48 
        rounded-lg absolute transform transition-all duration-150
        ease-in-out bg-white z-50 top-10
        ${(whom && focus && options.filter((g: any) => {
          if (g?.fields?.name) {
            return g?.fields?.name.toLowerCase().includes(whom.toLowerCase())
          }
        }).length) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
        >
          <ul className="space-y-2">
            {options.filter((group: any) => {
              if (group?.fields?.name) {
                return group?.fields?.name.toLowerCase().includes(whom.toLowerCase())
              }
            })
            .map((group: any, index) =>
              <li 
              onClick={() => { setFocus(true); addChip(group) }}
              key={index}
              className={`px-4 font-semibold hover:bg-blueGray-100 py-1 cursor-pointer ${index === pos ? 'bg-blueGray-100' : ''}`}
              >
                {group?.fields?.name} <br></br> {(group?.fields?.email_address ? '<' + group?.fields?.email_address + '>' : '')}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  </div>
  )
}