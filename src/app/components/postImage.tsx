"use client";
import React, { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { upload } from '@imagekit/next';
import { ImageFormData } from '@/models/Images';

function PostImage() {
  const { data: session, status } = useSession()
  console.log(session, "Session Data")
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<ImageFormData>({
    mode: 'onChange',
  })

  const selectedFile = watch('image')?.[0]
  const preview = selectedFile ? URL.createObjectURL(selectedFile) : null

  const onSubmit = async (data: ImageFormData) => {
    console.log('Form submitted:', data)
    try {
      const file = data.image[0]

      if (!file) {
        setError('image', { type: 'manual', message: 'File is required' })
        return
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        setError('image', { type: 'manual', message: 'Only JPG, PNG, GIF allowed' })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('image', { type: 'manual', message: 'File too large (max 5MB)' })
        return
      }

      const authParams = await fetch('/api/auth/imagekit-auth')
      const { token, expire, signature, publicKey } = await authParams.json()

      console.log({ token, expire, signature, publicKey })

      const uploadedFile = await upload({
        file: file,
        fileName: file.name,
        expire: expire,
        token: token,
        publicKey: publicKey,
        signature: signature,
        folder: '/images',
      })

      console.log("Caption", data.caption)

      const response = await fetch('/api/auth/save-image',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            caption: data.caption,
            fileID: uploadedFile.fileId,
            fileType: file.type,
            fileUrl: uploadedFile.url,
            uploadedBy: session?.user?.username || '',
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save image');
        return;
      }

      console.log('File uploaded successfully:', uploadedFile)


      console.log('File ready for upload:', {
        name: file.name,
        type: file.type,
        size: file.size,
      })

      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('File ready for upload!', {
        position: 'top-center',
      })
      reset()

    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload preparation failed', {
        position: 'top-center',
      })
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  if (status === 'loading') {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <>
      <div className="space-y-6">
        <div className="">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 rounded-lg">
            <h2 className="text-lg font-medium">Upload Photo</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Caption</label>
              <input
                type="text"
                {...register('caption')}
                className="block w-full border border-gray-300 rounded-md p-2"
              />
              {errors.caption && (
                <p className="mt-1 text-sm text-red-600">{errors.caption.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose an image
              </label>
              <input
                type="file"
                accept="image/*"
                {...register('image', {
                  required: 'Image is required',
                  validate: {
                    fileType: (files) =>
                      ['image/jpeg', 'image/png', 'image/gif'].includes(files?.[0]?.type) ||
                      'Only JPG, PNG, GIF allowed',
                    fileSize: (files) =>
                      (files?.[0]?.size || 0) <= 5 * 1024 * 1024 ||
                      'File too large (max 5MB)',
                  },
                })}

                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                disabled={isSubmitting}
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG, GIF up to 5MB
              </p>
            </div>

            {preview && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                <div className="border rounded-md p-2 max-w-xs">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-60 mx-auto"
                    onLoad={() => URL.revokeObjectURL(preview)}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedFile || isSubmitting}
              className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-70 ${!selectedFile || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Upload'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default PostImage;