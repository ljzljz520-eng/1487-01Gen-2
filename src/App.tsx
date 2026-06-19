import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from '@/pages/Home';
import InternalMedicine from '@/pages/InternalMedicine';
import Surgery from '@/pages/Surgery';
import Laboratory from '@/pages/Laboratory';
import PrivacyDoc from '@/pages/PrivacyDoc';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/internal-medicine" element={<InternalMedicine />} />
        <Route path="/surgery" element={<Surgery />} />
        <Route path="/laboratory" element={<Laboratory />} />
        <Route path="/privacy" element={<PrivacyDoc />} />
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-slate-800 mb-4">404</h1>
              <p className="text-slate-500 mb-6">页面未找到</p>
              <Link to="/" className="text-medical-blue-600 hover:text-medical-blue-700">
                返回首页
              </Link>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}
