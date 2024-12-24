import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
// import Department from "./components/Department";
// import Industry from "./components/Industry";
// import Role from "./components/Role";
// import Jobtype from "./components/Jobtype"
// import Specialization from "./components/Specialization";

import Dashboard from "./components/Dashboard";
import Options from "./components/Options";

// import ComplexNavbar from "./common/ComplexNavbar";

function App() {
  return (
    <Router>
      {/* <ComplexNavbar /> */}
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/options" element={<Options />} />
        {/* <Route path="/department" element={<Department />} />
        <Route path="/industry" element={<Industry />} />
        <Route path="/jobtype" element={<Jobtype />} />
        <Route path="/role" element={<Role />} />
        <Route path="/specialization" element={<Specialization />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
