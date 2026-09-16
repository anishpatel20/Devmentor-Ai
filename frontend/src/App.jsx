import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/Register";
import AI from "./pages/AI";
import Debug from "./pages/Debug";
import Explain from "./pages/Explain";
import Home from "./pages/Home";
import NotFound from "./pages/notFound";
import Review from "./pages/Review";
import KillCritic from "./pages/KillCritic";
import Projects from "./pages/Projects";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

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

          <Route
            path="/ai/debug"
            element={<Debug />}
          />

          <Route
            path="/ai/explain"
            element={<Explain />}
          />

          <Route
            path="/ai/review"
            element={<Review />}
          />

          <Route
            path="/ai/kill-critic"
            element={<KillCritic />}
          />


          {/* // Projects route */}

          <Route
            path="/projects"
            element={<Projects />}
          />

        </Route>

        <Route path="*" element={<NotFound />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
      