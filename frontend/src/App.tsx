import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useAppStore } from './store';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProjectImport from './pages/ProjectImport';
import GraphExplorer from './pages/GraphExplorer';
import Vulnerabilities from './pages/Vulnerabilities';
import Remediation from './pages/Remediation';
import MultiProject from './pages/MultiProject';
import Settings from './pages/Settings';
import History from './pages/History';
import Perimeter from './pages/Perimeter';

function App() {
  const { setUser, setAuthLoading } = useAppStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setAuthLoading]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Homepage & Authentication Screen */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Enterprise Console Routes (Strict Authentication Guard) */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="perimeter" element={<Perimeter />} />
          <Route path="import" element={<ProjectImport />} />
          <Route path="graph" element={<GraphExplorer />} />
          <Route path="vulnerabilities" element={<Vulnerabilities />} />
          <Route path="remediation" element={<Remediation />} />
          <Route path="multi-project" element={<MultiProject />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch-all route redirects to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
