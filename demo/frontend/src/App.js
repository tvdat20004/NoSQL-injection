import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from './pages/login/login';
import { Navigate } from "react-router-dom";
import { AuthContext } from "./pages/authContext/AuthContext";
import { useContext } from "react";
import UserDashboard from "./pages/sideBar/sideBar";
import AuthBypass from "./components/tests/AuthBypass/AuthBypass";
import VulnerableAuthTest from "./components/tests/AuthBypass/VulnerableAuthTest";
import SecureAuthTest from "./components/tests/AuthBypass/SecureAuthTest";

// case 2
import OperatorInjection from "./components/tests/OperatorInjection/OperatorInjection";
import LoginFormVuln2 from "./components/tests/OperatorInjection/LoginFormVuln";
import LoginFormSecure2 from "./components/tests/OperatorInjection/LoginFormSecure";
import { ROUTES2 } from "./components/tests/OperatorInjection/config/routes";
import AdminDashboardCase2 from "./components/tests/OperatorInjection/AdminDashboard";
import UserDashboardCase2 from "./components/tests/OperatorInjection/UserDashboard";

// case 3
import LoginForm3 from "./components/tests/exfiltratingData/LoginForm";
import { ROUTES3 } from "./components/tests/exfiltratingData/config/routes";
import AdminDashboardCase3 from "./components/tests/exfiltratingData/AdminDashboard";
import UserDashboardCase3 from "./components/tests/exfiltratingData/UserDashboard";
import ExfiltratingData from "./components/tests/exfiltratingData/exfiltratingData";

function App() {
  const { user } = useContext(AuthContext);
  return (
    //
    <BrowserRouter>
      <Routes>
        {/* User dashboard with nested routes */}
        <Route path="/home" element={<UserDashboard />}>
          <Route path="auth-bypass" element={<AuthBypass />} />
          <Route path="operator-injection" element={<OperatorInjection />} />
          <Route path="exfiltratingData" element={<ExfiltratingData />} />
        </Route>

        <Route
          path="/test/auth-bypass/vulnerable"
          element={<VulnerableAuthTest />}
        />
        <Route path="/test/auth-bypass/secure" element={<SecureAuthTest />} />

        <Route path={ROUTES2.LOGINSEC} element={<LoginFormSecure2 />} />
        <Route path={ROUTES2.LOGINVUL} element={<LoginFormVuln2 />} />
        <Route path={ROUTES2.ADMIN} element={<AdminDashboardCase2 />} />
        <Route path={ROUTES2.USER} element={<UserDashboardCase2 />} />

        <Route path={ROUTES3.LOGIN} element={<LoginForm3 />} />
        <Route path={ROUTES3.ADMIN} element={<AdminDashboardCase3 />} />
        <Route path={ROUTES3.USER} element={<UserDashboardCase3 />} />
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
