import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Star, Building, DollarSign, User, GraduationCap, Briefcase } from 'lucide-react';

interface JobProfile {
  title: string;
  match: number;
  description: string;
  requirements: string[];
  salaryRange: string;
  companies: string[];
}

interface Analysis {
  experience: string;
  education: string;
  skills: string[];
  jobProfiles: JobProfile[];
}

interface JobRecommendationsProps {
  analysis: Analysis;
  onReset: () => void;
}

const JobRecommendations: React.FC<JobRecommendationsProps> = ({ analysis, onReset }) => {
  console.log('JobRecommendations rendered with analysis:', analysis);

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'text-jungle_green bg-jungle_green/20';
    if (match >= 80) return 'text-fluorescent_cyan-300 bg-fluorescent_cyan/20';
    if (match >= 70) return 'text-amaranth_purple bg-amaranth_purple/20';
    return 'text-licorice-700 bg-columbia_blue-600';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-licorice mb-2">Your Job Recommendations</h2>
          <p className="text-licorice-700">Based on your resume analysis, here are the best matches for you</p>
        </div>
        <Button 
          onClick={onReset}
          variant="outline"
          showArrow={false}
          className="flex items-center space-x-2 border-columbia_blue-300 text-licorice hover:bg-columbia_blue-600/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Upload New Resume</span>
        </Button>
      </div>

      {/* Analysis Summary */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-columbia_blue/80 backdrop-blur-sm border-columbia_blue-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg text-licorice">
              <User className="w-5 h-5 text-jungle_green" />
              <span>Experience Level</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-licorice">{analysis.experience}</p>
          </CardContent>
        </Card>

        <Card className="bg-columbia_blue/80 backdrop-blur-sm border-columbia_blue-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg text-licorice">
              <GraduationCap className="w-5 h-5 text-fluorescent_cyan-300" />
              <span>Education</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-licorice">{analysis.education}</p>
          </CardContent>
        </Card>

        <Card className="bg-columbia_blue/80 backdrop-blur-sm border-columbia_blue-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg text-licorice">
              <Briefcase className="w-5 h-5 text-amaranth_purple" />
              <span>Top Skills</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {analysis.skills.slice(0, 4).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-jungle_green/20 text-jungle_green border-jungle_green/30">
                  {skill}
                </Badge>
              ))}
              {analysis.skills.length > 4 && (
                <Badge variant="outline" className="text-xs border-columbia_blue-300 text-licorice-700">
                  +{analysis.skills.length - 4} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Recommendations */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-licorice">Recommended Job Profiles</h3>
        
        <div className="grid gap-6">
          {analysis.jobProfiles.map((job, index) => (
            <Card key={index} className="bg-columbia_blue/80 backdrop-blur-sm border-columbia_blue-300 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-xl font-bold text-licorice">{job.title}</h4>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 ${getMatchColor(job.match)}`}>
                        <Star className="w-4 h-4" />
                        <span>{job.match}% Match</span>
                      </div>
                    </div>
                    <p className="text-licorice-700 mb-4">{job.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-licorice mb-2">Required Skills</h5>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, reqIndex) => (
                        <Badge 
                          key={reqIndex} 
                          variant={analysis.skills.includes(req) ? "default" : "outline"}
                          className={`text-xs ${
                            analysis.skills.includes(req) 
                              ? "bg-jungle_green text-white" 
                              : "border-columbia_blue-300 text-licorice-700"
                          }`}
                        >
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-jungle_green" />
                      <span className="font-semibold text-licorice">{job.salaryRange}</span>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Building className="w-4 h-4 text-fluorescent_cyan-300" />
                        <span className="font-semibold text-licorice">Hiring Companies</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.companies.map((company, compIndex) => (
                          <Badge key={compIndex} variant="outline" className="text-xs border-columbia_blue-300 text-licorice-700">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-columbia_blue-300">
                  <Button className="text-white">
                    View Similar Jobs
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Skills Analysis */}
      <Card className="mt-8 bg-columbia_blue/80 backdrop-blur-sm border-columbia_blue-300">
        <CardHeader>
          <CardTitle className="text-licorice">Your Complete Skill Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {analysis.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="bg-jungle_green/20 text-jungle_green border-jungle_green/30">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobRecommendations; 