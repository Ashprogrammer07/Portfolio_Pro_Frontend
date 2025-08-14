import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Enhanced data with better descriptions
  const roles = [
    "Full Stack Developer",
    "UI/UX Enthusiast", 
    "Backend Architect",
    "Cloud Engineer",
    "Problem Solver"
  ];
  
  const services = [
    {
      emoji: "🎨",
      title: "Frontend Development",
      description: "Crafting pixel-perfect, interactive user interfaces with cutting-edge frameworks and modern design principles",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      gradient: "from-blue-500 via-purple-500 to-pink-500"
    },
    {
      emoji: "⚙️", 
      title: "Backend Development",
      description: "Building scalable, secure server-side applications with robust APIs and efficient database management",
      skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Redis"],
      gradient: "from-green-500 via-teal-500 to-cyan-500"
    },
    {
      emoji: "☁️",
      title: "Cloud & DevOps", 
      description: "Deploying and managing cloud-native applications with modern CI/CD pipelines and infrastructure",
      skills: ["AWS", "Docker", "Kubernetes", "GitHub Actions", "Terraform"],
      gradient: "from-orange-500 via-red-500 to-pink-500"
    }
  ];

  const socialLinks = [
    { href: "https://github.com/Ashprogrammer07", icon: <i class="fab fa-github"></i>, label: "GitHub", color: "hover:bg-gray-800" },
    { href: "https://www.linkedin.com/in/ashwin-kumaran-92b6b831b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", icon: <i class="fab fa-linkedin"></i>, label: "LinkedIn", color: "hover:bg-blue-700" },
    { href: "https://twitter.com", icon: <i class="fab fa-twitter"></i>, label: "Twitter", color: "hover:bg-sky-600" },
    { href: "mailto:ashwin@example.com", icon: <i className="fas fa-envelope text-xl"></i>, label: "Email", color: "hover:bg-green-600" }
  ];

  const achievements = [
    { icon: "🚀", number: "10+", label: "Projects Completed", color: "bg-blue-500" },
    { icon: "⭐", number: "1+", label: "Years Experience", color: "bg-purple-500" },
    { icon: "💼", number: "10+", label: "Happy Clients", color: "bg-green-500" },
   
  ];

  // Enhanced animations and effects
  useEffect(() => {
    setIsLoaded(true);
    const roleInterval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    
    return () => {
      clearInterval(roleInterval);
    };
  }, [roles.length]);

  const handleResumeDownload = () => {
    const resumeUrl = '/assets/Mern resume.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Ashwin_Kumaran_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className={`relative z-10 min-h-screen flex items-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Enhanced Content */}
              <div className="text-center lg:text-left space-y-8">
                {/* Status Badge */}
                <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
                  <span className="relative flex h-3 w-3 mr-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                  </span>
                  <span className="text-sm font-semibold">🌟 Available for exciting opportunities</span>
                </div>

                {/* Enhanced Main Heading */}
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight">
                    <span className="block text-white/90 mb-2">Hello, I'm</span>
                    <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                      Ashwin Kumaran
                    </span>
                  </h1>
                  
                  {/* Dynamic Role */}
                  <div className="relative h-16 flex items-center justify-center lg:justify-start">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                      {roles[currentRole]}
                    </span>
                    <span className="animate-pulse ml-3 text-3xl text-cyan-400">|</span>
                  </div>
                </div>

                {/* Enhanced Description */}
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl text-gray-100 font-bold">
                    Transforming Ideas into Digital Reality
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-300/90 max-w-2xl leading-relaxed">
                    I create exceptional web experiences that combine beautiful design with powerful functionality. 
                    From concept to deployment, I bring your vision to life with modern technologies and creative solutions.
                  </p>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/projects"
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    <span className="relative flex items-center justify-center">
                      <span className="mr-2 text-xl group-hover:rotate-12 transition-transform">🚀</span>
                      Explore My Work
                    </span>
                  </Link>
                  
                  <Link
                    to="/contact"
                    className="group px-8 py-4 bg-transparent border-2 border-white/50 text-white rounded-xl font-bold hover:bg-white/10 transition-all duration-300"
                  >
                    <span className="flex items-center justify-center">
                      <span className="mr-2 text-xl group-hover:animate-bounce">💬</span>
                      Let's Collaborate
                    </span>
                  </Link>

                  <button
                    onClick={handleResumeDownload}
                    className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105"
                  >
                    <span className="flex items-center justify-center">
                      <span className="mr-2 text-xl group-hover:animate-bounce">📄</span>
                      Download Resume
                    </span>
                  </button>
                </div>

                {/* Enhanced Social Links */}
                <div className="flex justify-center lg:justify-start space-x-4">
                  {socialLinks.map((social, index) => (
                    <a 
                      key={index}
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`group relative w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-white ${social.color} transition-all duration-300 hover:scale-110 hover:-translate-y-2 shadow-lg hover:shadow-xl`}
                      title={social.label}
                    >
                      <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                        {social.icon}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Enhanced Profile Section */}
              <div className="flex items-center justify-center">
                <div className="relative group">
                  {/* Profile Container */}
                  <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl ring-4 ring-white/10 group-hover:ring-white/30 transition-all duration-500">
                    <img 
                      src="/assets/WhatsApp Image 2025-05-20 at 09.58.59_7c3eee7d.jpg" 
                      alt="Ashwin Kumaran - Full Stack Developer"
                      className="w-full h-full object-cover object-[center_10%] group-hover:scale-100 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-2xl animate-bounce">
                    <span className="text-white text-2xl">👋</span>
                  </div>

                  {/* Floating Skills */}
                  <div className="absolute -top-6 -left-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white text-sm font-medium animate-pulse">
                    React Expert
                  </div>
                  <div className="absolute -top-6 -right-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white text-sm font-medium animate-pulse" style={{animationDelay: '1s'}}>
                    Node.js Pro
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white text-sm font-medium animate-pulse" style={{animationDelay: '2s'}}>
                    Web Developer
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center text-white/70">
            <span className="text-sm mb-3 font-medium">Discover More</span>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-6 flex items-center   justify-evenly  bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {achievements.map((item, index) => (
              <div key={index} className="group text-center">
                <div className={`w-20 h-20 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl`}>
                  <span className="text-3xl text-white">{item.icon}</span>
                </div>
                <div className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3 group-hover:scale-110 transition-transform">
                  {item.number}
                </div>
                <div className="text-4xl lg:text-3xl font-black text-gray-900 dark:text-white mb-3 group-hover:scale-110 transition-transform">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white  dark:bg-gray-900 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full text-blue-600 dark:text-blue-400 font-semibold mb-6 border border-blue-200 dark:border-blue-800">
              <span className="mr-2 text-xl">⚡</span>
              Services & Expertise
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-grey-900 dark:text-white mb-8">
              What I Do{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Best
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Combining technical mastery with creative vision to deliver solutions that exceed expectations
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 p-8 lg:p-10 rounded-3xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4"
              >
                {/* Service Icon */}
                <div className={`w-20 h-20 bg-gradient-to-r ${service.gradient} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-xl`}>
                  <span className="text-4xl">{service.emoji}</span>
                </div>
                
                {/* Service Content */}
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
                  {service.description}
                </p>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-3">
                  {service.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-full border border-gray-200 dark:border-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-20">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/about"
                className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-3 text-2xl group-hover:animate-bounce">🚀</span>
                Discover My Journey
                <svg className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <Link
                to="/projects"
                className="group inline-flex items-center px-10 py-5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span className="mr-3 text-2xl">💼</span>
                View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
