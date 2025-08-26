"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { IImage } from "@/models/Images";
import { IVideo } from "@/models/Video";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import TimelineImages from "./components/TimelineImages";
import TimelineVideos from "./components/TimelineVideos";
import TimeLine from "./components/TimeLine";
import { DataModel } from "@/lib/objects";
import { IUser } from "@/models/User";
import PostContents from "@/app/components/PostContents";
import ProfilePictureChanger from "./components/ChangePfp";
import { IProfile } from "@/models/ProfilePicture";

const tabs = ["posts", "photos", "videos"] as const;
type TabType = typeof tabs[number];

const ProfilePage = () => {
  const params = useParams()
  console.log("URL Params: ", params)
  const { data: session, status } = useSession();
  const [images, setImages] = useState<IImage[]>([]);
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const username = params?.username as string;
  console.log("USERNAME: ", username)
  const [profileUser, setProfileUser] = useState<IUser | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [profilePicture, setProfilePicture] = useState<IProfile | null>(null);



  useEffect(() => {
    const loadProfile = async () => {
      const user = await DataModel.getUserByUsername(username);
      console.log("USER PROFILE", user);
      setProfileUser(user);
      setIsCurrentUser(session?.user?.username == username)
    }

    const fetchImages = async () => {
      try {
        setLoading(true)
        const VidData = await DataModel.getVideos(username)
        const data = await DataModel.getImages(username);
        console.log("IMAGES", data)
        console.log("VIDEOSSS", VidData)
        setVideos(VidData);
        setImages(data);
      } catch (err) {
        console.error("Failed to load images:", err);
      } finally {
        setLoading(false)
      }
    };
    loadProfile();
    fetchImages()
  }, [username]);

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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);


  const activeTab = pathname?.includes('photos') ? 'photos' :
    pathname?.includes('videos') ? 'videos' : 'posts';

  const handleTabClick = (tab: TabType) => {
    if (tab === 'posts') {
      router.push(`/profile/${profileUser?.username}`);
    } else {
      router.push(`/profile/${profileUser?.username}/${tab}`);
    }
  };

  const handleProfilePicture = () => {
    setOpenProfile(true)
  }

  if (status === "loading") return <div className="text-center mt-10"><div className="flex w-full h-0.5">
    <div className="relative w-full overflow-hidden">
      <div className="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-blue-500 via-gray-500 to-blue-500 animate-[progress_2s_linear_infinite]"></div>
    </div>
    <style>
      {`
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
    </style>
  </div></div>;



  console.log("current user: ", isCurrentUser)
  if (loading) {
    return (
      <div className="flex w-full h-0.5">
        <div className="relative w-full overflow-hidden">
          <div className="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-blue-500 via-gray-500 to-blue-500 animate-[progress_2s_linear_infinite]"></div>
        </div>
        <style>
          {`
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
        </style>
      </div>
    );
  }

  return (
    <>

      <Link href={'/dashboard'} className="ml-4 text-blue-600 hover:underline">← Go to Dashboard</Link>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-10">
          <img
            onClick={handleProfilePicture}
            src={profilePicture?.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profileUser?.username}`}
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-blue-500 object-cover"
          />

          <div>
            <h1 className="text-2xl font-bold text-gray-800">{profileUser?.username}</h1>
            <p className="text-gray-500 text-sm">{profileUser?.email}</p>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`capitalize px-4 py-1 rounded-t font-medium cursor-pointer ${activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-500"
                }`}
            >
              {tab === "posts" ? "Posts" : tab === "photos" ? "Photos" : "Videos"}
            </button>
          ))}
        </div>

        {
          openProfile && (
            <ProfilePictureChanger
              openProfile={openProfile}
              setOpenProfile={setOpenProfile}
            />
          )
        }


        <div className="mt-4">
          {activeTab === "posts" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-6">Your Timeline</h2>
              {isCurrentUser && (
                // <div className="post flex gap-2.5 justify-around">
                //   <div className="w-1/2">
                //     <PostVideo />
                //   </div>
                //   <div className="w-1/2">
                //     <PostImage />
                //   </div>
                // </div>
                <PostContents />

              )}
              <TimeLine params={username} />
            </div>
          )}
          {activeTab === "photos" && <TimelineImages images={images} />}
          {activeTab === "videos" && <TimelineVideos videos={videos} />}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;