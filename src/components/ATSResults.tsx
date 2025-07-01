import React, { useState } from 'react';
import { ATSAnalysisResult } from '../utils/atsScoring';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

interface ATSResultsProps {
  results: ATSAnalysisResult;
  onRetest: () => void;
  onClose: () => void;
}

const ATSResults: React.FC<ATSResultsProps> = ({ results, onRetest, onClose }) => {
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'json'>('pdf');

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const calculatePotentialImprovement = () => {
    const currentScore = results.score;
    const improvements = {
      keywords: Math.min(results.breakdown.keywords.score + 15, 100),
      skills: Math.min(results.breakdown.skills.score + 12, 100),
      experience: Math.min(results.breakdown.experience.score + 10, 100),
      education: Math.min(results.breakdown.education.score + 8, 100),
      format: Math.min(results.breakdown.format.score + 10, 100),
    };

    const potentialScore = Math.round(
      improvements.keywords * 0.30 +
      improvements.skills * 0.25 +
      improvements.experience * 0.25 +
      improvements.education * 0.10 +
      improvements.format * 0.10
    );

    return { currentScore, potentialScore, improvements };
  };

  const handleExport = () => {
    if (exportFormat === 'json') {
      const dataStr = JSON.stringify(results, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ats-analysis-results.json';
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // PDF export would require a library like jsPDF in a real implementation
      alert('PDF export feature coming soon. Use JSON export for now.');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'My ATS Score Analysis',
      text: `I scored ${results.score}/100 on my ATS compatibility analysis. ${getScoreStatus(results.score)} rating!`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('Results copied to clipboard!');
    }
  };

  const { currentScore, potentialScore, improvements } = calculatePotentialImprovement();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ATS Analysis Results</h1>
          <p className="text-gray-600 mt-2">Comprehensive analysis of your resume's ATS compatibility</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-2"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Overall Score */}
      <Card className={`${getScoreColor(results.score)} border-2`}>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white shadow-lg mb-4">
              <span className="text-4xl font-bold">{results.score}</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Overall ATS Score</h2>
            <p className="text-lg font-semibold">{getScoreStatus(results.score)}</p>
            <p className="text-sm opacity-80 mt-2">
              {results.score >= 85 ? 'Your resume is highly ATS-compatible!' :
               results.score >= 70 ? 'Good ATS compatibility with room for improvement' :
               results.score >= 50 ? 'Moderate compatibility - several improvements needed' :
               'Significant improvements required for ATS compatibility'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(results.breakdown).map(([category, data]) => {
          if (category === 'overall') return null;
          
          const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
          const score = typeof data === 'object' ? data.score : 0;
          
          return (
            <Card key={category} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  {categoryName}
                  <span className={`text-sm font-bold px-2 py-1 rounded ${getScoreColor(score).replace('bg-', 'bg-').replace('text-', 'text-')}`}>
                    {score}%
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(score)}`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        {typeof data === 'object' && data.details?.map((detail, index) => (
                          <li key={index} className="text-xs">{detail}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {typeof data === 'object' && data.recommendations?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Top Suggestion:</h4>
                        <p className="text-xs text-gray-600">{data.recommendations[0]}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Before/After Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Improvement Potential
            <button
              onClick={() => setShowBeforeAfter(!showBeforeAfter)}
              className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
            >
              {showBeforeAfter ? 'Hide' : 'Show'} Details
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Score</h3>
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getScoreColor(currentScore)} border-2`}>
                <span className="text-2xl font-bold">{currentScore}</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Potential Score</h3>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-green-600 border-2 border-green-200">
                <span className="text-2xl font-bold">{potentialScore}</span>
              </div>
              <p className="text-sm text-green-600 mt-1 font-medium">
                +{potentialScore - currentScore} improvement possible
              </p>
            </div>
          </div>

          {showBeforeAfter && (
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-gray-900">Category Improvements:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(improvements).map(([category, score]) => {
                  const currentCategoryScore = results.breakdown[category as keyof typeof results.breakdown];
                  const current = typeof currentCategoryScore === 'object' ? currentCategoryScore.score : 0;
                  const improvement = score - current;
                  
                  return (
                    <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium capitalize">{category}</span>
                      <div className="text-sm">
                        <span className="text-gray-600">{current}%</span>
                        <span className="mx-2">→</span>
                        <span className="text-green-600 font-medium">{score}% (+{improvement})</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Improvement Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Strengths
              </h4>
              <ul className="space-y-2">
                {results.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-sm text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Areas for Improvement
              </h4>
              <ul className="space-y-2">
                {results.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-sm text-gray-700">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-3">Action Items</h4>
            <div className="bg-blue-50 p-4 rounded-lg">
              <ul className="space-y-2">
                {results.recommendations.slice(0, 5).map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRetest}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Test Another Resume
        </button>
        
        <div className="flex gap-2">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as 'pdf' | 'json')}
            className="border border-gray-300 rounded-lg px-3 py-3 text-sm"
          >
            <option value="pdf">PDF</option>
            <option value="json">JSON</option>
          </select>
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Export Results
          </button>
        </div>
        
        <button
          onClick={handleShare}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Share Results
        </button>
      </div>
    </div>
  );
};

export default ATSResults;
