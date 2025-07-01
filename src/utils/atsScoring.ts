export interface ATSScoreBreakdown {
  keywords: {
    score: number;
    details: string[];
    recommendations: string[];
  };
  skills: {
    score: number;
    details: string[];
    recommendations: string[];
  };
  experience: {
    score: number;
    details: string[];
    recommendations: string[];
  };
  education: {
    score: number;
    details: string[];
    recommendations: string[];
  };
  format: {
    score: number;
    details: string[];
    recommendations: string[];
  };
  overall: number;
}

export interface ATSAnalysisResult {
  score: number;
  breakdown: ATSScoreBreakdown;
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
}

// Industry-standard keywords by category
const industryKeywords = {
  technical: [
    'javascript', 'typescript', 'react', 'node.js', 'python', 'java', 'sql',
    'aws', 'docker', 'kubernetes', 'git', 'api', 'database', 'html', 'css',
    'angular', 'vue', 'mongodb', 'postgresql', 'redis', 'graphql', 'rest'
  ],
  management: [
    'leadership', 'project management', 'team lead', 'scrum', 'agile', 'budgeting',
    'strategic planning', 'stakeholder management', 'cross-functional', 'mentoring'
  ],
  business: [
    'analysis', 'strategy', 'consulting', 'requirements', 'process improvement',
    'roi', 'kpi', 'metrics', 'business intelligence', 'data analysis'
  ],
  communication: [
    'presentation', 'written communication', 'verbal communication', 'documentation',
    'training', 'collaboration', 'client relations', 'public speaking'
  ]
};

// Skills hierarchy for semantic matching
const skillHierarchy = {
  'javascript': ['js', 'es6', 'es2015', 'ecmascript'],
  'typescript': ['ts'],
  'react': ['reactjs', 'react.js'],
  'node.js': ['nodejs', 'node'],
  'python': ['py'],
  'database': ['db', 'databases'],
  'sql': ['mysql', 'postgresql', 'sqlite'],
  'aws': ['amazon web services'],
  'api': ['rest api', 'restful', 'graphql']
};

// Experience keywords and their relevance weights
const experienceKeywords = {
  senior: ['senior', 'lead', 'principal', 'architect', 'director', 'manager'],
  mid: ['developer', 'engineer', 'analyst', 'specialist', 'coordinator'],
  junior: ['junior', 'associate', 'intern', 'trainee', 'entry-level']
};

// Education levels and their scores
const educationLevels = {
  'phd': 100,
  'doctorate': 100,
  'master': 85,
  'mba': 85,
  'bachelor': 70,
  'associate': 50,
  'certificate': 30,
  'diploma': 25
};

// Format requirements for ATS compliance
const formatRequirements = [
  'proper headings',
  'consistent formatting',
  'readable fonts',
  'appropriate sections',
  'contact information',
  'no images or graphics',
  'standard file format',
  'proper spacing'
];

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractKeywords(text: string): string[] {
  const normalized = normalizeText(text);
  const words = normalized.split(' ');
  const keywords = new Set<string>();

  // Extract individual keywords
  Object.values(industryKeywords).flat().forEach(keyword => {
    if (normalized.includes(keyword.toLowerCase())) {
      keywords.add(keyword);
    }
  });

  // Extract multi-word phrases
  const phrases = [
    'project management', 'data analysis', 'business intelligence',
    'machine learning', 'artificial intelligence', 'web development',
    'software development', 'full stack', 'front end', 'back end'
  ];

  phrases.forEach(phrase => {
    if (normalized.includes(phrase)) {
      keywords.add(phrase);
    }
  });

  return Array.from(keywords);
}

function calculateKeywordScore(resumeText: string, jobDescription: string): {
  score: number;
  details: string[];
  recommendations: string[];
} {
  const resumeKeywords = extractKeywords(resumeText);
  const jobKeywords = extractKeywords(jobDescription);
  
  if (jobKeywords.length === 0) {
    return {
      score: 50,
      details: ['No job keywords found for comparison'],
      recommendations: ['Provide a more detailed job description']
    };
  }

  const matchingKeywords = resumeKeywords.filter(keyword =>
    jobKeywords.some(jobKeyword => 
      keyword === jobKeyword || 
      skillHierarchy[keyword]?.includes(jobKeyword) ||
      skillHierarchy[jobKeyword]?.includes(keyword)
    )
  );

  const score = Math.round((matchingKeywords.length / jobKeywords.length) * 100);
  const missingKeywords = jobKeywords.filter(keyword =>
    !matchingKeywords.includes(keyword) &&
    !skillHierarchy[keyword]?.some(variant => resumeKeywords.includes(variant))
  );

  const details = [
    `Found ${matchingKeywords.length} matching keywords out of ${jobKeywords.length} job requirements`,
    `Matching keywords: ${matchingKeywords.join(', ')}`,
    `Missing keywords: ${missingKeywords.slice(0, 10).join(', ')}`
  ];

  const recommendations = [];
  if (score < 70) {
    recommendations.push('Include more job-specific keywords throughout your resume');
    recommendations.push(`Focus on adding these missing keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
  }
  if (score < 50) {
    recommendations.push('Consider tailoring your resume more closely to the job description');
  }

  return { score: Math.max(score, 10), details, recommendations };
}

function calculateSkillsScore(resumeText: string, jobDescription: string): {
  score: number;
  details: string[];
  recommendations: string[];
} {
  const resumeSkills = extractKeywords(resumeText).filter(keyword =>
    Object.values(industryKeywords).flat().includes(keyword)
  );
  
  const jobSkills = extractKeywords(jobDescription).filter(keyword =>
    Object.values(industryKeywords).flat().includes(keyword)
  );

  if (jobSkills.length === 0) {
    return {
      score: 60,
      details: ['No specific skills found in job description'],
      recommendations: ['Highlight your most relevant technical and soft skills']
    };
  }

  const matchingSkills = resumeSkills.filter(skill =>
    jobSkills.includes(skill) ||
    skillHierarchy[skill]?.some(variant => jobSkills.includes(variant))
  );

  const score = Math.round((matchingSkills.length / jobSkills.length) * 100);
  
  const details = [
    `${matchingSkills.length} of ${jobSkills.length} required skills found`,
    `Your skills: ${resumeSkills.slice(0, 10).join(', ')}`,
    `Required skills: ${jobSkills.join(', ')}`
  ];

  const recommendations = [];
  if (score < 80) {
    recommendations.push('Add more relevant technical skills to your resume');
    recommendations.push('Include skill levels or years of experience for each skill');
  }
  if (score < 60) {
    recommendations.push('Consider taking courses to develop missing skills');
  }

  return { score: Math.max(score, 15), details, recommendations };
}

function calculateExperienceScore(resumeText: string, jobDescription: string): {
  score: number;
  details: string[];
  recommendations: string[];
} {
  const normalized = normalizeText(resumeText);
  const jobNormalized = normalizeText(jobDescription);
  
  // Extract years of experience
  const experienceMatches = resumeText.match(/(\d+)\s*(?:\+|\-|\–)?\s*(?:years?|yrs?)/gi) || [];
  const totalYears = experienceMatches.reduce((sum, match) => {
    const years = parseInt(match.match(/\d+/)?.[0] || '0');
    return sum + years;
  }, 0);

  // Check for seniority level indicators
  let seniorityScore = 30;
  if (experienceKeywords.senior.some(keyword => normalized.includes(keyword))) {
    seniorityScore = 90;
  } else if (experienceKeywords.mid.some(keyword => normalized.includes(keyword))) {
    seniorityScore = 70;
  } else if (experienceKeywords.junior.some(keyword => normalized.includes(keyword))) {
    seniorityScore = 50;
  }

  // Check for relevant domain experience
  const domainRelevance = jobNormalized.split(' ').filter(word =>
    word.length > 3 && normalized.includes(word)
  ).length;

  const baseScore = Math.min(totalYears * 10, 50);
  const relevanceBonus = Math.min(domainRelevance * 2, 30);
  const score = Math.min(baseScore + seniorityScore + relevanceBonus, 100);

  const details = [
    `Total experience: ${totalYears} years mentioned`,
    `Seniority level score: ${seniorityScore}/100`,
    `Domain relevance score: ${relevanceBonus}/30`
  ];

  const recommendations = [];
  if (score < 70) {
    recommendations.push('Quantify your years of experience more clearly');
    recommendations.push('Highlight relevant domain experience');
  }
  if (totalYears === 0) {
    recommendations.push('Include specific timeframes for your work experience');
  }

  return { score: Math.max(score, 20), details, recommendations };
}

function calculateEducationScore(resumeText: string, jobDescription: string): {
  score: number;
  details: string[];
  recommendations: string[];
} {
  const normalized = normalizeText(resumeText);
  const jobNormalized = normalizeText(jobDescription);
  
  let highestDegree = '';
  let educationScore = 0;

  // Check for education levels
  Object.entries(educationLevels).forEach(([degree, score]) => {
    if (normalized.includes(degree)) {
      if (score > educationScore) {
        educationScore = score;
        highestDegree = degree;
      }
    }
  });

  // Check if job requires specific education
  const jobRequiresEducation = Object.keys(educationLevels).some(degree =>
    jobNormalized.includes(degree)
  );

  // Field relevance check
  const relevantFields = [
    'computer science', 'engineering', 'business', 'management',
    'information technology', 'data science', 'mathematics'
  ];
  
  const hasRelevantField = relevantFields.some(field =>
    normalized.includes(field) && jobNormalized.includes(field)
  );

  let finalScore = educationScore;
  if (hasRelevantField) {
    finalScore = Math.min(finalScore * 1.2, 100);
  }

  if (!jobRequiresEducation && educationScore === 0) {
    finalScore = 70; // Neutral score when education isn't required
  }

  const details = [
    highestDegree ? `Highest degree: ${highestDegree}` : 'No degree mentioned',
    `Education requirement in job: ${jobRequiresEducation ? 'Yes' : 'No'}`,
    `Field relevance: ${hasRelevantField ? 'Yes' : 'No'}`
  ];

  const recommendations = [];
  if (finalScore < 60) {
    recommendations.push('Include your educational background and certifications');
    recommendations.push('Highlight relevant coursework or training');
  }
  if (jobRequiresEducation && educationScore === 0) {
    recommendations.push('Consider adding any relevant educational qualifications');
  }

  return { score: Math.max(finalScore, 10), details, recommendations };
}

function calculateFormatScore(resumeText: string): {
  score: number;
  details: string[];
  recommendations: string[];
} {
  let formatScore = 0;
  const issues = [];
  const strengths = [];

  // Check for proper sections
  const sections = ['experience', 'education', 'skills', 'summary', 'objective'];
  const foundSections = sections.filter(section =>
    normalizeText(resumeText).includes(section)
  );
  
  if (foundSections.length >= 3) {
    formatScore += 30;
    strengths.push(`Good section structure (${foundSections.length} sections found)`);
  } else {
    issues.push('Missing key resume sections');
  }

  // Check for contact information
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phonePattern = /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/;
  
  if (emailPattern.test(resumeText) && phonePattern.test(resumeText)) {
    formatScore += 25;
    strengths.push('Contact information present');
  } else {
    issues.push('Missing or incomplete contact information');
  }

  // Check for consistent formatting indicators
  const bulletPoints = (resumeText.match(/•|▪|‣|\*/g) || []).length;
  const numberedLists = (resumeText.match(/^\d+\./gm) || []).length;
  
  if (bulletPoints > 3 || numberedLists > 2) {
    formatScore += 20;
    strengths.push('Good use of bullet points and lists');
  } else {
    issues.push('Consider using more bullet points for better readability');
  }

  // Check text length (not too short, not too long)
  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount >= 200 && wordCount <= 800) {
    formatScore += 25;
    strengths.push('Appropriate resume length');
  } else if (wordCount < 200) {
    issues.push('Resume appears too short - add more detail');
  } else {
    issues.push('Resume may be too long - consider condensing');
  }

  const details = [
    ...strengths,
    ...issues.map(issue => `Issue: ${issue}`)
  ];

  const recommendations = [];
  if (formatScore < 70) {
    recommendations.push('Improve resume formatting and structure');
    recommendations.push('Use consistent formatting throughout');
  }
  if (issues.length > 0) {
    recommendations.push('Address formatting issues identified above');
  }

  return { score: Math.max(formatScore, 10), details, recommendations };
}

export function calculateATSScore(resumeText: string, jobDescription: string): ATSAnalysisResult {
  const keywordAnalysis = calculateKeywordScore(resumeText, jobDescription);
  const skillsAnalysis = calculateSkillsScore(resumeText, jobDescription);
  const experienceAnalysis = calculateExperienceScore(resumeText, jobDescription);
  const educationAnalysis = calculateEducationScore(resumeText, jobDescription);
  const formatAnalysis = calculateFormatScore(resumeText);

  // Calculate weighted overall score
  const overallScore = Math.round(
    keywordAnalysis.score * 0.30 +
    skillsAnalysis.score * 0.25 +
    experienceAnalysis.score * 0.25 +
    educationAnalysis.score * 0.10 +
    formatAnalysis.score * 0.10
  );

  const breakdown: ATSScoreBreakdown = {
    keywords: keywordAnalysis,
    skills: skillsAnalysis,
    experience: experienceAnalysis,
    education: educationAnalysis,
    format: formatAnalysis,
    overall: overallScore
  };

  // Generate comprehensive recommendations
  const allRecommendations = [
    ...keywordAnalysis.recommendations,
    ...skillsAnalysis.recommendations,
    ...experienceAnalysis.recommendations,
    ...educationAnalysis.recommendations,
    ...formatAnalysis.recommendations
  ];

  // Identify strengths and weaknesses
  const strengths = [];
  const weaknesses = [];

  if (keywordAnalysis.score >= 70) strengths.push('Strong keyword optimization');
  else weaknesses.push('Keyword optimization needs improvement');

  if (skillsAnalysis.score >= 70) strengths.push('Good skills alignment');
  else weaknesses.push('Skills alignment could be better');

  if (experienceAnalysis.score >= 70) strengths.push('Relevant experience highlighted');
  else weaknesses.push('Experience section needs enhancement');

  if (educationAnalysis.score >= 70) strengths.push('Education requirements met');
  else weaknesses.push('Educational background could be strengthened');

  if (formatAnalysis.score >= 70) strengths.push('ATS-friendly formatting');
  else weaknesses.push('Format optimization needed');

  return {
    score: overallScore,
    breakdown,
    recommendations: Array.from(new Set(allRecommendations)),
    strengths,
    weaknesses
  };
}

export function generateRecommendations(analysisResult: ATSAnalysisResult): string[] {
  const { score, breakdown } = analysisResult;
  const recommendations = [...analysisResult.recommendations];

  // Add score-based recommendations
  if (score < 50) {
    recommendations.unshift('URGENT: Your resume needs significant improvements to pass ATS screening');
    recommendations.push('Consider professional resume review or rewriting');
  } else if (score < 70) {
    recommendations.unshift('Your resume needs moderate improvements for better ATS compatibility');
    recommendations.push('Focus on the lowest-scoring categories first');
  } else if (score < 85) {
    recommendations.unshift('Good foundation - fine-tune for optimal ATS performance');
  } else {
    recommendations.unshift('Excellent ATS compatibility - minor optimizations possible');
  }

  // Add priority-based recommendations
  const categoryScores = [
    { name: 'keywords', score: breakdown.keywords.score },
    { name: 'skills', score: breakdown.skills.score },
    { name: 'experience', score: breakdown.experience.score },
    { name: 'education', score: breakdown.education.score },
    { name: 'format', score: breakdown.format.score }
  ];

  const lowestCategory = categoryScores.reduce((min, category) =>
    category.score < min.score ? category : min
  );

  if (lowestCategory.score < 60) {
    recommendations.push(`PRIORITY: Focus on improving your ${lowestCategory.name} section first`);
  }

  return Array.from(new Set(recommendations));
}
