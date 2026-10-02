// App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Components/DashBoard/DashBoard";
import AppLayout from "./AppLayout";
import LogIn from "./Components/Login/LogIn";
import ChatPage from "./Components/Assistant/Components/Chat/ChatPage"; // adjust path to your ChatPage
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login/:mode" element={<LogIn />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/chat" element={<ChatPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;