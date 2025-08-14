import React from 'react';
import ContactForm from '../components/contact/ContactForm';

const Contact = () => {
  const contactMethods = [
    {
      icon: "📧",
      title: "Email",
      value: "ashprogrammer01@gmail.com",
      description: "Send me an email anytime"
    },
    {
      icon: "📱",
      title: "Phone",
      value: "91+ 8056314297",
      description: "Call me for urgent matters"
    },
    {
      icon: "📍",
      title: "Location",
      value: "Chennai, Tamil Nadu",
      description: "Available for local meetings"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have a project in mind? Let's discuss how we can work together to bring your ideas to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Let's Connect
              </h3>
              
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{method.title}</h4>
                      <p className="text-gray-900 dark:text-white font-medium">{method.value}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{method.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Social Links */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Follow Me
                </h4>
                <div className="flex space-x-4">
                  <a href="https://github.com/Ashprogrammer07" target="_blank" rel="noopener noreferrer" 
                     className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors transform hover:scale-210">
                    <i class="fab fa-github"></i>
                  </a>
                  <a href="https://www.linkedin.com/in/ashwin-kumaran-92b6b831b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer"
                     className="text-gray-400 hover:text-blue-500 transition-colors transform hover:scale-210">
                    <i class="fab fa-linkedin"></i>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                     className="text-gray-600 hover:text-blue-600 transition-colors transform hover:scale-210">
                    <i class="fab fa-twitter"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Availability Card */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mt-6">
              <div className="flex items-center mb-2">
                <span className="text-green-500 text-xl mr-2">✅</span>
                <h4 className="font-medium text-green-800 dark:text-green-300">Available for Projects</h4>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">
                I'm currently available for new projects and collaborations. Let's build something amazing together!
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Send me a message
              </h3>
              <ContactForm />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What's your typical response time?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                I usually respond to emails within 24 hours. For urgent matters, feel free to call me directly.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Do you work on small projects?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! I work on projects of all sizes, from small landing pages to complex web applications.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What technologies do you specialize in?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                I specialize in React, Node.js, and modern web technologies. Check out my skills page for more details.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Do you offer maintenance services?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Absolutely! I provide ongoing maintenance and support for all projects I develop.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
