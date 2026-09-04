import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/Register";
import AI from "./pages/AI";
import Debug from "./pages/Debug";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/ai"
            element={<AI />}
          />
        </Route>

        <Route path="/ai/debug" element={<Debug />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;