import { useState } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Machines from './pages/Machines';
import Production from './pages/Production';
import Inventory from './pages/Inventory';
import Alerts from './pages/Alerts';
import AIInsights from './pages/AIInsights';
import Settings from './pages/Settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPath, setCurrentPath] = useState('dashboard');

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderPage = () => {
    switch (currentPath) {
      case 'dashboard': return <Dashboard />;
      case 'machines': return <Machines />;
      case 'production': return <Production />;
      case 'inventory': return <Inventory />;
      case 'alerts': return <Alerts />;
      case 'ai': return <AIInsights />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentPath={currentPath} onNavigate={setCurrentPath} onLogout={() => setIsAuthenticated(false)}>
      {renderPage()}
    </Layout>
  );
}
