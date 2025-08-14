import React, { useEffect, useState } from 'react';
import { IImage } from '@/models/Images';
import { DataModel } from '@/lib/objects';
import { IVideo } from '@/models/Video';
import getTimeAgo from '@/hooks/timeConvert';
interface Props {
  // images: IImage[];
  params: string;
}

type MediaItem = 
  | ({ type: 'image' } & IImage)
  | ({ type: 'video' } & IVideo);

const TimeLine: React.FC<Props> = ({ params }) => {
  console.log("USERNAME RECIEVED!!!!", params)
  const userTimeline = params
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError(null);

      const [imageData, videoData] = await Promise.all([
        DataModel.getImages(userTimeline),
        DataModel.getVideos(userTimeline)
      ]);

      const imagesArray = Array.isArray(imageData) ? imageData : [imageData];
      const videosArray = Array.isArray(videoData) ? videoData : [videoData];

      const combinedMedia: MediaItem[] = [
        ...imagesArray.map(img => ({ ...img, type: 'image' as const })),
        ...videosArray.map(vid => ({ ...vid, type: 'video' as const }))
      ].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      setMedia(combinedMedia);
    } catch (err) {
      console.error("Failed to load media:", err);
      setError(err instanceof Error ? err.message : "Failed to load media");
    } finally {
      setLoading(false);
    }
  };
  fetchMedia();
}, [userTimeline]); // Add userTimeline to dependencies

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
        You haven't posted anything stupid
      </div>
    );
  }

  return (
    <div className="posts">
      <h1 className="sectionheader text-center text-4xl m-10">Posts</h1>
      <div className="grid grid-cols-1 gap-4 p-4">
        {media.map((item, index) => (
          <div 
            key={item._id?.toString() || index}
            className="bg-transparent rounded-sm shadow-md overflow-hidden"
          >
            {item.type === 'image' ? (
              <>
              <div className="p-4">
                  {item.caption && (
                    <p className="text-gray-700 mb-2">{item.caption}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {item.createdAt ? getTimeAgo(item.createdAt?.toString()) : "Date Unknown"}
                  </p>
                </div>
                <img
                  src={item.fileUrl}
                  alt={item.caption || `Image ${index + 1}`}
                  className="w-full md:h-200 sm:h-100 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/fallback-image.jpg';
                    console.error('Image failed to load:', item.fileUrl);
                  }}
                />
                
              </>
            ) : (
              <>
                <div className="p-4">
                  {item.title && (
                    <p className="text-gray-700 mb-2">{item.title}</p>
                  )}
                  {item.description && (
                    <p className="text-gray-500 text-sm mb-2">{item.description}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {item.createdAt ? getTimeAgo(item.createdAt?.toString()) : "Date Unknown"}
                  </p>
                </div>
                <video 
                  src={item.url}
                  className="w-full h-[50vh] object-cover"
                  controls
                  onError={(e) => {
                    console.error('Video failed to load:', item.url);
                  }}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimeLine;