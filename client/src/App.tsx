import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GigBuilder from './pages/GigBuilder';
import Home from './pages/Home';
import Content from './pages/Content';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gig-builder" element={<GigBuilder />} />
        <Route path="/content" element={<Content />} />
      </Routes>
    </Router>
  );
}

export default App;