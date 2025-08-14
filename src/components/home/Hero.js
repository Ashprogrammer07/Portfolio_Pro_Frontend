import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const floatVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const handleResumeDownload = () => {
    // Replace with your actual resume file path
    const resumeUrl = '/assets/resume/Ashwin_Kumaran_Resume.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Ashwin_Kumaran_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Geometric Shapes */}
      <motion.div 
        className="absolute top-20 right-20 w-20 h-20 border-2 border-white/20 rounded-lg"
        variants={floatVariants}
        animate="float"
      />
      <motion.div 
        className="absolute bottom-32 left-16 w-16 h-16 bg-white/10 rounded-full"
        variants={floatVariants}
        animate="float"
        transition={{ delay: 1 }}
      />
      <motion.div 
        className="absolute top-1/2 right-32 w-12 h-12 border-2 border-white/30 rotate-45"
        variants={floatVariants}
        animate="float"
        transition={{ delay: 2 }}
      />

      <div className="relative z-10 h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Main Content */}
            <motion.div 
              className="text-center lg:text-left"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Greeting Badge */}
              <motion.div variants={itemVariants} className="mb-6">
                <span className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Available for new opportunities
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.div variants={itemVariants}>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  <span className="text-white">Hi, I'm </span>
                  <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent animate-pulse">
                    Ashwin Kumaran
                  </span>
                </h1>
              </motion.div>

              {/* Subtitle with Enhanced Styling */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="text-2xl md:text-3xl mb-4 text-gray-100 font-semibold">
                  <span className="inline-block relative">
                    Full Stack Developer
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"></div>
                  </span>
                </div>
                <p className="text-lg md:text-xl text-gray-200 opacity-90 max-w-2xl leading-relaxed">
                  Building amazing web experiences with modern technologies and creative solutions. 
                  Passionate about creating scalable applications that make a difference.
                </p>
              </motion.div>

              {/* Enhanced CTA Buttons */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/projects"
                    className="group relative px-8 py-4 bg-white text-blue-600 rounded-xl font-bold shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 hover:-rotate-1 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative group-hover:text-white transition-colors flex items-center justify-center">
                      <span className="mr-2">🚀</span>
                      View My Work
                    </span>
                  </Link>
                  
                  <Link
                    to="/contact"
                    className="group px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:rotate-1 shadow-lg hover:shadow-white/25"
                  >
                    <span className="flex items-center justify-center">
                      <span className="mr-2 group-hover:animate-pulse">💬</span>
                      Contact Me
                    </span>
                  </Link>

                  {/* Resume Download Button */}
                  <button
                    onClick={handleResumeDownload}
                    className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
                  >
                    <span className="flex items-center justify-center">
                      <span className="mr-2 group-hover:animate-bounce">📄</span>
                      Download Resume
                    </span>
                  </button>
                </div>
              </motion.div>

              {/* Social Links with Enhanced Design */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex justify-center lg:justify-start space-x-6">
                  {[
                    { href: "https://github.com", icon: "🐙", label: "GitHub", hoverColor: "hover:bg-gray-700" },
                    { href: "https://linkedin.com", icon: "💼", label: "LinkedIn", hoverColor: "hover:bg-blue-600" },
                    { href: "https://twitter.com", icon: "🐦", label: "Twitter", hoverColor: "hover:bg-blue-500" },
                    { href: "mailto:ashwin@example.com", icon: "📧", label: "Email", hoverColor: "hover:bg-green-600" }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white ${social.hoverColor} transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl border border-white/20`}
                      title={social.label}
                    >
                      <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                        {social.icon}
                      </span>
                    </a>
                  ))}
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div variants={itemVariants}>
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>50+ Projects Completed</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <span>5+ Years Experience</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    <span>100% Client Satisfaction</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual Elements */}
            <motion.div 
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {/* Profile Image with Enhanced Design */}
              <div className="relative">
                <div className="relative inline-block group">
                  {/* Rotating Border */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 p-1 animate-spin-slow">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800"></div>
                  </div>
                  
                  {/* Profile Image */}
                  <div className="relative w-80 h-80 md:w-96 md:h-96 mx-auto rounded-full overflow-hidden border-8 border-white shadow-2xl ring-8 ring-white/20 group-hover:ring-white/40 transition-all duration-500">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" 
                      alt="Ashwin Kumaran"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-500 rounded-full border-6 border-white flex items-center justify-center shadow-lg animate-bounce">
                    <span className="text-white text-2xl">👋</span>
                  </div>
                </div>

                {/* Floating Cards Around Profile */}
                <motion.div 
                  className="absolute -top-8 -left-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <div className="text-sm font-semibold">React Expert</div>
                      <div className="text-xs opacity-75">Frontend</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute -top-8 -right-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🔧</span>
                    <div>
                      <div className="text-sm font-semibold">Node.js</div>
                      <div className="text-xs opacity-75">Backend</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">☁️</span>
                    <div>
                      <div className="text-sm font-semibold">AWS Cloud</div>
                      <div className="text-xs opacity-75">DevOps</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <div className="flex flex-col items-center text-white/80">
            <span className="text-sm mb-2 font-medium">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center backdrop-blur-sm">
              <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tech Stack Ticker */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-t border-white/10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <div className="py-4 overflow-hidden">
          <div className="flex animate-scroll">
            {['React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'Next.js', 'Express', 'Tailwind CSS'].map((tech, index) => (
              <div key={index} className="flex items-center space-x-2 mx-8 whitespace-nowrap">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span className="text-white/90 font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
