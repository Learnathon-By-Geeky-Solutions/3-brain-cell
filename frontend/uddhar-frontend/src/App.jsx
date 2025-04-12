import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import ProtectedRoute from "./authentication/components/ProtectedRoutes";
import { AuthProvider } from "./authentication/context/AuthContext";
import ForgetPass from "./authentication/pages/ForgetPass";
import Login from "./authentication/pages/Login";
import Registration from "./authentication/pages/Registration";
import Unauthorized from "./authentication/pages/UnAuthorized";
import CoordinatorDashboard from "./coordinator/pages/CoordinatorDashboard";
import DisasterControl from "./coordinator/pages/DisasterControl";
import { Landing, Navbar } from "./public/Public";
import DashboardNavbar from "./shared/components/DashboardNavbar";
import Volunteer from "./volunteer/pages/Volunteer";
import OrgDashboard from "./organization/pages/OrgDashboard";

const App = () => {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Navbar>
                  <Landing />
                </Navbar>
              }
            />
            <Route
              path="/dashboard/coordinator"
              element={
                <ProtectedRoute roles={["coordinator"]}>
                  <DashboardNavbar heading="Coordinator Dashboard">
                    <CoordinatorDashboard />
                  </DashboardNavbar>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sign-in"
              element={
                <Navbar>
                  <Login />
                </Navbar>
              }
            />
            <Route
              path="/sign-up"
              element={
                <Navbar>
                  <Registration />
                </Navbar>
              }
            />
            <Route path="/password-recovery" element={<ForgetPass />} />
            <Route
              path="/create-a-event"
              element={
                <ProtectedRoute roles={["coordinator"]}>
                  <DashboardNavbar heading="Coordinator Dashboard">
                    <DisasterControl />
                  </DashboardNavbar>
                </ProtectedRoute>
              }
            />
            <Route
              path="/unauthorized"
              element={
                <Navbar>
                  <Unauthorized />
                </Navbar>
              }
            />
            <Route
              path="/dashboard/volunteer"
              element={
                // <DashboardNavbar heading="Volunteer Dashboard">
                    <Volunteer />
                // </DashboardNavbar>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
};

export default App;
