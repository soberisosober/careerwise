import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  isProcessing: boolean;
}

const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  isProcessing
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File selection event triggered');
    const file = event.target.files?.[0];
    
    if (file) {
      console.log('File selected:', file.name);
      // Check file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        console.log('Invalid file type:', file.type);
        setError('Please upload a PDF or Word document');
        setSelectedFile(null);
        return;
      }
      
      setError('');
      setSelectedFile(file);
      console.log('File validated and set');
    }
  };

  const handleUpload = async () => {
    console.log('Upload button clicked');
    if (!selectedFile) {
      console.log('No file selected for upload');
      setError('Please select a file first');
      return;
    }

    try {
      console.log('Starting file upload process');
      await onUpload(selectedFile);
      console.log('File upload completed successfully');
    } catch (error) {
      console.error('Error during file upload:', error);
      setError('Failed to upload file. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Upload Your Resume</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isProcessing}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select your resume (PDF or Word)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    disabled={isProcessing}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, DOC, or DOCX up to 10MB</p>
            </div>
          </div>
        </div>

        {selectedFile && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-700">{selectedFile.name}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || isProcessing}
          className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            !selectedFile || isProcessing
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isProcessing ? (
            <>
              <Upload className="animate-bounce w-5 h-5 mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Upload Resume
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResumeUploadModal; 