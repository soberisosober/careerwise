import { Buffer } from 'buffer';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import Tesseract from 'tesseract.js';

// Initialize PDF.js worker
let isWorkerInitialized = false;

async function initializePdfWorker() {
  if (isWorkerInitialized) return;
  
  const workerBlob = new Blob(
    [await (await fetch('https://unpkg.com/pdfjs-dist@3.11.174/legacy/build/pdf.worker.js')).text()],
    { type: 'application/javascript' }
  );
  const blobUrl = URL.createObjectURL(workerBlob);
  pdfjsLib.GlobalWorkerOptions.workerSrc = blobUrl;
  isWorkerInitialized = true;
}

// Type for job skills mapping
type JobSkillsMap = {
  'Data Analyst': string[];
  'Software Engineer': string[];
  'Marketing Manager': string[];
  'Product Manager': string[];
  'UX Designer': string[];
};

// Utility to normalize keywords for matching (lowercase, trim)
const normalizeKeywords = (keywords: string[]): string[] =>
  keywords.map((kw) => kw.toLowerCase().trim());

// Helper function to correctly map job titles to jobSkills keys
function getJobTypeFromTitle(title: string): keyof JobSkillsMap | null {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('data analyst')) return 'Data Analyst';
  if (lowerTitle.includes('software engineer')) return 'Software Engineer';
  if (lowerTitle.includes('marketing manager')) return 'Marketing Manager';
  if (lowerTitle.includes('product manager')) return 'Product Manager';
  if (lowerTitle.includes('ux designer')) return 'UX Designer';
  return null;
}

// Common skills for different job roles
export const jobSkills = {
  'Data Analyst': [
    'SQL',
    'Python',
    'R',
    'Excel',
    'Tableau',
    'Power BI',
    'Data Visualization',
    'Statistical Analysis',
    'Data Mining',
    'Machine Learning',
    'Data Cleaning',
    'ETL',
    'Business Intelligence',
    'Data Warehousing',
    'Big Data'
  ],
  'Software Engineer': [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'C++',
    'SQL',
    'Git',
    'AWS',
    'Docker',
    'Kubernetes',
    'CI/CD',
    'System Design',
    'Algorithms',
    'Data Structures',
    'REST APIs',
    'GraphQL',
    'Microservices'
  ],
  'Marketing Manager': [
    'Digital Marketing',
    'Social Media',
    'Content Strategy',
    'SEO',
    'SEM',
    'Google Analytics',
    'Email Marketing',
    'Campaign Management',
    'Brand Management',
    'Market Research',
    'Project Management',
    'Budget Management',
    'Team Leadership',
    'CRM',
    'Marketing Automation'
  ],
  'Product Manager': [
    'Product Strategy',
    'Agile',
    'Scrum',
    'User Research',
    'UX/UI',
    'Market Analysis',
    'Roadmapping',
    'Data Analysis',
    'A/B Testing',
    'Stakeholder Management',
    'Product Development',
    'JIRA',
    'Product Analytics',
    'Customer Development',
    'Go-to-Market Strategy'
  ],
  'UX Designer': [
    'User Research',
    'Wireframing',
    'Prototyping',
    'Figma',
    'Adobe XD',
    'Sketch',
    'UI Design',
    'Interaction Design',
    'Information Architecture',
    'Usability Testing',
    'Design Systems',
    'Accessibility',
    'User Flows',
    'Visual Design',
    'Design Thinking'
  ]
};

// Sample job listings with detailed requirements
export const jobListings = [
  {
    id: '1',
    title: 'Senior Data Analyst',
    company: 'DataTech Solutions',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'We are seeking a Senior Data Analyst to join our growing data team. You will be responsible for analyzing complex datasets, creating insightful visualizations, and driving data-informed decisions across the organization.',
    requirements: [
      '5+ years of experience in data analysis',
      'Strong proficiency in SQL and Python',
      'Experience with data visualization tools (Tableau, Power BI)',
      'Knowledge of statistical analysis and machine learning',
      'Excellent communication and presentation skills'
    ],
    skills: jobSkills['Data Analyst']
  },
  {
    id: '2',
    title: 'Full Stack Software Engineer',
    company: 'TechInnovate',
    location: 'Remote',
    type: 'Full-time',
    description: 'Join our engineering team to build scalable web applications. You will work on both frontend and backend development, implementing new features and improving existing systems.',
    requirements: [
      '4+ years of experience in software development',
      'Strong knowledge of JavaScript/TypeScript and React',
      'Experience with Node.js and REST APIs',
      'Familiarity with cloud platforms (AWS/GCP)',
      'Understanding of database design and optimization'
    ],
    skills: jobSkills['Software Engineer']
  },
  {
    id: '3',
    title: 'Digital Marketing Manager',
    company: 'GrowthMasters',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Lead our digital marketing initiatives and drive customer acquisition through various channels. You will develop and execute marketing strategies, manage campaigns, and analyze performance metrics.',
    requirements: [
      '5+ years of experience in digital marketing',
      'Strong knowledge of SEO, SEM, and social media marketing',
      'Experience with marketing automation tools',
      'Analytical mindset with data-driven decision making',
      'Excellent project management skills'
    ],
    skills: jobSkills['Marketing Manager']
  },
  {
    id: '4',
    title: 'Product Manager',
    company: 'ProductLabs',
    location: 'Seattle, WA',
    type: 'Full-time',
    description: 'Drive product strategy and execution for our enterprise software solutions. You will work closely with engineering, design, and business teams to deliver exceptional products.',
    requirements: [
      '4+ years of product management experience',
      'Strong analytical and problem-solving skills',
      'Experience with agile methodologies',
      'Excellent communication and leadership abilities',
      'Technical background or understanding'
    ],
    skills: jobSkills['Product Manager']
  },
  {
    id: '5',
    title: 'Senior UX Designer',
    company: 'DesignFirst',
    location: 'Austin, TX',
    type: 'Full-time',
    description: 'Create intuitive and engaging user experiences for our digital products. You will lead the design process from research to implementation, working closely with product and engineering teams.',
    requirements: [
      '5+ years of UX/UI design experience',
      'Strong portfolio demonstrating user-centered design',
      'Proficiency in Figma and other design tools',
      'Experience with user research and testing',
      'Knowledge of design systems and accessibility'
    ],
    skills: jobSkills['UX Designer']
  }
];

export const extractTextFromPDF = async (file: File): Promise<string> => {
  await initializePdfWorker();
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
};

// Function to extract skills from resume text
export const extractSkills = (text: string): string[] => {
  const extractedSkills = new Set<string>();
  
  // Convert text to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();
  
  // Check for each skill in all job categories
  Object.values(jobSkills).forEach(skillList => {
    skillList.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        extractedSkills.add(skill);
      }
    });
  });
  
  return Array.from(extractedSkills);
};

// Function to calculate job match score
export const calculateJobMatch = (resumeSkills: string[], jobSkills: string[]): number => {
  const matchingSkills = resumeSkills.filter(skill => 
    jobSkills.includes(skill)
  );
  
  // Calculate base score from matching skills
  const baseScore = Math.round((matchingSkills.length / jobSkills.length) * 100);
  
  // Add bonus for having more matching skills
  const bonusScore = Math.min(matchingSkills.length * 5, 20);
  
  return Math.min(baseScore + bonusScore, 100);
};

// Function to filter jobs based on keyword prompt
function filterJobsByPrompt(jobs: typeof jobListings, prompt?: string) {
  if (!prompt) return jobs;
  
  const searchTerm = prompt.toLowerCase().trim();
  
  return jobs.filter(job => {
    const jobTitle = job.title.toLowerCase();
    const companyName = job.company.toLowerCase();
    const jobType = getJobTypeFromTitle(job.title)?.toLowerCase() || '';
    
    return jobTitle.includes(searchTerm) || 
           companyName.includes(searchTerm) || 
           jobType.includes(searchTerm);
  });
}

// Function to find jobs matching extracted resume keywords
function findMatchingJobs(resumeKeywords: string[], prompt?: string) {
  const normalizedResumeKeywords = normalizeKeywords(resumeKeywords);

  // Map jobListings to include their skills correctly
  const jobsWithSkills = jobListings.map(job => {
    const jobType = getJobTypeFromTitle(job.title);
    return {
      ...job,
      skills: jobType ? jobSkills[jobType] : []
    };
  });

  // Filter jobs by prompt first
  const filteredJobs = filterJobsByPrompt(jobsWithSkills, prompt);

  // Find jobs with matching skills
  return filteredJobs.filter(job => {
    const jobSkillsNormalized = normalizeKeywords(job.skills);
    return jobSkillsNormalized.some(skill =>
      normalizedResumeKeywords.some(keyword =>
        skill.includes(keyword) || keyword.includes(skill)
      )
    );
  });
}

// Function to find jobs with match scores
function findMatchingJobsWithScore(resumeKeywords: string[], prompt?: string) {
  const normalizedResumeKeywords = normalizeKeywords(resumeKeywords);

  // Map jobListings to include their skills correctly
  const jobsWithSkills = jobListings.map(job => {
    const jobType = getJobTypeFromTitle(job.title);
    return {
      ...job,
      skills: jobType ? jobSkills[jobType] : []
    };
  });

  // Filter jobs by prompt first
  const filteredJobs = filterJobsByPrompt(jobsWithSkills, prompt);

  // Calculate match scores for filtered jobs
  return filteredJobs.map(job => {
    const jobSkillsNormalized = normalizeKeywords(job.skills);
    const matchingSkills = jobSkillsNormalized.filter(skill =>
      normalizedResumeKeywords.some(keyword =>
        skill.includes(keyword) || keyword.includes(skill)
      )
    );

    const matchScore = Math.round((matchingSkills.length / jobSkillsNormalized.length) * 100);

    return {
      ...job,
      matchScore,
      matchingSkills
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

export const get_JobRecommendations = async (file: File, prompt?: string) => {
  try {
    console.log('Starting job recommendations process...');
    const text = await extractTextFromPDF(file);
    console.log('Text extracted from PDF');
    
    const skills = extractSkills(text);
    console.log('Skills extracted:', skills);
    
    const matchingJobs = findMatchingJobsWithScore(skills, prompt);
    console.log('Found matching jobs:', matchingJobs.length);
    
    return matchingJobs;
  } catch (error) {
    console.error('Error in get_JobRecommendations:', error);
    throw new Error('Failed to process resume: ' + (error as Error).message);
  }
}; 