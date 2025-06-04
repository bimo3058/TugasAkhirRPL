import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import WelcomePage from '../src/Components/pages/Welcome.jsx';
import SignPage from '../src/Components/pages/Sign.jsx';
import HomePage from '../src/Components/pages/Dashboard.jsx';
import NewLogin from '../src/Components/pages/Newlogin.jsx';
import NewHome from '../src/Components/pages/Home.jsx';
import React from 'react';

function App() {
  return (
    <Router>
      <div className="h-fit">
        <Routes>
          <Route path="/" element={<Navigate to="/sign" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/sign" element={<SignPage />} />
          <Route path="/new" element={<NewLogin />} />
          <Route path="/dash" element={<NewHome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

