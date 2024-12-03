import './App.css';
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/userContext';

const NotFound = lazy(() => import('./pages/not_found/not_found'))
const LoginPage = lazy(() => import("./pages/login_page/login_page"));
const Homepage = lazy(() => import("./pages/homepage/homepage"));
const WrittenDiaries = lazy(() => import("./pages/written_diaries/written_diaries"));

function App() {
  return (
    <UserProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<LoginPage />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/written_diaries" element={<WrittenDiaries />} />
          </Routes>
        </Suspense>
      </Router>
    </UserProvider>
  );
}

export default App;