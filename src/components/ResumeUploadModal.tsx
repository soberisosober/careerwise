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
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || 
          selectedFile.type === 'application/msword' ||
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a PDF or DOC file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      await onUpload(file);
    } catch (err) {
      setError('Failed to upload resume. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upload Your Resume</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isProcessing}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              id="resume-upload"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
            <label
              htmlFor="resume-upload"
              className={`cursor-pointer flex flex-col items-center ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="h-12 w-12 text-blue-500 mb-4" />
              <span className="text-gray-600 mb-2">
                {file ? file.name : 'Click to upload your resume'}
              </span>
              <span className="text-sm text-gray-500">
                Supported formats: PDF, DOC, DOCX
              </span>
            </label>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isProcessing}
            className={`px-6 py-2 rounded-lg font-medium flex items-center ${
              !file || isProcessing
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isProcessing ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processing...
              </>
            ) : (
              <>
                <FileText className="h-5 w-5 mr-2" />
                Upload Resume
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadModal; 