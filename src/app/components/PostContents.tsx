import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { DataModel } from "@/lib/objects";

function PostContents() {
  const [showPostArea, setShowPostArea] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const caption = useWatch({ control, name: "caption" });
  const media = useWatch({ control, name: "media" });

  const onSubmit = async (data: any) => {
    console.log("Form data:", data);
    reset();
    const result = await DataModel.savePost(data);
    setShowPostArea(false);
  };

  const showModal = () => {
    setShowPostArea(true);
  };

  const isButtonDisabled = !caption && (!media || media.length === 0);
  return (
    <>
      <textarea
        name="contentshow"
        id="contentshow"
        className="border w-full p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none placeholder-gray-400"
        rows={3}
        onClick={showModal}
        placeholder="What's on your mind?"
      ></textarea>

      {showPostArea && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
          onClick={() => setShowPostArea(false)}
        >
          <div
            className="bg-white rounded-md shadow-2xl p-6 w-[50vw] animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Create Post
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  {...register("caption")}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
                  placeholder="Write your caption..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Upload Image/Video
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  {...register("media")}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                            file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 
                            hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                  onClick={() => setShowPostArea(false)}
                >
                  Cancel
                </button>
                {
                  isButtonDisabled == false && (
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 active:scale-95 transition disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Posting..." : "Post"}
                    </button>
                  )
                }

              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleUp {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-scaleUp {
          animation: scaleUp 0.25s ease-out forwards;
        }
      `}</style>
    </>
  );
}

export default PostContents;
