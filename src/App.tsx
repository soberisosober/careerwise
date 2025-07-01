import * as React from 'react';
const { useState, useEffect, useRef } = React;
import { 
  Bars3Icon,
  XMarkIcon,
  ArrowRightIcon,
  UsersIcon,
  TagIcon,
  ChartBarIcon,
  TrophyIcon,
  CheckCircleIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  BriefcaseIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  SwatchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { get_JobRecommendations } from './utils/resumeParser';
import JobRecommendations from './components/JobRecommendations';
import ImageWithPlaceholder from './components/ImageWithPlaceholder';
import { supabase } from './supabaseClient';
import ATSScoringModal from './components/ATSScoringModal';
import ATSResults from './components/ATSResults';
import ATSScoreBreakdownComponent from './components/ATSScoreBreakdown';
import { calculateATSScore, generateRecommendations, ATSAnalysisResult } from './utils/atsScoring';

// Sample analysis data
const sampleAnalysis = {
  experience: "5+ years",
  education: "Bachelor's in Computer Science",
  skills: [
    "JavaScript", "React", "TypeScript", "Node.js", "Python",
    "SQL", "AWS", "Docker", "Git", "REST APIs"
  ],
  jobProfiles: [
    {
      title: "Senior Software Engineer",
      match: 95,
      description: "Lead the development of scalable web applications using modern technologies.",
      requirements: ["JavaScript", "React", "TypeScript", "Node.js", "AWS"],
      salaryRange: "$120,000 - $160,000",
      companies: ["TechCorp", "InnovateSoft", "Digital Solutions"]
    },
    {
      title: "Full Stack Developer",
      match: 85,
      description: "Build and maintain full-stack applications with a focus on user experience.",
      requirements: ["JavaScript", "React", "Python", "SQL", "REST APIs"],
      salaryRange: "$100,000 - $140,000",
      companies: ["WebTech", "CodeMasters", "DevHouse"]
    },
    {
      title: "Backend Engineer",
      match: 75,
      description: "Design and implement robust backend systems and APIs.",
      requirements: ["Node.js", "Python", "SQL", "AWS", "Docker"],
      salaryRange: "$90,000 - $130,000",
      companies: ["ServerPro", "CloudTech", "DataFlow"]
    }
  ]
};

// Sample job data
const sampleJobs = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    matchScore: 95,
    description: 'Lead the development of scalable web applications using modern technologies.',
    requirements: [
      '5+ years of software development experience',
      'Strong proficiency in JavaScript and React',
      'Experience with cloud platforms (AWS)',
      'Knowledge of system design and architecture'
    ],
    matchingSkills: ['JavaScript', 'React', 'AWS', 'System Design']
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'WebTech',
    location: 'Remote',
    type: 'Full-time',
    matchScore: 85,
    description: 'Build and maintain full-stack applications with a focus on user experience.',
    requirements: [
      '3+ years of full-stack development',
      'Experience with React and Node.js',
      'Knowledge of database design',
      'Strong problem-solving skills'
    ],
    matchingSkills: ['React', 'Node.js', 'Database Design']
  },
  {
    id: '3',
    title: 'Backend Engineer',
    company: 'ServerPro',
    location: 'New York, NY',
    type: 'Full-time',
    matchScore: 75,
    description: 'Design and implement robust backend systems and APIs.',
    requirements: [
      '4+ years of backend development',
      'Strong Python and SQL skills',
      'Experience with microservices',
      'Knowledge of cloud platforms'
    ],
    matchingSkills: ['Python', 'SQL', 'Microservices']
  }
];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [jobRecommendations, setJobRecommendations] = useState(sampleJobs);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [analysis, setAnalysis] = useState(sampleAnalysis);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [hoveredSection, setHoveredSection] = useState<'companies' | 'candidates' | null>(null);
  const [statsPaused, setStatsPaused] = useState(false);
  const [ragTilt, setRagTilt] = useState({ x: 0, y: 0, hovering: false });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showATSModal, setShowATSModal] = useState(false);
  const [atsResults, setATSResults] = useState<ATSAnalysisResult | null>(null);
  const [showATSResults, setShowATSResults] = useState(false);

  const processingSteps = [
    { text: "Uploading File", duration: 1000 },
    { text: "Decrypting", duration: 1500 },
    { text: "Extracting Information", duration: 2000 },
    { text: "Filtering Jobs", duration: 1500 }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const jobListings = [
    {
      title: "VP Demand Generation",
      company: "Usercentrics",
      status: "Hired",
      type: "Proofpoint"
    },
    {
      title: "Key Account Manager", 
      company: "Klarx",
      status: "Hired",
      type: ""
    },
    {
      title: "VP of Engineering",
      company: "Usercentrics", 
      status: "Hired",
      type: ""
    },
    {
      title: "Senior Product Manager",
      company: "TechFlow",
      status: "Hired",
      type: "Remote"
    }
  ];

  // Auto-scroll through job listings
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % jobListings.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [jobListings.length]);

  interface Service {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    features: string[];
  }

  const services: Service[] = [
    {
      icon: BriefcaseIcon,
      title: "Career Coaching",
      description: "Personalized one-on-one coaching sessions to help you identify your strengths, set career goals, and develop actionable strategies for professional success.",
      features: ["Goal Setting", "Skills Assessment", "Action Planning", "Progress Tracking"]
    },
    {
      icon: BookOpenIcon,
      title: "Resume & LinkedIn Optimization",
      description: "Professional resume writing and LinkedIn profile optimization to showcase your skills and experience effectively.",
      features: ["ATS Optimization", "Keyword Research", "Profile Enhancement", "Industry Standards"]
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Interview Preparation",
      description: "Comprehensive interview preparation including mock interviews, feedback, and strategies for different interview types.",
      features: ["Mock Interviews", "Behavioral Questions", "Technical Interviews", "Salary Negotiation"]
    },
    {
      icon: SwatchIcon,
      title: "Career Transition Support",
      description: "Guidance and support for career changes, including industry research, skill development, and networking strategies.",
      features: ["Industry Analysis", "Skill Mapping", "Network Building", "Transition Planning"]
    }
  ];

  const stats = [
    { number: "10000+", label: "Resume Trained" },
    { number: "80%", label: "Threshold of Similarities" },
    { number: "150+", label: "Parameters" },
    { number: "Py", label: "PySyft for GDPR" }
  ];

  const handleStartJourney = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsProcessing(true);
      setProcessingStep(0);
      setProcessingProgress(0);
      
      // Simulate processing steps
      for (let i = 0; i < processingSteps.length; i++) {
        setProcessingStep(i);
        const step = processingSteps[i];
        const progressIncrement = 100 / processingSteps.length;
        
        // Simulate progress within each step
        const interval = setInterval(() => {
          setProcessingProgress(prev => {
            const newProgress = prev + (progressIncrement / 10);
            return newProgress > (i + 1) * progressIncrement ? (i + 1) * progressIncrement : newProgress;
          });
        }, step.duration / 10);

        await new Promise(resolve => setTimeout(resolve, step.duration));
        clearInterval(interval);
      }

      // Process the actual file
      try {
        const recommendations = await get_JobRecommendations(file, '');
        setJobRecommendations(recommendations);
        setIsResumeUploaded(true);
        setShowResultsModal(true);
      } catch (error) {
        console.error('Error processing resume:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleRagMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ragTilt.hovering) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRagTilt({ x: x * 20, y: y * 20, hovering: true });
  };

  const handleRagMouseLeave = () => setRagTilt({ x: 0, y: 0, hovering: false });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      setShowAuthModal(false);
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  const handleATSScoring = (resumeText: string, jobDescription: string) => {
    try {
      const analysisResult = calculateATSScore(resumeText, jobDescription);
      setATSResults(analysisResult);
      setShowATSModal(false);
      setShowATSResults(true);
    } catch (error) {
      console.error('Error calculating ATS score:', error);
    }
  };

  const handleATSRetest = () => {
    setShowATSResults(false);
    setATSResults(null);
    setShowATSModal(true);
  };

  const handleCloseATSResults = () => {
    setShowATSResults(false);
    setATSResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-columbia_blue-600 to-columbia_blue-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-white">CareerWise</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#home" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium transition-colors">Home</a>
                <a href="#services" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium transition-colors">Services</a>
                <a href="#about" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium transition-colors">About</a>
                <button
                  onClick={() => setShowATSModal(true)}
                  className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium transition-colors"
                >
                  ATS Score
                </button>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-white text-black px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:text-gray-300 focus:outline-none"
              >
                {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black border-t border-gray-800">
              <a href="#home" className="text-white block px-3 py-2 text-base font-medium">Home</a>
              <a href="#services" className="text-white hover:text-gray-300 block px-3 py-2 text-base font-medium">Services</a>
              <a href="#about" className="text-white hover:text-gray-300 block px-3 py-2 text-base font-medium">About</a>
              <button
                onClick={() => setShowATSModal(true)}
                className="text-white hover:text-gray-300 block px-3 py-2 text-base font-medium"
              >
                ATS Score
              </button>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-white text-black block px-3 py-2 rounded-xl text-base font-medium mx-3 mt-4"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{isSignUp ? 'Sign Up' : 'Login'}</h2>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
              {authError && <p className="text-red-500 text-sm">{authError}</p>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                {isSignUp ? 'Sign Up' : 'Login'}
              </button>
            </form>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="mt-4 text-blue-600 hover:text-blue-800 transition-colors"
            >
              {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
            </button>
            <button
              onClick={() => setShowAuthModal(false)}
              className="mt-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen bg-yellow-400 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full items-center">
            {/* Left Content */}
            <div className="lg:col-span-2 text-left py-20">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black leading-tight mb-8">
                CareerWise links<br />
                you to your next big<br />
                <span className="block">career opportunity.</span>
              </h1>
              <p className="text-xl text-black mb-8 max-w-2xl">
                Explore the latest roles in data, engineering, product, and beyond.
              </p>
              {!isResumeUploaded && !showResumeModal && (
                <div className="flex justify-center space-x-4 mt-16">
                  <button
                    onClick={handleStartJourney}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center"
                  >
                    Analyze Resume
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowATSModal(true)}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center"
                  >
                    Check ATS Score
                    <ChartBarIcon className="ml-2 h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
            {/* Right Panel - Scrolling Job Listings */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-2xl p-6 h-80 flex flex-col justify-center">
              <div className="space-y-6 transition-all duration-500 ease-in-out">
                {jobListings.map((job, index) => (
                  <div 
                    key={index} 
                    className={`transform transition-all duration-500 ${
                      index === currentIndex
                        ? 'opacity-100 translate-y-0'
                        : index === (currentIndex + 1) % jobListings.length
                        ? 'opacity-50 translate-y-4'
                        : 'opacity-0 translate-y-8 hidden'
                    }`}
                  >
                    {job.type && (
                      <div className="text-sm text-gray-500 mb-1">{job.type}</div>
                    )}
                    <h3 className="text-xl font-bold text-black mb-1">{job.title}</h3>
                    <p className="text-gray-600 mb-3">{job.company}</p>
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {job.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Progress indicators */}
              <div className="flex justify-center space-x-2 mt-6">
                {jobListings.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Hired Section - Full Width */}
      <section className="bg-black text-white py-16 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 lg:mb-0">Get Hired</h2>
          <button
            onClick={handleStartJourney}
            className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center group"
          >
            Start Your Journey
            <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 w-full overflow-x-hidden">
        <div
          className="relative w-full"
          onMouseEnter={() => setStatsPaused(true)}
          onMouseLeave={() => setStatsPaused(false)}
        >
          <div
            className={`flex gap-4 whitespace-nowrap w-[200%] ${statsPaused ? '' : 'animate-stats-scroll'}`}
            style={{ willChange: 'transform' }}
          >
            {stats.concat(stats).map((stat, index) => (
              <div key={index} className="text-center min-w-[160px]">
                <div className="text-xl lg:text-2xl font-bold text-white">{stat.number}</div>
                <div className="mt-1 text-blue-100 text-sm lg:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Custom Color Order */}
      <section id="services" className="py-0 w-full">
        <div className="relative w-full h-[416px] flex items-stretch">
          {/* Leftmost yellow blank space */}
          <div className="hidden md:block bg-yellow-300 h-full" style={{width: '6vw', minWidth: '40px'}} />
          {/* For Companies (black) */}
          <div
            className={
              `flex flex-col justify-between pl-12 pr-8 py-12 bg-black transition-all duration-500 ease-in-out relative cursor-pointer ${
                hoveredSection === 'companies' ? 'flex-[8] z-10' : hoveredSection === 'candidates' ? 'flex-[2] z-0' : 'flex-1 z-0'
              } h-[416px] border-b-4 md:border-b-0 md:border-r-4 border-yellow-300`
            }
            onMouseEnter={() => setHoveredSection('companies')}
            onMouseLeave={() => setHoveredSection(null)}
            tabIndex={0}
          >
            <h3 className={`text-4xl md:text-5xl font-bold text-white transition-opacity duration-500 ${hoveredSection === 'candidates' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{fontFamily: 'Inter, Helvetica, Arial, sans-serif'}}>For Companies</h3>
            <div className="flex-1" />
            <ul className={`space-y-1 transition-opacity duration-500 ${hoveredSection === 'candidates' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <li className="flex items-center text-white text-lg md:text-xl font-normal" style={{fontFamily: 'Inter, Helvetica, Arial, sans-serif'}}>
                <span className="inline-flex items-center justify-center w-6 h-6 mr-3 text-yellow-300">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><circle cx="12" cy="12" r="12" fill="#FFEB3B"/><path stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M7 13l3 3 7-7"/></svg>
                </span>
                Filtered Candidates based on algorithmic similarites.
              </li>
              <li className="flex items-center text-white text-lg md:text-xl font-normal" style={{fontFamily: 'Inter, Helvetica, Arial, sans-serif'}}>
                <span className="inline-flex items-center justify-center w-6 h-6 mr-3 text-yellow-300">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><circle cx="12" cy="12" r="12" fill="#FFEB3B"/><path stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M7 13l3 3 7-7"/></svg>
                </span>
                Captures underlying requirements for the role.
              </li>
              <li className="flex items-center text-white text-lg md:text-xl font-normal" style={{fontFamily: 'Inter, Helvetica, Arial, sans-serif'}}>
                <span className="inline-flex items-center justify-center w-6 h-6 mr-3 text-yellow-300">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><circle cx="12" cy="12" r="12" fill="#FFEB3B"/><path stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M7 13l3 3 7-7"/></svg>
                </span>
                Provides Automated Response. 
              </li>
            </ul>
          </div>
          {/* For Candidates (yellow) */}
          <div
            className={
              `flex flex-col justify-between pl-12 pr-8 py-12 bg-yellow-300 transition-all duration-500 ease-in-out relative cursor-pointer ${
                hoveredSection === 'candidates' ? 'flex-[8] z-10' : hoveredSection === 'companies' ? 'flex-[2] z-0' : 'flex-1 z-0'
              } h-[416px] border-b-4 md:border-b-0 md:border-l-4 border-black`
            }
            onMouseEnter={() => setHoveredSection('candidates')}
            onMouseLeave={() => setHoveredSection(null)}
            tabIndex={0}
          >
            <h3 className={`text-4xl md:text-5xl font-bold text-black transition-opacity duration-500 ${hoveredSection === 'companies' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{fontFamily: 'Inter, Helvetica, Arial, sans-serif'}}>For Candidates</h3>
            <div className="flex-1" />
            <ul className={`space-y-1 transition-opacity duration-500 ${hoveredSection === 'companies' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <li className="flex items-center text-black text-lg md:text-xl font-normal" style={{fontFamily: 'Inter, Helvetica, Arial, sans-serif'}}>
                <span className="inline-flex items-center justify-center w-6 h-6 mr-3 text-blue-600">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><circle cx="12" cy="12" r="12" fill="#fff"/><path stroke="#1976D2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M7 13l3 3 7-7"/></svg>
                </span>
                Security for Document Prevention
              </li>
              <li className="flex items-center text-black text-lg md:text-xl font-normal" style={{fontFamily: 'Inter, Helvetica, Arial, sans-serif'}}>
                <span className="inline-flex items-center justify-center w-6 h-6 mr-3 text-blue-600">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><circle cx="12" cy="12" r="12" fill="#fff"/><path stroke="#1976D2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M7 13l3 3 7-7"/></svg>
                </span>
                ATS Score Analysis & Optimization
              </li>
              <li className="flex items-center text-black text-lg md:text-xl font-normal" style={{fontFamily: 'Inter, Helvetica, Arial, sans-serif'}}>
                <span className="inline-flex items-center justify-center w-6 h-6 mr-3 text-blue-600">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><circle cx="12" cy="12" r="12" fill="#fff"/><path stroke="#1976D2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M7 13l3 3 7-7"/></svg>
                </span>
                Captures both syntactical and semantical structures.  
              </li>
            </ul>
          </div>
          {/* Rightmost black blank space */}
          <div className="hidden md:block bg-black h-full" style={{width: '6vw', minWidth: '40px'}} />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Career?
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Career uses a Retrieval-Augmented Generation (RAG) model to turn resumes into personalized job matches. It leverages vector embeddings, similarity scoring, and synthetic data alignment to recommend roles that truly fit.
              </p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 mt-1 select-none">
                    <span className="font-extrabold text-5xl text-black leading-none" style={{fontFamily: 'Comic Sans MS, Comic Sans, cursive'}}>1.</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Expert System Design</h4>
                    <p className="text-gray-600">Built on vector embeddings and semantic parsing, the system extracts hidden features from resumes to match with job data.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 mt-1 select-none">
                    <span className="font-extrabold text-5xl text-black leading-none" style={{fontFamily: 'Comic Sans MS, Comic Sans, cursive'}}>2.</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">AI-Driven Precision</h4>
                    <p className="text-gray-600">Job suggestions are powered by a custom RAG model, with accuracy boosted via privacy-preserving federated learning (PySyft).</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 mt-1 select-none">
                    <span className="font-extrabold text-5xl text-black leading-none" style={{fontFamily: 'Comic Sans MS, Comic Sans, cursive'}}>3.</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Smart Matching</h4>
                    <p className="text-gray-600">We combine cosine similarity, graph filters, and structured embeddings to surface jobs aligned with your domain and experience.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative"
              onMouseMove={handleRagMouseMove}
              onMouseLeave={handleRagMouseLeave}
            >
              <ImageWithPlaceholder
                src="/rag-token-count.png"
                alt="RAG Model Token Count (Cartoonish Style)"
                className="w-full h-96 object-contain rounded-3xl border-4 border-gray-200 shadow-lg bg-white transition-transform duration-300"
                style={{
                  transform: ragTilt.hovering
                    ? `perspective(900px) rotateY(${ragTilt.x * 18}deg) rotateX(${-ragTilt.y * 18}deg)`
                    : 'perspective(900px) rotateY(0deg) rotateX(0deg)',
                }}
                placeholderSrc="/rag-placeholder.png"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-gray-600">
              Get in touch with our expert team to start your journey today
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Get In Touch</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-xl mr-4">
                    <PhoneIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-600">+91 (700) 490-2320</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-xl mr-4">
                    <EnvelopeIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">eshansingh@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-xl mr-4">
                    <MapPinIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600">Akurdi, Pune</p>
                  </div>
                </div>
              </div>
              <div className="mt-12 p-6 bg-blue-50 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Attention</h4>
                <p className="text-gray-600">
                  These are not compliable to legal usecase, due to certain limitations.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Tell us about your career goals and how we can help..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center group"
                >
                  Send Message
                  <PaperAirplaneIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 mb-4">
                  <SwatchIcon className="h-8 w-8 text-white" />
                </div>
                <span className="ml-2 text-2xl font-bold">CareerWise</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering professionals to achieve their career goals through expert coaching,
                strategic planning, and personalized support.
              </p>
              <div className="flex space-x-4">
                <div className="bg-gray-800 p-2 rounded-xl hover:bg-gray-700 transition-colors cursor-pointer">
                  <PhoneIcon className="h-5 w-5" />
                </div>
                <div className="bg-gray-800 p-2 rounded-xl hover:bg-gray-700 transition-colors cursor-pointer">
                  <EnvelopeIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Career Coaching</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resume Writing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Interview Prep</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn Optimization</a></li>
                <li><a href="#" className="hover:text-white transition-colors" onClick={() => setShowATSModal(true)}>ATS Score Check</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Career. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />

      {/* Results Modal */}
      {showResultsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Job Matches</h2>
              <button
                onClick={() => setShowResultsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 space-y-4 pr-2">
              {jobRecommendations.map((job, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                      <p className="text-gray-500 text-sm">{job.location}</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-xl text-sm font-medium">
                      {job.matchScore}% Match
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Job Description</h4>
                      <p className="text-gray-600">{job.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {job.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Matching Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.matchingSkills.map((skill, i) => (
                          <span 
                            key={i}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-xl text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Processing Modal */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <ArrowPathIcon className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Resume</h2>
              <p className="text-gray-600">{processingSteps[processingStep].text}...</p>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-xl h-2.5 mb-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-xl transition-all duration-300 ease-in-out"
                style={{ width: `${processingProgress}%` }}
              ></div>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              {Math.round(processingProgress)}% Complete
            </div>
          </div>
        </div>
      )}

      {/* ATS Scoring Modal */}
      {showATSModal && (
        <ATSScoringModal
          isOpen={showATSModal}
          onClose={() => setShowATSModal(false)}
          onComplete={handleATSScoring}
        />
      )}

      {/* ATS Results Modal */}
      {showATSResults && atsResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
            <ATSResults
              results={atsResults}
              onRetest={handleATSRetest}
              onClose={handleCloseATSResults}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;