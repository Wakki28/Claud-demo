import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QcMasterPage from './pages/QcMasterPage';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<QcMasterPage />} />
          <Route path="/qc-master" element={<QcMasterPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
