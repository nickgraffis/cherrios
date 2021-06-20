import React, { FC, useState } from 'react'
import logo from './logo.svg'

type Props = { }

export const App: FC<Props> = () => {
  const [count, setCount] = useState<number>(0)
  const [netlify, setNetlify] = useState<string | undefined>(undefined)
  const [input, setInput] = useState<string>('')

  const handleInput = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') fetchFromNetlify(input)
  }

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(event.target.value)
  }

  const fetchFromNetlify = (name?: string): void => {
    const endpoint: string = '/api/hello-world' + (name ? '?name=' + name : '')
    fetch(endpoint)
    .then(
      (res: any) => {
        res.json().then((res: any) => setNetlify(res.message))
      }
    )
  }

  return (
    <div className="text-center">
      <header className="bg-[#282c34] min-h-screen flex flex-col items-center justify-center space-y-4 text-2xl text-white">
        <img src={logo} className="h-[40vmin] animate-spinslow" alt="logo" />
        <p>Hello Vite + React + Typescript + Netlify + TailwindCSS!</p>
        <p>
          <button className="bg-blueGray-400 p-2 rounded-md focus:outline-none" 
          onClick={() => setCount((count) => count + 1)}
          >
            count is: {count}
          </button>
        </p>
        <p>
          <button className="bg-blueGray-400 p-2 rounded-md focus:outline-none"
          onClick={() => fetchFromNetlify()}
          >
            Try Netlify
          </button>
        </p>
        <p>Netlify Response from <code className="text-lime-400">/api/hello-world </code>:
          <span className="text-[#61dafb]"> { netlify } </span>
        </p>
        <p className="space-y-2">
          <p>Try Netlify with query string paramter. Enter name and press enter</p>
          <input 
          onKeyUp={handleInput} 
          onChange={handleChangeInput}
          value={input}
          className="apperance-none bg-[#282c34] rounded-md border-blueGray-400 border-2 px-2 py-1" placeholder="What's Your Name?" 
          />
        </p>
        <p>Netlify Response from <code className="text-lime-400">/api/hello-world?name= </code>:
         <span className="text-[#61dafb]"> { netlify } </span>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="text-[#61dafb]"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="text-[#61dafb]"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
          {' | '}
          <a
            className="text-[#61dafb]"
            href="https://docs.netlify.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Netlify Docs
          </a>
        </p>
      </header>
    </div>
  )
}