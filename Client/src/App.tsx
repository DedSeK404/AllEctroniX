import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './Components/Login/SignIn/SignIn';

function App() {
  return (
    <div>
      <Routes>     
      <Route path="/login" element={<SignIn />} />   
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </div>
  );
}

export default App;
