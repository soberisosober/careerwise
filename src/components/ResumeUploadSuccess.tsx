import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface ResumeUploadSuccessProps {
  onViewJobs: () => void;
}

const ResumeUploadSuccess: React.FC<ResumeUploadSuccessProps> = ({ onViewJobs }) => {
  const handleViewJobs = () => {
    console.log('User clicked "View Job Matches" from success screen');
    onViewJobs();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Resume Uploaded Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            We've received your resume and are analyzing it to find the best job matches for you.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-left text-blue-800 space-y-2">
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>We'll analyze your skills and experience</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>Match you with relevant job opportunities</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>Show you jobs that align with your career goals</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleViewJobs}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center group"
          >
            View Job Matches
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadSuccess; 