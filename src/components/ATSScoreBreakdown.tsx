import React, { useState } from 'react';
import { ATSScoreBreakdown } from '../utils/atsScoring';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

interface ATSScoreBreakdownProps {
  breakdown: ATSScoreBreakdown;
  onCategoryClick?: (category: string) => void;
  showDetailedAnalysis?: boolean;
}

interface TooltipState {
  visible: boolean;
  content: string;
  x: number;
  y: number;
}

const ATSScoreBreakdownComponent: React.FC<ATSScoreBreakdownProps> = ({
  breakdown,
  onCategoryClick,
  showDetailedAnalysis = false
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    content: '',
    x: 0,
    y: 0
  });

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 85) return 'text-green-700';
    if (score >= 70) return 'text-blue-700';
    if (score >= 50) return 'text-yellow-700';
    return 'text-red-700';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return 'bg-green-50 border-green-200';
    if (score >= 70) return 'bg-blue-50 border-blue-200';
    if (score >= 50) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getPriorityIndicator = (score: number) => {
    if (score < 50) return { level: 'High', color: 'bg-red-500', textColor: 'text-red-700' };
    if (score < 70) return { level: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return { level: 'Low', color: 'bg-green-500', textColor: 'text-green-700' };
  };

  const categoryWeights = {
    keywords: 30,
    skills: 25,
    experience: 25,
    education: 10,
    format: 10
  };

  const categoryDescriptions = {
    keywords: 'Measures how well your resume matches job-specific keywords and terminology',
    skills: 'Evaluates alignment between your skills and job requirements',
    experience: 'Assesses relevance and depth of your work experience',
    education: 'Checks educational background against job requirements',
    format: 'Reviews ATS-friendly formatting and structure'
  };

  const categoryTips = {
    keywords: 'Include exact keywords from job descriptions throughout your resume',
    skills: 'List both technical and soft skills relevant to the position',
    experience: 'Quantify achievements and highlight relevant experience',
    education: 'Include relevant degrees, certifications, and training',
    format: 'Use standard headings, bullet points, and avoid graphics'
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const showTooltip = (content: string, event: React.MouseEvent) => {
    setTooltip({
      visible: true,
      content,
      x: event.clientX,
      y: event.clientY
    });
  };

  const hideTooltip = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  const handleCategoryClick = (category: string) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    }
  };

  const categories = Object.entries(breakdown).filter(([key]) => key !== 'overall');

  return (
    <div className="space-y-6">
      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(([category, data]) => {
          const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
          const score = typeof data === 'object' ? data.score : 0;
          const priority = getPriorityIndicator(score);
          const isExpanded = expandedCategories.has(category);
          const weight = categoryWeights[category as keyof typeof categoryWeights];

          return (
            <Card
              key={category}
              className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${getScoreBgColor(score)} border-2`}
              onClick={() => handleCategoryClick(category)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>{categoryName}</span>
                    <div
                      className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center cursor-help"
                      onMouseEnter={(e) => showTooltip(categoryDescriptions[category as keyof typeof categoryDescriptions], e)}
                      onMouseLeave={hideTooltip}
                    >
                      <span className="text-xs text-gray-600">?</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-bold px-2 py-1 rounded ${getScoreTextColor(score)}`}>
                      {score}%
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${priority.color} text-white`}>
                      {priority.level}
                    </span>
                  </div>
                </CardTitle>
                <div className="text-xs text-gray-500">
                  Weight: {weight}% of total score
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-700 ${getScoreColor(score)}`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-700">{score}%</span>
                    </div>
                  </div>

                  {/* Quick Tip */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Quick Tip:</h4>
                    <p className="text-xs text-gray-600">
                      {categoryTips[category as keyof typeof categoryTips]}
                    </p>
                  </div>

                  {/* Expandable Section */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategory(category);
                    }}
                    className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <span>View Details</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="space-y-3 animate-fadeIn">
                      {typeof data === 'object' && data.details && (
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-2">Analysis Details:</h4>
                          <ul className="space-y-1">
                            {data.details.map((detail, index) => (
                              <li key={index} className="text-xs text-gray-600 flex items-start">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {typeof data === 'object' && data.recommendations && data.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-2">Recommendations:</h4>
                          <ul className="space-y-1">
                            {data.recommendations.map((rec, index) => (
                              <li key={index} className="text-xs text-gray-600 flex items-start">
                                <svg className="w-3 h-3 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Analysis Section */}
      {showDetailedAnalysis && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Detailed Category Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {categories.map(([category, data]) => {
                const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                const score = typeof data === 'object' ? data.score : 0;
                const priority = getPriorityIndicator(score);

                return (
                  <div key={category} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{categoryName}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${priority.textColor} ${priority.color.replace('bg-', 'bg-').replace('500', '100')}`}>
                          {priority.level} Priority
                        </span>
                        <span className={`text-lg font-bold ${getScoreTextColor(score)}`}>
                          {score}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Current Status</h4>
                        <div className="space-y-2">
                          {typeof data === 'object' && data.details?.map((detail, index) => (
                            <div key={index} className="flex items-start">
                              <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                                score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                              <span className="text-sm text-gray-700">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Action Items</h4>
                        <div className="space-y-2">
                          {typeof data === 'object' && data.recommendations?.map((rec, index) => (
                            <div key={index} className="flex items-start">
                              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                {index + 1}
                              </span>
                              <span className="text-sm text-gray-700">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-sm p-2 rounded shadow-lg max-w-xs pointer-events-none"
          style={{
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y - 10}px`,
          }}
        >
          {tooltip.content}
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ATSScoreBreakdownComponent;
