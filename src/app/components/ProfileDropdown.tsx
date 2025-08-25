import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { signOut, useSession } from "next-auth/react";
import { DataModel } from '@/lib/objects';
import { IProfile } from '@/models/ProfilePicture';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const username = session?.user?.username;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!username) return;

      setLoading(true);
      try {
        const pictureData = await DataModel.getProfilePicture(username);
        setProfilePicture(pictureData);
        console.log("Profile Picture URL:", pictureData?.imageUrl);
      } catch (error) {
        console.error("Failed to fetch profile picture:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfilePicture();
  }, [username]);

  console.log("PROFILE PICTURE: ", profilePicture)

  const handleLogout = async () => {
    await signOut(
      {
        redirect: true,
        callbackUrl: "/"
      }
    )
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 overflow-hidden"
      >
        {profilePicture?.imageUrl ? (
          <img
            src={profilePicture.imageUrl}
            alt="Profile"
            className="w-full h-full object-cover cursor-pointer"
          />
        ) : (
          <span className="text-lg font-semibold cursor-pointer">
            {username?.charAt(0).toUpperCase() || 'U'}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200 animate-scale-in">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-800">
              {username || 'User'}
            </p>
            <p className="text-xs text-gray-500">
              {session?.user?.email || 'user@example.com'}
            </p>
          </div>


          <Link href={`/profile/${username}`}>
            <div
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Your Profile
            </div>
          </Link>

          <Link href="/settings">
            <div
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </div>
          </Link>

          <div className="border-t border-gray-100 my-1"></div>

          <div
            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
            onClick={handleLogout}
          >
            <svg className="w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          0% { opacity: 0; transform: scale(0.95) translateY(-10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-in {
          animation: scale-in 0.15s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProfileDropdown;