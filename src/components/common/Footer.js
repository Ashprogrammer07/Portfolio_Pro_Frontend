import React from 'react';
import {Link} from 'react-router-dom';
const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.offsetTop - headerOffset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Ashwin Kumaran
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Passionate full-stack developer creating innovative web solutions with modern technologies. 
              Let's build something amazing together!
            </p>
            <div className="flex space-x-6">
              <a href="https://github.com/Ashprogrammer01" target="_blank" rel="noopener noreferrer" 
                 className="text-2xl hover:text-blue-400 transition-colors transform hover:scale-110">
                <i class="fab fa-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/ashwin-kumaran-92b6b831b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer"
                 className="text-2xl hover:text-blue-400 transition-colors transform hover:scale-110">
               <i class="fab fa-linkedin"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="text-2xl hover:text-blue-400 transition-colors transform hover:scale-110">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="mailto:ashwin@example.com"
                 className="text-2xl hover:text-green-400 transition-colors transform hover:scale-110">
                <i className="fas fa-envelope text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About Me' },
                { id: 'skills', label: 'My Skills' },
                { id: 'projects', label: 'Projects' },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block text-gray-300 hover:text-white transition-colors text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Get In Touch</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <span className="mr-3">📧</span>
                <span>ashprogrammer01@gmail.com</span>
              </div>
              <div className="flex items-center">
                <span className="mr-3">📱</span>
                <span>+91 8056314297</span>
              </div>
              <div className="flex items-center">
                <span className="mr-3">📍</span>
                <span>Chennai, India</span>
              </div>
              <div className="flex items-center">
                <span className="mr-3">🌐</span>
                <span>www.ashwinkumaran.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              <Link to={"/admin/login"}>©</Link> {currentYear} Ashwin Kumaran.All rights reserved.</p>
            
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <button 
                onClick={() => scrollToSection('home')}
                className="hover:text-white transition-colors"
              >
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
