import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GigBuilder from './pages/GigBuilder';
import Home from './pages/Home';
import Content from './pages/Content';
import GuidedJourney from './pages/GuidedJourney';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gig-builder" element={<GigBuilder />} />
        <Route path="/content" element={<Content />} />
        <Route path="/guided-journey" element={<GuidedJourney />} />
      </Routes>
    </Router>
  );
}

export default App;