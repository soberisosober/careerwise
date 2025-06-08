import React, { useState, useEffect, useRef } from 'react';
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
  Upload,
  LucideIcon
} from 'lucide-react';
import { get_JobRecommendations } from './utils/resumeParser';
import JobRecommendations from './components/JobRecommendations';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    icon: LucideIcon;
    title: string;
    description: string;
    features: string[];
  }

  const services: Service[] = [
    {
      icon: Briefcase,
      title: "Career Coaching",
      description: "Personalized one-on-one coaching sessions to help you identify your strengths, set career goals, and develop actionable strategies for professional success.",
      features: ["Goal Setting", "Skills Assessment", "Action Planning", "Progress Tracking"]
    },
    {
      icon: BookOpen,
      title: "Resume & LinkedIn Optimization",
      description: "Professional resume writing and LinkedIn profile optimization to showcase your skills and experience effectively.",
      features: ["ATS Optimization", "Keyword Research", "Profile Enhancement", "Industry Standards"]
    },
    {
      icon: MessageSquare,
      title: "Interview Preparation",
      description: "Comprehensive interview preparation including mock interviews, feedback, and strategies for different interview types.",
      features: ["Mock Interviews", "Behavioral Questions", "Technical Interviews", "Salary Negotiation"]
    },
    {
      icon: Waves,
      title: "Career Transition Support",
      description: "Guidance and support for career changes, including industry research, skill development, and networking strategies.",
      features: ["Industry Analysis", "Skill Mapping", "Network Building", "Transition Planning"]
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

  const handleStartJourney = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingResume(true);
      try {
        const recommendations = await get_JobRecommendations(file);
        setJobRecommendations(recommendations);
        setIsResumeUploaded(true);
        setShowSuccessScreen(true);
      } catch (error) {
        console.error('Error processing resume:', error);
      } finally {
        setIsProcessingResume(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">CareerWise</h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-gray-600 hover:text-gray-900">Services</a>
            <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
            <button
              onClick={handleStartJourney}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Start Your Journey
            </button>
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-yellow-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Transform Your Career Journey
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get personalized career guidance, resume optimization, and job recommendations tailored to your skills and aspirations.
            </p>
            <button
              onClick={handleStartJourney}
              className="bg-yellow-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-yellow-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 text-yellow-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-yellow-500 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-yellow-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
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
      </section>

      {/* Job Recommendations Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Your Job Matches</h2>
          <JobRecommendations jobs={jobRecommendations} isLoading={isProcessingResume} />
        </div>
      </section>

      {/* Success Screen */}
      {showSuccessScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">Resume Analysis Complete!</h2>
            <p className="text-gray-600 mb-4">
              We've analyzed your resume and found some great job matches for you.
            </p>
            <button
              onClick={() => setShowSuccessScreen(false)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              View Job Matches
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;