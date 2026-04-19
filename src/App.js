import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import TopicPage from './pages/TopicPage';
import JSCompiler from './pages/jscompiler';
import Ai from './pages/Ai';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/topic" element={<TopicPage />} />
        <Route path="/topic/:slug" element={<TopicPage />} />
        <Route path="/curriculum" element={<Home />} />
        <Route path="/jscompiler" element={<JSCompiler />} />
        <Route path="/Ai" element={<Ai />} />
      </Routes>
    </Router>
  );
}

export default App;

