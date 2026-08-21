import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from "./Components/DashBoard/DashBoard"
import SignUp from "./Components/Login/SignUp/SignUp"
import SignIn from './Components/Login/SignIn/SignIn';

function App() {
  return (
    <div>
      <Routes>    
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login/signin" element={<SignIn />} /> 
        <Route path="/login/signup" element={<SignUp />} />
        {/* Redirect root "/" and fallback "*" straight to "/dashboard" */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
