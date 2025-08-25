import React, { useState, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { DataModel } from "@/lib/objects";
import { IPost } from "@/models/Content";
import { upload } from "@imagekit/next";
import { useSession } from "next-auth/react";


function PostContents() {
  const [showPostArea, setShowPostArea] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<IPost>({
    mode: "onChange",
  });

  const caption = useWatch({ control, name: "caption" });
  const media = useWatch({ control, name: "media" });

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("media", file);
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
      setMediaType(file.type.startsWith("image") ? "image" : "video");
    }
  };

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    const selectedVideo = data.media;
    console.log("Selected Video:: ", selectedVideo)

    try {
      const authResponse = await fetch('/api/auth/imagekit-auth');
      if (!authResponse.ok) {
        throw new Error('Failed to get auth params');
      }

      const { token, expire, signature, publicKey } = await authResponse.json();
      console.log("Token: ", token, "Expire: ", expire)

      const uploadedFile = await upload({
        file: selectedVideo,
        fileName: selectedVideo.name,
        expire,
        token,
        publicKey,
        signature,
        folder: "/videos"
      });

      console.log("Uploaded File: ", uploadedFile)

      const postData = {
        contentType: mediaType,
        text: data.caption,
        mediaUrl: uploadedFile.url,
        mediaType: uploadedFile.fileType,
        createdBy: session.user.username,
        privacy: data.privacy
      }

      const result = await DataModel.savePost(postData);
      reset();
      setMediaPreview(null);
      setMediaType(null);
      setShowPostArea(false);

    } catch (error) {
      console.error("Error saving post:", error);
    }

  };

  const showModal = () => {
    setShowPostArea(true);
  };

  const closeModal = () => {
    setShowPostArea(false);
    reset();
    setMediaPreview(null);
    setMediaType(null);
  };

  const isButtonDisabled = !caption && (!media || media.length === 0);

  return (
    <>
      <div className="relative">
        <textarea
          name="contentshow"
          id="contentshow"
          className="border w-full p-5 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none placeholder-gray-400 text-lg transition-all duration-300 hover:shadow-md"
          rows={3}
          onClick={showModal}
          placeholder="What's on your mind?"
        ></textarea>
        <div className="absolute bottom-3 right-3 flex items-center">
          <span className="text-gray-400 text-sm mr-2">Press to post</span>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white" onClick={showModal}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {showPostArea && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl mx-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Create Post</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" encType="multipart/form-data">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  U
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">User Name</h3>
                  <div className="mt-1">
                    <select
                      {...register("privacy")}
                      className="text-xs border rounded-lg px-2 py-1 text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-300"
                      defaultValue="public"
                    >
                      <option value="public">🌍 Public</option>
                      <option value="friends">👥 Friends</option>
                      <option value="private">🔒 Private</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <textarea
                  {...register("caption", { maxLength: 500 })}
                  className="w-full border-0 rounded-lg p-2 focus:ring-0 focus:outline-none text-black text-lg resize-none min-h-[120px]"
                  placeholder="What's on your mind?"
                  rows={4}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {caption?.length || 0}/500
                </div>
                {errors.caption && (
                  <p className="text-red-500 text-sm mt-1">Caption must be less than 500 characters</p>
                )}
              </div>

              {mediaPreview && (
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                  {mediaType === "image" ? (
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <video
                      src={mediaPreview}
                      className="w-full h-64 object-cover"
                      controls
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMediaPreview(null);
                      setMediaType(null);
                      setValue("media", null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}

              <div className="border-t border-b py-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Add to your post</h3>
                <div className="flex space-x-4">
                  <label className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      {...register("media")}
                      onChange={handleMediaChange}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </label>

                  <button type="button" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                  <button type="button" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>

                  <button type="button" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                </div>
                {errors.media && (
                  <p className="text-red-500 text-sm mt-2">{errors.media.message as string}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isButtonDisabled || isSubmitting}
                className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-300 ${isButtonDisabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg"
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </div>
                ) : (
                  "Post"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleUp {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scaleUp {
          animation: scaleUp 0.3s ease-out forwards;
        }
        
        textarea:focus, input:focus, select:focus {
          outline: none;
          ring: none;
        }
      `}</style>
    </>
  );
}

export default PostContents;