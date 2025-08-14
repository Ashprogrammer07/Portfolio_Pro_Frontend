import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const experiences = [
    {
      company: "Future Intern",
      position: "Full Stack Development Intern",
      period: "2025 - Present",
      description: "Led development of scalable web applications serving 100k+ users."
    }
  ];

  const education = [
    {
      school: "Vellore Institute of Technology,Chennai",
      degree: "Bachelor of Technology in Computer Science and Engineering",
      period: "2024 - 2028",
      gpa: "8.5/10.0"
    },
    {school: "Indian Institute of Technology, Madras",
      degree: "Bachelor of Science in Data Science and its Applications",
      period: "2024 - 2028",
      gpa: "8.0/10.0"}
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About Me
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Passionate developer with 1+ years of experience creating digital solutions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Personal Info */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden mr-6">
                    <img 
                      src="/assets/WhatsApp Image 2025-05-20 at 09.58.59_7c3eee7d.jpg" 
                      alt="Profile"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ashwin Kumaran</h2>
                    <p className="text-blue-500">Full Stack Developer</p>
                  </div>
                </div>

                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <span className="w-6">📍</span>
                    <span>Chennai,Tamil Nadu</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-6">📧</span>
                    <span>ashprogrammer01@gmail.com</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-6">📱</span>
                    <span>91+ 8056314297</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-6">🌐</span>
                    <span>www.ashwin.in</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-4">
                    <a href="https://github.com/Ashprogrammer07" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <span className="text-2xl"><i class="fab fa-github"></i></span>
                    </a>
                    <a href="https://www.linkedin.com/in/ashwin-kumaran-92b6b831b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="text-gray-400 hover:text-blue-500">
                      <span className="text-2xl"><i class="fab fa-linkedin"></i></span>
                    </a>
                    <a href="https://twitter.com" className="text-gray-400 hover:text-blue-400">
                      <span className="text-2xl"><i class="fab fa-twitter"></i></span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Bio */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Story</h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                 I’m Ashwin, a passionate frontend developer, video editor, and designer dedicated to crafting engaging, user-friendly experiences. With a blend of creativity and technical skill, I bring ideas to life through clean code, compelling visuals, and thoughtful design, ensuring every project is impactful, functional, and visually appealing.
                </p>
                <p>
                  I specialize in modern JavaScript frameworks like React and Node.js, and I'm 
                  passionate about creating clean, maintainable code that solves real-world problems. 
                  I believe in the power of technology to transform businesses and improve lives.
                </p>
                <p>
                  When I'm not coding, you can find me hiking in the mountains, reading tech blogs, 
                  or contributing to open-source projects. I'm always eager to learn new technologies 
                  and take on challenging projects.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Experience</h3>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{exp.position}</h4>
                    <p className="text-blue-500 font-medium">{exp.company}</p>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{exp.period}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Education</h3>
          {education.map((edu, index) => (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
             <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{edu.degree}</h4>
                <p className="text-blue-500 font-medium">{edu.school}</p>
                <p className="text-gray-500 dark:text-gray-400">GPA: {edu.gpa}</p>
              </div> 
              
              <span className="text-gray-500 dark:text-gray-400 text-sm">{edu.period}</span>
            </div>
          </div>))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Let's Work Together
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            I'm always interested in new opportunities and exciting projects. 
            Let's discuss how we can bring your ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors transform hover:scale-105"
            >
              Get In Touch
            </Link>
            <Link
              to="/projects"
              className="px-8 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors transform hover:scale-105"
            >
              View My Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
