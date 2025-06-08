import React, { useState } from 'react';
import { Building2, MapPin, Briefcase, CheckCircle2, Loader2, Upload, Search } from 'lucide-react';
import { get_JobRecommendations } from '../utils/resumeParser';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  matchScore: number;
  description: string;
  requirements: string[];
  matchingSkills: string[];
}

interface JobRecommendationsProps {
  jobs?: Job[];
  isLoading?: boolean;
}

const JobRecommendations: React.FC<JobRecommendationsProps> = ({ jobs: initialJobs = [], isLoading: initialLoading = false }) => {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setJobs([]);  // Clear previous results on new file select
      setError(null);
      console.log('File selected:', e.target.files[0].name);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleUploadClick = async () => {
    if (!file) {
      setError('Please select a resume PDF file first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setJobs([]);
    try {
      console.log('Starting resume processing...');
      const recommendations = await get_JobRecommendations(file, prompt);
      console.log('Received job recommendations:', recommendations);
      if (recommendations.length === 0) {
        setError('No matching jobs found. Try adjusting your search criteria.');
      }
      setJobs(recommendations);
    } catch (err) {
      console.error('Error during resume processing:', err);
      setError('Failed to process resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Perfect Job Match</h2>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700 mb-1">Upload your resume (PDF only)</span>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input type="file" className="sr-only" accept="application/pdf" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF up to 10MB</p>
                </div>
              </div>
            </label>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700 mb-1">Optional job filter</span>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={prompt}
                  onChange={handlePromptChange}
                  placeholder="e.g. Data Analyst, Remote, Senior"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </label>
          </div>

          <button
            onClick={handleUploadClick}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Find Matching Jobs'}
          </button>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Finding the best job matches for you...</p>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Building2 className="w-4 h-4 mr-1" />
                    <span>{job.company}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {job.matchScore}% Match
                  </div>
                </div>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="mr-4">{job.location}</span>
                <Briefcase className="w-4 h-4 mr-1" />
                <span>{job.type}</span>
              </div>
              
              <p className="text-gray-700 mb-4">{job.description}</p>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Matching Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {job.matchingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default JobRecommendations; 