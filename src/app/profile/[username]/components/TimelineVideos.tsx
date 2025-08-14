"use client"
import React, { useState, useEffect } from 'react';
import { IVideo } from '@/models/Video';
import { VideoOff } from 'lucide-react';
import getTimeAgo from '@/hooks/timeConvert';

interface Props {
  videos: IVideo[];
}


const TimelineVideos: React.FC<Props> = ({videos}) => {
    if (videos.length == 0) {
        return <p className='text-gray-500 text-center'>You haven't uploaded any videos dude.</p>
    }

    return (
        <div>
            {
                videos.map(
                    (video, index) => (
                        <div className="videos" key={video._id?.toString()}>
                            <h1 className="title">{video.title}</h1>
                            <p className="description">{video.description}</p>
                            <video src={video.url} className="video w-full h-[50vh] object-cover" controls onError={(e) => {
                                console.error('Video failed to load:', video.url);
                            }}></video>
                            <p className="time">{video.createdAt ? getTimeAgo(video.createdAt.toString()) : 'Date unknown'}</p>

                        </div>
                    )
                )
            }
        </div>
    )
}

export default TimelineVideos
