import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from './pages/login/login';
import { Navigate } from "react-router-dom";
// import { AuthContext } from "./pages/authContext/AuthContext";
// import { useContext } from "react";
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
import LoginFormVul3 from "./components/tests/exfiltratingData/LoginFormVul";
import LoginFormSec3 from "./components/tests/exfiltratingData/LoginFormSec";

import { ROUTES3 } from "./components/tests/exfiltratingData/config/routes";
import AdminDashboardCase3 from "./components/tests/exfiltratingData/AdminDashboard";

import UserDashboardCaseVul3 from "./components/tests/exfiltratingData/UserDashboardVul";
import UserDashboardCaseSec3 from "./components/tests/exfiltratingData/UserDashboardSec";

import ExfiltratingData from "./components/tests/exfiltratingData/exfiltratingData";

// case 4
// vuln 
import LoginTestCase4Vul from "./components/tests/ExtractingUnknowField/LoginTestCase4/LoginTestCase4Vul";
import ForgotPasswordVuln from "./components/tests/ExtractingUnknowField/ForgotPassword/ForgotPasswordVuln";
import ResetPasswordVuln from "./components/tests/ExtractingUnknowField/ResetPassword/ResetPasswordVuln";
// secure
import ForgotPasswordSecure from "./components/tests/ExtractingUnknowField/ForgotPassword/ForgotPasswordSecure";
import ResetPasswordSecure from "./components/tests/ExtractingUnknowField/ResetPassword/ResetPasswordSecure";
import LoginTestCase4Secure from "./components/tests/ExtractingUnknowField/LoginTestCase4/LoginTestCase4Secure";

import ExtractingUnknownField from './components/tests/ExtractingUnknowField/ExtractingUnknownField';

// case 5
import TimingAttack from "./components/tests/TimingAttack/TimingAttack";
import DocumentList from "./components/tests/TimingAttack/DocumentList/DocumentList";
import DocumentListSecure from "./components/tests/TimingAttack/DocumentListSecure/DocumentListSecure";

function App() {
  // const { user } = useContext(AuthContext);
  return (
    //
    <BrowserRouter>
      <Routes>
        {/* User dashboard with nested routes */}
        <Route path="/home" element={<UserDashboard />}>
          <Route path="auth-bypass" element={<AuthBypass />} />
          <Route path="operator-injection" element={<OperatorInjection />} />
          <Route path="exfiltratingData" element={<ExfiltratingData />} />
          <Route path="extract-unknowfield" element={<ExtractingUnknownField />} />
          <Route path="timing-attack" element={<TimingAttack />} />

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

        <Route path={ROUTES3.LOGIN_VUL} element={<LoginFormVul3 />} />
        <Route path={ROUTES3.LOGIN_SEC} element={<LoginFormSec3 />} />
        <Route path={ROUTES3.ADMIN} element={<AdminDashboardCase3 />} />
        <Route path={ROUTES3.USER_VUL} element={<UserDashboardCaseVul3 />} />
        <Route path={ROUTES3.USER_SEC} element={<UserDashboardCaseSec3 />} />

        <Route path="/test/extract-unknowfield/vulnerable" element={<LoginTestCase4Vul />} />
        <Route path="/test/extract-unknowfield/vulnerable/forgot-password" element={<ForgotPasswordVuln />} />
        <Route path="/test/extract-unknowfield/vulnerable/reset-password" element={<ResetPasswordVuln />} />
        
        <Route path="/test/extract-unknowfield/secure/forgot-password" element={<ForgotPasswordSecure />} />
        <Route path="/test/extract-unknowfield/secure/reset-password" element={<ResetPasswordSecure />} />
        <Route path="/test/extract-unknowfield/secure" element={<LoginTestCase4Secure />} />

        <Route path="/test/timing-attack/vulnerable/" element={<DocumentList />} />
        <Route path="/test/timing-attack/secure/" element={<DocumentListSecure />} />

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Catch all route */}
        {/* <Route path="*" element={<Navigate to="/home" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
