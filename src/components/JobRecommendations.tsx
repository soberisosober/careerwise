import React from 'react';
import { Briefcase, MapPin, Building, Clock, ArrowRight } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  matchScore: number;
  description: string;
  requirements: string[];
}

interface JobRecommendationsProps {
  jobs: Job[];
}

const JobRecommendations: React.FC<JobRecommendationsProps> = ({ jobs }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Recommended Jobs for You
        </h2>
        <p className="text-xl text-gray-600">
          Based on your resume, we've found these matching opportunities
        </p>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <Building className="h-5 w-5 mr-2" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{job.location}</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {job.matchScore}% Match
                </div>
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-4">
              <Clock className="h-5 w-5 mr-2" />
              <span>{job.type}</span>
            </div>

            <p className="text-gray-600 mb-4">{job.description}</p>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Key Requirements:</h4>
              <ul className="list-disc list-inside text-gray-600">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center group">
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobRecommendations; 