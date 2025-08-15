"use client"
import React, { useEffect } from 'react';
import MediaGallery from '@/app/components/mediaGallery';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Dashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);


  if (status === 'loading') {
    return <div className="text-center py-8">Loading...</div>
  }


  const handleLogout = async () => {
    const result = await signOut(
      {
        callbackUrl: "/"
      }
    )

  }

  return (
    <div className="dashboard mt-8 rounded-lg shadow-md px-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <Link href={'/dashboard'}><h1 className="text-2xl font-bold">Dashboard</h1></Link>
          <button className="logout cursor-pointer text-gray-600 hover:text-white" onClick={handleLogout}>SignOut</button>
        </div>

        <div className="flex gap-2.5 items-center ">
          <Link href={`/profile/${session?.user?.username}`} className='text-sm text-gray-600 hover:text-white'>Profile</Link>
          <p className="details text-sm text-gray-600">Welcome, {session?.user?.username}</p>
        </div>
      </div>
      <div >
        <h2 className="text-xl font-semibold mb-4 text-white">Check Latest Feed</h2>
        <MediaGallery />
      </div>
    </div>
  )
}

export default Dashboard;