import React, { FC } from "react"
import { Link } from "react-router-dom"
import { IdentityContext } from "./Init"

export const NavBar: FC = () => {
  const auth = IdentityContext

  return (
    <div className="flex pt-6 pb-3 justify-between items-center bg-white z-40 sticky top-0">
      <div className="flex space-x-2 items-center">
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" className="h-10 w-10" preserveAspectRatio="xMidYMid meet" viewBox="0 0 36 36">
          <path fill="#EF9645" d="M4.861 9.147c.94-.657 2.357-.531 3.201.166l-.968-1.407c-.779-1.111-.5-2.313.612-3.093c1.112-.777 4.263 1.312 4.263 1.312c-.786-1.122-.639-2.544.483-3.331a2.483 2.483 0 0 1 3.456.611l10.42 14.72L25 31l-11.083-4.042L4.25 12.625a2.495 2.495 0 0 1 .611-3.478z" />
          <path fill="#FFDC5D" d="M2.695 17.336s-1.132-1.65.519-2.781c1.649-1.131 2.78.518 2.78.518l5.251 7.658c.181-.302.379-.6.6-.894L4.557 11.21s-1.131-1.649.519-2.78c1.649-1.131 2.78.518 2.78.518l6.855 9.997c.255-.208.516-.417.785-.622L7.549 6.732s-1.131-1.649.519-2.78c1.649-1.131 2.78.518 2.78.518l7.947 11.589c.292-.179.581-.334.871-.498L12.238 4.729s-1.131-1.649.518-2.78c1.649-1.131 2.78.518 2.78.518l7.854 11.454l1.194 1.742c-4.948 3.394-5.419 9.779-2.592 13.902c.565.825 1.39.26 1.39.26c-3.393-4.949-2.357-10.51 2.592-13.903L24.515 8.62s-.545-1.924 1.378-2.47c1.924-.545 2.47 1.379 2.47 1.379l1.685 5.004c.668 1.984 1.379 3.961 2.32 5.831c2.657 5.28 1.07 11.842-3.94 15.279c-5.465 3.747-12.936 2.354-16.684-3.11L2.695 17.336z" />
          <g fill="#5DADEC">
            <path d="M12 32.042C8 32.042 3.958 28 3.958 24c0-.553-.405-1-.958-1s-1.042.447-1.042 1C1.958 30 6 34.042 12 34.042c.553 0 1-.489 1-1.042s-.447-.958-1-.958z" />
            <path d="M7 34c-3 0-5-2-5-5a1 1 0 1 0-2 0c0 4 3 7 7 7a1 1 0 1 0 0-2zM24 2a1 1 0 0 0 0 2c4 0 8 3.589 8 8a1 1 0 0 0 2 0c0-5.514-4-10-10-10z" />
            <path d="M29 .042c-.552 0-1 .406-1 .958s.448 1.042 1 1.042c3 0 4.958 2.225 4.958 4.958c0 .552.489 1 1.042 1s.958-.448.958-1C35.958 3.163 33 .042 29 .042z" />
          </g>
        </svg>
        <p className="text-4xl font-black title text-rose-600">CHÁO</p>
      </div>
      <div className="flex space-x-4 items-center">
        {auth ? 
        <><Link to="/groups">
        <div className="flex items-center justify-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer group">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
            <path className="text-gray-400 group-hover:text-rose-400" fill="currentColor" d="M12 13a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v3a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1 1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3zM7 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm10 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"></path>
            <path className="text-gray-600 group-hover:text-rose-600" fill="currentColor" d="M12 13a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm-3 1h6a3 3 0 0 1 3 3v3a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-3a3 3 0 0 1 3-3z"></path>
          </svg>
        </div>
      </Link>
      <Link to="/help" className="flex items-center justify-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer group transition-colors duration-150">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
          <path className="text-gray-400 group-hover:text-gray-100 transition-colors duration-150" fill="currentColor" d="M9.08 21.57a10.02 10.02 0 0 1-6.65-6.65A2 2 0 0 1 1 13v-2a2 2 0 0 1 1.43-1.92 10.02 10.02 0 0 1 6.65-6.65A2 2 0 0 1 11 1h2a2 2 0 0 1 1.92 1.43c3.17.97 5.68 3.48 6.65 6.65A2 2 0 0 1 23 11v2a2 2 0 0 1-1.43 1.92 10.02 10.02 0 0 1-6.65 6.65A2 2 0 0 1 13 23h-2a2 2 0 0 1-1.92-1.43zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
          <path className="text-gray-600 group-hover:text-red-500 transition-colors duration-150" fill="currentColor" d="M7.53 3.05a9.96 9.96 0 0 1 8.94 0L13.8 8.42a3.98 3.98 0 0 0-3.58 0L7.53 3.05zM3.05 16.47a9.96 9.96 0 0 1 0-8.94l5.37 2.68a3.98 3.98 0 0 0 0 3.58l-5.37 2.68zm4.48 4.48l2.68-5.37a3.98 3.98 0 0 0 3.58 0l2.68 5.37a9.96 9.96 0 0 1-8.94 0zM20.95 7.53a9.96 9.96 0 0 1 0 8.94l-5.37-2.68a3.98 3.98 0 0 0 0-3.58l5.37-2.68z"></path>
        </svg>
      </Link>
      <Link to="/compose">
        <div className="flex items-center justify-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer group transition-colors duration-150 transition-colors duration-150 group">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-5 w-5 text-gray-400 transition-colors duration-150 group-hover:text-rose-400" xmlnsXlink="http://www.w3.org/1999/xlink" focusable="false" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512">
            <path d="M440 6.5L24 246.4c-34.4 19.9-31.1 70.8 5.7 85.9L144 379.6V464c0 46.4 59.2 65.5 86.6 28.6l43.8-59.1l111.9 46.2c5.9 2.4 12.1 3.6 18.3 3.6c8.2 0 16.3-2.1 23.6-6.2c12.8-7.2 21.6-20 23.9-34.5l59.4-387.2c6.1-40.1-36.9-68.8-71.5-48.9zM192 464v-64.6l36.6 15.1L192 464zm212.6-28.7l-153.8-63.5L391 169.5c10.7-15.5-9.5-33.5-23.7-21.2L155.8 332.6L48 288L464 48l-59.4 387.3z"/>
          </svg>
        </div>
      </Link>
      <Link to="/settings">
        <div className="flex items-center justify-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer group transition-colors duration-150 transition-colors duration-150 group">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
            <circle cx="12" cy="12" r="10" className="text-gray-400 transition-colors duration-150 group-hover:text-rose-400" fill="currentColor"></circle>
            <path className="text-gray-600 transition-colors duration-150 group-hover:text-rose-800" fill="currentColor" d="M6.8 14h10.4a1 1 0 0 1 .86 1.5 7 7 0 0 1-12.12 0A1 1 0 0 1 6.8 14zm1.7-3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path>
          </svg>
        </div>
      </Link>
      <Link to="/emails">
        <div className="flex items-center justify-center p-2 hover:bg-gray-200 hover:text-rose-500 rounded-lg cursor-pointer group transition-colors duration-150 transition-colors duration-150 group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        </div>
      </Link></> :
      <Link to="/login" className="px-4 py-2 rounded-lg bg-rose-500 text-white font-bold title transform transition-transform duration-150 hover:shadow-xl shadow-lg hover:-translate-y-1 cursor-pointer">
        Login
      </Link>
      }
      </div>
    </div>
  )
}