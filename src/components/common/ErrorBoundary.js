import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Error info:', errorInfo);
    
    // Store error details in state
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    // Reset error state before reload
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="text-center max-w-md mx-auto">
            {/* Error Icon */}
            <div className="text-6xl mb-6">💥</div>
            
            {/* Error Title */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Oops! Something went wrong
            </h1>
            
            {/* Error Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              We've encountered an unexpected error. This might be a temporary issue.
              Please try refreshing the page or go back to the homepage.
            </p>
            
            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReload}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  🔄 Reload Page
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  🏠 Go Home
                </button>
              </div>
              
              {/* Developer Info (only in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-6">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🔧 Developer Info
                  </summary>
                  
                  <div className="text-xs space-y-2">
                    <div>
                      <strong className="text-red-600 dark:text-red-400">Error:</strong>
                      <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-xs overflow-x-auto mt-1">
                        {this.state.error.toString()}
                      </pre>
                    </div>
                    
                    {this.state.errorInfo && (
                      <div>
                        <strong className="text-red-600 dark:text-red-400">Stack Trace:</strong>
                        <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-xs overflow-x-auto mt-1 max-h-40 overflow-y-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
            
            {/* Help Links */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                If this problem persists:
              </p>
              <div className="flex flex-col gap-2 text-sm">
                <a 
                  href="/" 
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  📧 Go to Homepage
                </a>
                <a 
                  href="/contact" 
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  📂 Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
