import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Components/DashBoard/DashBoard";

import AppLayout from "./AppLayout";
import LogIn from "./Components/Login/LogIn";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login/:mode" element={<LogIn />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
