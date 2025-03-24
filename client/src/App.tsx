import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GigBuilder from './pages/GigBuilder';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gig-builder" element={<GigBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;