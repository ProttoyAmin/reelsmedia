import React, { useState, useRef } from 'react';
import { DataModel } from '@/lib/objects';
import { upload } from '@imagekit/next';
import { useSession } from 'next-auth/react';
import { IProfile } from '@/models/ProfilePicture';

interface ProfilePictureChangerProps {
  openProfile: boolean;
  setOpenProfile: (open: boolean) => void;
  currentProfilePic?: string;
}

const ProfilePictureChanger: React.FC<ProfilePictureChangerProps> = ({
  openProfile,
  setOpenProfile,
  currentProfilePic = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSave = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append('profilePicture', selectedImage);

      console.log('Profile picture dataaaaa:', selectedImage);

      try {
        const authParams = await fetch('/api/auth/imagekit-auth')
        const { token, expire, signature, publicKey } = await authParams.json();

        const uploadedFile = await upload({
          file: selectedImage,
          fileName: selectedImage.name,
          expire: expire,
          token: token,
          publicKey: publicKey,
          signature: signature,
          folder: '/ProfilePictures',
        })

        console.log("SUCCESSFULLY UPLOADED: ", uploadedFile)

        const imageData: IProfile = {
          imageUrl: uploadedFile.url!,
          takenBy: session?.user.username!
        }

        const result = await DataModel.saveProfile(imageData)
        console.log("Posted to MONGODB : ", result)


      } catch (error) {
        console.error
      } finally {
        setOpenProfile(false);
        setSelectedImage(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
      }


      setOpenProfile(false);

      setSelectedImage(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
    }
  };

  const handleClose = () => {
    setOpenProfile(false);
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  React.useEffect(() => {
    if (openProfile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [openProfile]);

  if (!openProfile) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Change Profile Picture</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div
              className={`w-32 h-32 rounded-full mb-4 overflow-hidden border-2 ${isDragging ? 'border-blue-500 border-dashed' : 'border-gray-200'} flex items-center justify-center transition-colors cursor-pointer`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={currentProfilePic}
                  alt="Current profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <p className="text-gray-600 text-center mb-4">
              {isDragging ? 'Drop your image here' : 'Click to upload or drag and drop'}
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Select Image
            </button>
          </div>

          <p className="text-sm text-gray-500 text-center mb-6">
            Recommended: Square JPG or PNG, at least 200x200 pixels
          </p>
        </div>

        <div className="flex justify-end space-x-3 p-6 bg-gray-50 rounded-b-xl">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedImage}
            className={`px-4 py-2 rounded-lg transition-colors ${!selectedImage ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Save Changes
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProfilePictureChanger;