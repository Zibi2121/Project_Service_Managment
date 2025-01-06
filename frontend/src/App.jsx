import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import PlanVisit from "./components/PlanVisit";
import RepairPlan from "./components/RepairPlan";
import AuthProvider from "./AuthProvider"; // zakładamy, że AuthProvider jest w oddzielnym pliku
import ProtectedRoute from "./ProtectedRoute"; // zakładamy, że jest odpowiedni komponent chroniący trasy
import "./App.scss";

function App() {
  return (
    <div className="App">
      {/* AuthProvider opakowuje całą aplikację */}
      <AuthProvider>
        <Router>
          <Routes>
            {/* Strona logowania dostępna bez autoryzacji */}
            <Route path="/" element={<Login />} />
            
            
            <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
            <Route path="/zaplanuj-wizyte" element={<ProtectedRoute component={PlanVisit} />} />
            <Route path="/naprawy" element={<ProtectedRoute component={RepairPlan} />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
