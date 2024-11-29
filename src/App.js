import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from "./pages/login_page/login_page"
import Homepage from './pages/homepage/homepage';
import WrittenDiaries from './pages/written_diaries/written_diaries';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/written_diaries" element={<WrittenDiaries />} />
        </Routes>
    </Router>
  );
}

export default App;