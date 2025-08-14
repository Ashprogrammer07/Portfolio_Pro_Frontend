import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Import all your page components
import Home from '../../pages/Home';
import About from '../../pages/About';
import Skills from '../../pages/Skills';
import Projects from '../../pages/Projects';
import Contact from '../../pages/Contact';

// Import Header and Footer
import Header from './Header';
import Footer from './Footer';

const ContinuousLayout = () => {
  const location = useLocation();
  const containerRef = useRef(null);
  
  // Section references for navigation
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  // Scroll to section based on URL
  useEffect(() => {
    const sectionRefs = {
      '/': homeRef,
      '/about': aboutRef,
      '/skills': skillsRef,
      '/projects': projectsRef,
      '/contact': contactRef
    };

    const targetRef = sectionRefs[location.pathname];
    if (targetRef?.current) {
      // Add offset for fixed header
      const headerOffset = 80; // Adjust based on your header height
      const elementPosition = targetRef.current.offsetTop - headerOffset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }, [location.pathname]);

  return (
    <>
      {/* Fixed Header */}
      <Header />
      
      {/* Main Content Container */}
      <div 
        ref={containerRef}
        className="w-full"
        style={{ 
          paddingTop: '80px', // Space for fixed header
          overflowX: 'hidden'
        }}
      >
        {/* Home Section */}
        <section 
          ref={homeRef}
          id="home"
          className="min-h-screen w-full"
        >
          <Home />
        </section>

        {/* About Section */}
        <section 
          ref={aboutRef}
          id="about"
          className="min-h-screen w-full"
        >
          <About />
        </section>

        {/* Skills Section */}
        <section 
          ref={skillsRef}
          id="skills"
          className="min-h-screen w-full"
        >
          <Skills />
        </section>

        {/* Projects Section */}
        <section 
          ref={projectsRef}
          id="projects"
          className="min-h-screen w-full"
        >
          <Projects />
        </section>

        {/* Contact Section */}
        <section 
          ref={contactRef}
          id="contact"
          className="min-h-screen w-full"
        >
          <Contact />
        </section>

        {/* Footer at the bottom */}
        <Footer />
      </div>

      {/* Navigation Indicator */}
      <ScrollIndicator />
    </>
  );
};

// Updated scroll position indicator
const ScrollIndicator = () => {
  const [activeSection, setActiveSection] = React.useState('home');

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            // Update URL without page refresh
            const newPath = section === 'home' ? '/' : `/${section}`;
            if (window.location.pathname !== newPath) {
              window.history.replaceState(null, '', newPath);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'home', name: 'Home' },
    { id: 'about', name: 'About' },
    { id: 'skills', name: 'Skills' },
    { id: 'projects', name: 'Projects' },
    { id: 'contact', name: 'Contact' }
  ];

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

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40">
      <div className="flex flex-col space-y-3">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`transition-all duration-300 rounded-full ${
              activeSection === section.id
                ? 'w-4 h-8 bg-blue-500 scale-110'
                : 'w-3 h-3 bg-gray-400 dark:bg-gray-600 hover:scale-110'
            }`}
            title={section.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ContinuousLayout;
