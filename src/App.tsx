import React from "react"; // comment: react import
import { Routes, Route } from "react-router-dom"; // comment: routing
import Header from "./components/Header"; // comment: header
import Home from "./pages/Home"; // comment: home
import Management from "./pages/Management"; // comment: management
import Forms from "./pages/Forms"; // comment: forms
import Help from "./pages/Help"; // comment: help

const App: React.FC = () => { // comment: app
  return ( // comment: render
    <> {/* comment: wrapper */}
      <Header /> {/* comment: global header */}
      <Routes> {/* comment: routes */}
        <Route path="/" element={<Home />} /> {/* comment: home route */}
        <Route path="/management" element={<Management />} /> {/* comment: management route */}
        <Route path="/forms" element={<Forms />} /> {/* comment: forms route */}
        <Route path="/help" element={<Help />} /> {/* comment: help route */}
      </Routes> {/* comment: end routes */}
    </> // comment: end wrapper
  ); // comment: end return
}; // comment: end app

export default App; // comment: export
