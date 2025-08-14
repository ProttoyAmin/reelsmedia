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
import PostVideo from "@/app/components/videoPost";
import PostImage from "@/app/components/postImage";
import { IUser } from "@/models/User";

const tabs = ["posts", "photos", "videos"] as const;
type TabType = typeof tabs[number];

const ProfilePage = () => {
  const params = useParams()
  console.log("URL Params: ", params)
  const { data: session, status } = useSession();
  const [images, setImages] = useState<IImage[]>([]);
  const [videos, setVideos] = useState<IVideo[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const username = params?.username as string;
  console.log("USERNAME: ", username)
  const [profileUser, setProfileUser] = useState<IUser | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  const activeTab = pathname?.includes('photos') ? 'photos' :
    pathname?.includes('videos') ? 'videos' : 'posts';

  useEffect(() => {
    const loadProfile = async () => {
      const user = await DataModel.getUserByUsername(username);
      console.log("USER PROFILE", user);
      setProfileUser(user);
      setIsCurrentUser(session?.user?.username == username)
    }

    const fetchImages = async () => {
      try {
        const VidData = await DataModel.getVideos(username)
        const data = await DataModel.getImages(username);
        console.log("IMAGES",data)
        console.log("VIDEOSSS",VidData)
        setVideos(VidData);
        setImages(data);
      } catch (err) {
        console.error("Failed to load images:", err);
      }
    };
    loadProfile();
    fetchImages()
  }, [username, session]);

  const handleTabClick = (tab: TabType) => {
    if (tab === 'posts') {
      router.push(`/profile/${profileUser?.username}`);
    } else {
      router.push(`/profile/${profileUser?.username}/${tab}`);
    }
  };

  if (status === "loading") return <div className="text-center mt-10">Loading...</div>;
  if (status === "unauthenticated") return <div className="text-center mt-10">Please login to view your profile.</div>;
  console.log("current user: ", isCurrentUser)
  return (
    <>
      <Link href={'/dashboard'} className="ml-4 text-blue-600 hover:underline">← Go to Dashboard</Link>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-10">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${profileUser?.username}`}
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-blue-500"
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

        <div className="mt-4">
          {activeTab === "posts" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-6">Your Timeline</h2>
              {isCurrentUser && (
                <div className="post flex gap-2.5 justify-around">
                  <div className="w-1/2">
                    <PostVideo />
                  </div>
                  <div className="w-1/2">
                    <PostImage />
                  </div>
                </div>
              )}
              <TimeLine params={username}/>
            </div>
          )}
          {activeTab === "photos" && <TimelineImages images={images} />}
          {activeTab === "videos" && <TimelineVideos videos={videos}/>}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;