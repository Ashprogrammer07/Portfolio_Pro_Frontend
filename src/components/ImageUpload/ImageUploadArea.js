import React, { useState } from 'react';

const ImageUploadArea = ({ onImagesUploaded, disabled = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [uploadError, setUploadError] = useState(null);

  const uploadImages = async (files) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress({ current: 0, total: files.length });

    try {
      const uploadPromises = files.map(async (file, index) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/projects/upload-image`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to upload ${file.name}`);
        }

        const data = await response.json();
        setUploadProgress(prev => ({ ...prev, current: prev.current + 1 }));
        
        return data.data?.url || data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      if (onImagesUploaded) {
        onImagesUploaded({
          successful: uploadedUrls.filter(url => url),
          failed: []
        });
      }
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    uploadImages(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (!disabled) {
      const files = Array.from(e.dataTransfer.files);
      uploadImages(files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          disabled 
            ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 cursor-not-allowed'
            : dragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 cursor-pointer'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          disabled={disabled || isUploading}
          className="hidden"
        />
        
        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
          {isUploading ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
              <div className="text-lg font-medium">Uploading Images...</div>
              {uploadProgress.total > 0 && (
                <div className="w-64 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                  ></div>
                </div>
              )}
              <p className="text-sm text-gray-500">
                {uploadProgress.current} of {uploadProgress.total} images uploaded
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl">📷</div>
              <div className="text-xl font-semibold">Upload Project Images</div>
              <div className="text-gray-500 space-y-1">
                <p>Drag & drop images here, or click to select files</p>
                <p className="text-sm">Maximum 5MB per file • JPG, PNG, GIF, WebP supported</p>
              </div>
            </div>
          )}
        </label>
      </div>

      {/* Error Display */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-red-500 mr-2">⚠️</span>
            <div className="flex-1">
              <h4 className="text-red-800 font-semibold mb-1">Upload Error</h4>
              <p className="text-red-700 text-sm">{uploadError}</p>
            </div>
            <button
              onClick={() => setUploadError(null)}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadArea;
