import './App.css';
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/userContext';
import ProtectedRoute from './protectedRoute';
import DailyQuote from './pages/quote_of_the_day/random_quote';

const NotFound = lazy(() => import('./pages/not_found/not_found'));
const LoginPage = lazy(() => import("./pages/login_page/login_page"));
const Homepage = lazy(() => import("./pages/homepage/homepage"));
const WrittenDiaries = lazy(() => import("./pages/written_diaries/written_diaries"));

function App() {
  return (
    <UserProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/homepage"
              element={
                <ProtectedRoute>
                  <Homepage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/written_diaries"
              element={
                <ProtectedRoute>
                  <WrittenDiaries />
                </ProtectedRoute>
              }
            />
            <Route
              path="/daily_quote"
              element={
                <ProtectedRoute>
                  <DailyQuote />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </UserProvider>
  );
}

export default App;
