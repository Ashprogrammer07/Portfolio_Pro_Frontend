import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from './redux/reducers/uiReducer';
import store from './redux/store';

// Import components
import ContinuousLayout from './components/common/ContinuousLayout';

// Admin Components (separate from continuous layout)
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

const AppContent = () => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.ui.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (!savedTheme) {
      const defaultTheme = systemPrefersDark ? 'dark' : 'light';
      dispatch(setTheme(defaultTheme));
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* All portfolio pages use the same continuous layout */}
        <Route path="/" element={<ContinuousLayout />} />
        <Route path="/about" element={<ContinuousLayout />} />
        <Route path="/skills" element={<ContinuousLayout />} />
        <Route path="/projects" element={<ContinuousLayout />} />
        <Route path="/contact" element={<ContinuousLayout />} />

        {/* Admin routes - separate from continuous layout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
