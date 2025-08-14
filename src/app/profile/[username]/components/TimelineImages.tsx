"use client";
import React from "react";
import { IImage } from "@/models/Images";
import getTimeAgo from "@/hooks/timeConvert";

interface Props {
  images: IImage[];
}

const TimelineImages: React.FC<Props> = ({ images }) => {
  if (images.length === 0) {
    return <p className="text-gray-500 text-center">You haven't uploaded any images yet.</p>;
  }

  console.log("Images Recieved!!!", images)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {images.map((image) => (
        <div
          key={image._id?.toString()}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <img
            src={image.fileUrl}
            alt="Uploaded"
            className="w-full h-60 object-cover"
          />
          <div className="p-4">
            <p className="text-gray-700 text-sm">
              {image.caption || ""}
            </p>
            {image.createdAt && (
              <p className="text-xs text-gray-400 mt-1">
                {image.createdAt ? getTimeAgo(image.createdAt?.toString()) : "Date Unknown"}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineImages;
