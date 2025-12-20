import React from "react"; // comment: react import
import { Routes, Route, Navigate } from "react-router-dom"; // comment: routing tools
import Header from "./components/Header"; // comment: global header

import Home from "./pages/Home"; // comment: dashboard page
import Management from "./pages/Management"; // comment: management page
import Forms from "./pages/Forms"; // comment: forms page
import Help from "./pages/Help"; // comment: help page
import Courses from "./pages/Courses"; // comment: courses management page
import Teachers from "./pages/Teachers"; // comment: teachers management page
import Files from "./pages/Files"; // comment: files management page
import Login from "./pages/Login"; // comment: login placeholder page

const App: React.FC = () => { // comment: app component
  return ( // comment: render app
    <> {/* comment: wrapper */}
      <Header /> {/* comment: global app bar + drawer */}
      <Routes> {/* comment: app routes */}
        <Route path="/" element={<Home />} /> {/* comment: home route */}
        <Route path="/management" element={<Management />} /> {/* comment: management route */}
        <Route path="/forms" element={<Forms />} /> {/* comment: forms route */}
        <Route path="/help" element={<Help />} /> {/* comment: help route */}
        <Route path="/courses" element={<Courses />} /> {/* comment: courses route */}
        <Route path="/teachers" element={<Teachers />} /> {/* comment: teachers route */}
        <Route path="/files" element={<Files />} /> {/* comment: files route */}
        <Route path="/login" element={<Login />} /> {/* comment: login route */}

        <Route path="*" element={<Navigate to="/" replace />} /> {/* comment: fallback to home */}
      </Routes> {/* comment: end routes */}
    </> // comment: end wrapper
  ); // comment: end return
}; // comment: end component

export default App; // comment: export
