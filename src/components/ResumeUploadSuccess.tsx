import React from 'react';
import { CheckCircle, ArrowRight, FileText } from 'lucide-react';

interface ResumeUploadSuccessProps {
  onViewJobs: () => void;
}

const ResumeUploadSuccess: React.FC<ResumeUploadSuccessProps> = ({ onViewJobs }) => {
  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Resume Successfully Uploaded!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We've received your resume and are analyzing it to find the best job matches for you.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 rounded-xl p-6 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-6 w-6 text-blue-600 mr-2" />
              What's Next?
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Your resume is being analyzed for skills and experience</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>We're matching your profile with relevant job opportunities</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Personalized job recommendations will be ready in a moment</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onViewJobs}
            className="w-full bg-blue-600 text-white py-4 px-8 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center group"
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