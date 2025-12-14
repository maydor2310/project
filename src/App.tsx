import React from "react"; // comment: react import
import { Routes, Route } from "react-router-dom"; // comment: routing components
import Header from "./components/Header"; // comment: app header with AppBar + Drawer
import Home from "./pages/Home"; // comment: home page
import Management from "./pages/Management"; // comment: task manager page
import Forms from "./pages/Forms"; // comment: forms page
import Help from "./pages/Help"; // comment: help page

const App: React.FC = () => { // comment: app root component
  return ( // comment: render app shell
    <> {/* comment: wrapper without extra div */}
      <Header /> {/* comment: header appears on all pages */}
      <Routes> {/* comment: define routes */}
        <Route path="/" element={<Home />} /> {/* comment: home route */}
        <Route path="/management" element={<Management />} /> {/* comment: management route */}
        <Route path="/forms" element={<Forms />} /> {/* comment: forms route */}
        <Route path="/help" element={<Help />} /> {/* comment: help route */}
      </Routes> {/* comment: end routes */}
    </> // comment: end wrapper
  ); // comment: end return
}; // comment: end component

export default App; // comment: export app
