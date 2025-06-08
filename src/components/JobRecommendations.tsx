import React from 'react';
import { Building2, MapPin, Briefcase, CheckCircle2, XCircle } from 'lucide-react';

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
  jobs: Job[];
}

const JobRecommendations: React.FC<JobRecommendationsProps> = ({ jobs }) => {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Job Matches</h2>
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
    </div>
  );
};

export default JobRecommendations; 