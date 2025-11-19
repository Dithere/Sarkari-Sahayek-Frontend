import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ChatBot from "./pages/ChatBot";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 Landing page with Spline animation + Eligibility card */}
        <Route path="/" element={<LandingPage />} />
        {/* 💬 Chatbot page */}
        <Route path="/chat" element={<ChatBot />} />
      </Routes>
    </Router>
  );
}

export default App;
