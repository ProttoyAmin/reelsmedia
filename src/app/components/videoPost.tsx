"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { VideoFormData } from "@/models/Video";
import { useSession } from "next-auth/react";
import { upload } from "@imagekit/next";

const PostVideo = () => {
    const { data: session } = useSession();
    const {
        register,
        handleSubmit,
        watch,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<VideoFormData>();

    const selectedVideo = watch("videoFile")?.[0];

    const onSubmit = async (data: VideoFormData) => {
        try {

            if (!selectedVideo) {
                setError('videoFile', { type: 'manual', message: 'Video file is required' });
                return;
            }

            const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
            if (!validTypes.includes(selectedVideo.type)) {
                setError('videoFile', { type: 'manual', message: 'Only MP4, WebM, OGG allowed' });
                return;
            }

            if (!session?.user) {
                throw new Error('User not authenticated');
            }

            const authResponse = await fetch('/api/auth/imagekit-auth');
            if (!authResponse.ok) {
                throw new Error('Failed to get auth params');
            }
            const { token, expire, signature, publicKey } = await authResponse.json();

            const uploadedFile = await upload({
                file: selectedVideo,
                fileName: selectedVideo.name,
                expire,
                token,
                publicKey,
                signature,
                folder: "/videos"
            });

            console.log("Upload successful to ImagKit:", uploadedFile);
            reset();

            const videoFormData = {
                title: data.title,
                description: data.description,
                url: uploadedFile.url,
                userId: session.user.id,
                username: session.user.username,
                thumbnailUrl: uploadedFile.thumbnailUrl || "",
            }

            console.log("Video Form Data:", videoFormData);

            const saveResponse = await fetch(
                '/api/auth/save-videos',
                {
                    method: 'POST',
                    body: JSON.stringify(videoFormData),
                }
            );

            console.log("Save response:", saveResponse);

        } catch (error) {
            console.error('Upload error:', error);
            setError('root', {
                type: 'manual',
                message: 'Upload failed. Please try again.'
            });
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="videoForm space-y-4 p-4 rounded-lg">
                <h3 className="text-lg font-medium">Upload Video</h3>

                <div className="titleDetails">
                    <label className="block text-sm font-medium mb-1">Title*</label>
                    <input
                        {...register("title", { required: "Title is required" })}
                        className={`w-full p-2 border rounded ${errors.title ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                </div>

                <div className="description">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        {...register("description")}
                        className="w-full p-2 border rounded border-gray-300"
                        rows={3}
                    />
                </div>

                <div className="videoInput">
                    <label className="block text-sm font-medium mb-1">Video File*</label>
                    <input
                        type="file"
                        accept="video/mp4,video/webm,video/ogg"
                        {...register('videoFile', {
                            required: 'Video file is required',
                            validate: {
                                validType: (files) => {
                                    if (!files?.[0]) return true;
                                    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
                                    return validTypes.includes(files[0].type) || 'Only MP4, WebM, OGG allowed';
                                }
                            }
                        })}
                        className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    
                    {errors.videoFile && (
                        <p className="text-red-500 text-sm mt-1">{errors.videoFile.message}</p>
                    )}
                    {selectedVideo && (
                        <div className="mt-2 text-sm text-gray-600">
                            Selected: {selectedVideo.name} ({(selectedVideo.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                    )}
                </div>

                {errors.root && (
                    <p className="text-red-500 text-sm mt-1">{errors.root.message}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-70"
                >
                    {isSubmitting ? "Uploading..." : "Upload"}
                </button>
            </form>
        </div>
    );
};

export default PostVideo;