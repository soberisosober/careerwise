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

// Function to extract text from PDF (simulated for now)
export const extractTextFromPDF = async (file: File): Promise<string> => {
  // TODO: Implement actual PDF text extraction
  // For now, return a simulated resume text
  return `
    John Doe
    Software Engineer
    
    Skills:
    - JavaScript
    - TypeScript
    - React
    - Node.js
    - Python
    - SQL
    - Git
    - AWS
    
    Experience:
    Senior Software Engineer at TechCorp (2018-2023)
    - Led development of microservices architecture
    - Implemented CI/CD pipelines
    - Mentored junior developers
    
    Software Engineer at StartupX (2015-2018)
    - Developed full-stack web applications
    - Optimized database queries
    - Implemented REST APIs
  `;
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

// Function to get job recommendations based on resume
export const get_JobRecommendations = async (file: File) => {
  try {
    console.log('Starting job recommendations process...');
    
    // Extract text from resume
    const resumeText = await extractTextFromPDF(file);
    console.log('Resume text extracted');
    
    // Extract skills from resume
    const resumeSkills = extractSkills(resumeText);
    console.log('Extracted skills:', resumeSkills);
    
    // Calculate match scores and get recommendations
    const jobRecommendations = jobListings.map(job => {
      const matchScore = calculateJobMatch(resumeSkills, job.skills);
      const matchingSkills = resumeSkills.filter(skill => job.skills.includes(skill));
      
      console.log(`Job: ${job.title}, Match Score: ${matchScore}, Matching Skills: ${matchingSkills.length}`);
      
      return {
        ...job,
        matchScore,
        matchingSkills
      };
    });
    
    // Sort by match score and filter out low matches
    const filteredRecommendations = jobRecommendations
      .filter(job => job.matchScore >= 30)
      .sort((a, b) => b.matchScore - a.matchScore);
    
    console.log(`Found ${filteredRecommendations.length} matching jobs`);
    return filteredRecommendations;
      
  } catch (error) {
    console.error('Error in job recommendations process:', error);
    throw error;
  }
}; 