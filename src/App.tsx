import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ArrowRight, 
  Users, 
  Target, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  Star,
  Phone,
  Mail,
  MapPin,
  Send,
  Briefcase,
  BookOpen,
  MessageSquare,
  Waves,
  ChevronLeft,
  ChevronRight,
  FileText,
  Upload
} from 'lucide-react';
import { get_JobRecommendations } from './utils/resumeParser';
import ResumeUploadModal from './components/ResumeUploadModal';
import JobRecommendations from './components/JobRecommendations';
import ResumeUploadSuccess from './components/ResumeUploadSuccess';

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
  const [isProcessingResume, setIsProcessingResume] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [jobRecommendations, setJobRecommendations] = useState(sampleJobs);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [analysis, setAnalysis] = useState(sampleAnalysis);

  // Log initial state
  console.log('App initialized with states:', {
    isResumeUploaded,
    isProcessingResume,
    showSuccessScreen,
    showResumeModal,
    jobRecommendationsCount: jobRecommendations.length
  });

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

  const services = [
    {
      icon: Briefcase,
      title: "Career Coaching",
      description: "Personalized one-on-one coaching sessions to help you identify your strengths, set career goals, and develop actionable strategies for professional success.",
      features: ["Goal Setting", "Skills Assessment", "Action Planning", "Progress Tracking"]
    },
    {
      icon: BookOpen,
      title: "Resume & LinkedIn Optimization",
      description: "Professional resume writing and LinkedIn profile optimization to make you stand out to recruiters and hiring managers in your industry.",
      features: ["ATS-Optimized Resumes", "LinkedIn Makeover", "Cover Letter Writing", "Portfolio Development"]
    },
    {
      icon: MessageSquare,
      title: "Interview Preparation",
      description: "Comprehensive interview coaching including mock interviews, behavioral question preparation, and industry-specific interview strategies.",
      features: ["Mock Interviews", "Question Bank", "Body Language Training", "Salary Negotiation"]
    },
    {
      title: "Career Transition Support",
      description: "Navigate career changes with confidence through strategic planning, skill gap analysis, and industry transition strategies.",
      features: ["Industry Research", "Skill Development", "Network Building", "Transition Timeline"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      company: "TechCorp",
      content: "Career helped me transition from retail to tech marketing. Their guidance was invaluable in landing my dream job with a 40% salary increase.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      company: "InnovateLabs",
      content: "The interview prep sessions were game-changing. I went from nervous candidate to confident professional, securing offers from 3 top companies.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Operations Director",
      company: "Global Dynamics",
      content: "Their career coaching helped me identify my leadership potential and develop the skills needed to advance to a director-level position.",
      rating: 5
    }
  ];

  const stats = [
    { number: "2,500+", label: "Careers Transformed" },
    { number: "95%", label: "Success Rate" },
    { number: "150+", label: "Industry Partners" },
    { number: "4.9", label: "Client Rating" }
  ];

  const handleResumeUpload = async (file: File) => {
    console.log('=== Starting Resume Upload ===');
    setIsProcessingResume(true);
    
    try {
      // Get job recommendations based on the uploaded resume
      const recommendations = await get_JobRecommendations(file);
      console.log('Job recommendations:', recommendations);
      
      // Update state with recommendations
      setJobRecommendations(recommendations);
      setIsResumeUploaded(true);
      setShowSuccessScreen(true);
      setShowResumeModal(false);
      
      console.log('=== Resume Upload Complete ===');
    } catch (error) {
      console.error('Error processing resume:', error);
    } finally {
      setIsProcessingResume(false);
    }
  };

  const handleViewJobs = () => {
    setShowSuccessScreen(false);
  };

  const handleStartJourney = () => {
    setShowResumeModal(true);
  };

  const handleReset = () => {
    setIsResumeUploaded(false);
    setShowSuccessScreen(false);
    setJobRecommendations(sampleJobs);
  };

  // Debug logging for state changes
  useEffect(() => {
    console.log('State updated:', {
      isResumeUploaded,
      showSuccessScreen,
      isModalOpen,
      jobRecommendationsCount: jobRecommendations.length
    });
  }, [isResumeUploaded, showSuccessScreen, isModalOpen, jobRecommendations]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">CareerWise</h1>
            <button
              onClick={() => setShowResumeModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </header>

      <main>
        {showSuccessScreen ? (
          <ResumeUploadSuccess onViewJobs={() => setShowSuccessScreen(false)} />
        ) : (
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Transform Your Career Journey
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Upload your resume and discover job opportunities that match your skills and experience.
              </p>
            </div>

            {/* Services Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {services.map((service, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-indigo-600 mb-4">
                    <service.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Testimonials Section */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Success Stories</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                      </div>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{testimonial.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Recommendations Section */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Your Job Matches</h3>
              <JobRecommendations jobs={jobRecommendations} isLoading={isProcessingResume} />
            </div>
          </div>
        )}
      </main>

      {showResumeModal && (
        <ResumeUploadModal
          isOpen={showResumeModal}
          onClose={() => setShowResumeModal(false)}
          onUpload={handleResumeUpload}
          isProcessing={isProcessingResume}
        />
      )}
    </div>
  );
}

export default App;