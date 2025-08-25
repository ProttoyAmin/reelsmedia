'use client'
import React from 'react';
import Link from 'next/link';
import ProfileDropdown from './ProfileDropdown';
import { useSession } from 'next-auth/react';

function Navbar() {

  const {data: session} = useSession();

  if (session){
  return (
    <nav className="border flex p-7 w-full justify-between h-10 items-center">
      <div className="logo">
        logo
      </div>
      <div className="controls">
        <ul className="flex cursor-pointer gap-20">
          <Link href={`/dashboard`}><li className="control"><svg className=" text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="40" height="35" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clipRule="evenodd" />
          </svg>
          </li></Link>
          <Link href={`/`}><li className="control"><svg className=" text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="40" height="35" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.25-2.095c.478-.86.75-1.85.75-2.905a5.973 5.973 0 0 0-.75-2.906 4 4 0 1 1 0 5.811ZM15.466 20c.34-.588.535-1.271.535-2v-1a5.978 5.978 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.535Z" clipRule="evenodd" />
          </svg>
          </li></Link>
          <Link href={`/`}><li className="control">
            <svg className=" text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="40" height="35" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M14 7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7Zm2 9.387 4.684 1.562A1 1 0 0 0 22 17V7a1 1 0 0 0-1.316-.949L16 7.613v8.774Z" clipRule="evenodd" />
            </svg>

          </li></Link>
        </ul>
      </div>
      <div className="profiles">
        <ProfileDropdown />
      </div>
    </nav>
  )
  }
}

export default Navbar