import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Scan from "./pages/Scan";
import Report from "./pages/Report";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/report/:id" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;