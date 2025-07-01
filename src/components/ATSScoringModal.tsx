import React, { useState, useEffect } from 'react';

interface ATSScoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (resumeText: string, jobDescription: string) => void;
}

type StepType = 'resume' | 'job-description';

const ATSScoringModal: React.FC<ATSScoringModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<StepType>('resume');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [jobUrl, setJobUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState<boolean>(false);

  const hasProgress = selectedFile || resumeText || jobDescription || jobUrl;

  const handleClose = () => {
    if (hasProgress && !showCloseConfirmation) {
      setShowCloseConfirmation(true);
    } else {
      resetModal();
      onClose();
    }
  };

  const resetModal = () => {
    setCurrentStep('resume');
    setSelectedFile(null);
    setResumeText('');
    setJobDescription('');
    setJobUrl('');
    setError('');
    setIsProcessing(false);
    setShowCloseConfirmation(false);
  };

  const confirmClose = () => {
    resetModal();
    onClose();
  };

  const cancelClose = () => {
    setShowCloseConfirmation(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF, Word document, or text file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setSelectedFile(file);
  };

  const processResumeFile = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError('');

    try {
      const text = await extractTextFromFile(selectedFile);
      setResumeText(text);
      setCurrentStep('job-description');
    } catch (error) {
      setError('Failed to process resume file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const extractTextFromFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (file.type === 'text/plain') {
          resolve(result);
        } else {
          // For PDF and Word files, we'll use a simplified text extraction
          // In a real application, you'd use libraries like pdf-parse or mammoth
          resolve(result);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        reader.readAsText(file); // Simplified for demo
      }
    });
  };

  const handleJobUrlImport = async () => {
    if (!jobUrl.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // In a real application, you'd implement URL scraping
      // For now, we'll show a placeholder message
      setError('URL import feature coming soon. Please paste the job description manually.');
    } catch (error) {
      setError('Failed to import job description from URL');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = () => {
    if (!resumeText.trim()) {
      setError('Please upload and process your resume first');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please provide a job description');
      return;
    }

    onComplete(resumeText, jobDescription);
    resetModal();
  };

  const goBack = () => {
    setCurrentStep('resume');
    setError('');
  };

  if (!isOpen) return null;

  if (showCloseConfirmation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Close</h3>
          <p className="text-gray-600 mb-6">
            You have unsaved progress. Are you sure you want to close?
          </p>
          <div className="flex space-x-3">
            <button
              onClick={confirmClose}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Yes, Close
            </button>
            <button
              onClick={cancelClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">ATS Score Analysis</h2>
            <p className="text-sm text-gray-600 mt-1">
              Upload your resume and job description to get your ATS compatibility score
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isProcessing}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep === 'resume' ? 'bg-blue-600 text-white' : 
              resumeText ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {resumeText ? '✓' : '1'}
            </div>
            <div className={`flex-1 h-1 mx-4 ${resumeText ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep === 'job-description' ? 'bg-blue-600 text-white' : 
              jobDescription ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {jobDescription ? '✓' : '2'}
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className={`text-sm ${currentStep === 'resume' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
              Upload Resume
            </span>
            <span className={`text-sm ${currentStep === 'job-description' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
              Job Description
            </span>
          </div>
        </div>

        {/* Step 1: Resume Upload */}
        {currentStep === 'resume' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Step 1: Upload Your Resume</h3>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              
              {selectedFile ? (
                <div className="mb-4">
                  <p className="text-sm text-gray-900 mb-2">Selected file:</p>
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-gray-700">{selectedFile.name}</span>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-lg text-gray-600 mb-2">Drop your resume here</p>
                  <p className="text-sm text-gray-500 mb-4">or</p>
                </>
              )}
              
              <label className="cursor-pointer">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block">
                  Choose File
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  disabled={isProcessing}
                />
              </label>
              
              <p className="text-xs text-gray-500 mt-2">
                Supports PDF, DOC, DOCX, TXT (max 10MB)
              </p>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={processResumeFile}
                disabled={!selectedFile || isProcessing}
                className={`px-6 py-2 rounded-md text-sm font-medium ${
                  !selectedFile || isProcessing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Next Step'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Job Description */}
        {currentStep === 'job-description' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Step 2: Add Job Description</h3>
            
            {/* URL Import Option */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Import from URL (optional)
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://example.com/job-posting"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                />
                <button
                  onClick={handleJobUrlImport}
                  disabled={isProcessing || !jobUrl.trim()}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    isProcessing || !jobUrl.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  Import
                </button>
              </div>
            </div>

            {/* Manual Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here, including requirements, responsibilities, and qualifications..."
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                disabled={isProcessing}
              />
              <p className="text-xs text-gray-500 mt-1">
                Include as much detail as possible for better analysis
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={goBack}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isProcessing}
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={!jobDescription.trim() || isProcessing}
                className={`px-6 py-2 rounded-md text-sm font-medium ${
                  !jobDescription.trim() || isProcessing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  'Analyze ATS Score'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSScoringModal;
