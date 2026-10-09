import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ProjectImport from './pages/ProjectImport';
import GraphExplorer from './pages/GraphExplorer';
import Vulnerabilities from './pages/Vulnerabilities';
import Remediation from './pages/Remediation';
import MultiProject from './pages/MultiProject';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="import" element={<ProjectImport />} />
          <Route path="graph" element={<GraphExplorer />} />
          <Route path="vulnerabilities" element={<Vulnerabilities />} />
          <Route path="remediation" element={<Remediation />} />
          <Route path="multi-project" element={<MultiProject />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
