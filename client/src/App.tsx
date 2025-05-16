import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Content from './pages/Content';
import InitialGuidedJourney from './pages/InitialGuidedJourney';
import SectionGuidedJourney from './pages/SectionGuidedJourney';
import { GigProvider } from './contexts/GigContext';

function App() {
  return (
    <GigProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/content" element={<Content />} />
          <Route path="/guided-journey" element={<InitialGuidedJourney />} />
          <Route path="/guided-journey/:sectionId" element={<SectionGuidedJourney />} />
        </Routes>
      </Router>
    </GigProvider>
  );
}

export default App;