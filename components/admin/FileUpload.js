import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';

const FileUpload = ({ onUploadComplete, acceptTypes = "image/*", folder = "uploads" }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);

      const uploadResult = await uploadBytes(storageRef, file);
      
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
      onUploadComplete(downloadURL, file);
      setProgress(100);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Upload File
      </label>
      
      <input
        type="file"
        accept={acceptTypes}
        onChange={handleFileUpload}
        disabled={uploading}
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white file:bg-white file:text-black file:border-none file:rounded file:px-3 file:py-1 file:mr-3"
      />
      
      {uploading && (
        <div className="mt-2">
          <div className="bg-gray-700 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400 mt-1">Uploading... {Math.round(progress)}%</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;