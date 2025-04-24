import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { AuthProvider } from "./authentication/context/AuthContext";
import ForgetPass from "./authentication/pages/ForgetPass";
import Login from "./authentication/pages/Login";
import Registration from "./authentication/pages/Registration";
import Unauthorized from "./authentication/pages/UnAuthorized";
import { Landing, Navbar } from "./public/Public";
import CoordinatorRoute, {
  CreateAnEventRoute,
} from "./routeWrapper/CoordinatorRoute";
import OrganizationRoute from "./routeWrapper/OrganizationRoute";
import VolunteerRoute from "./routeWrapper/VolunteerRoute";
import { ProfileWrapper } from "./routeWrapper/Common";
import ErrorPage from "./public/components/ErrorPage";

const App = () => {
  return (
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
            path="/dashboard/coordinator/:activeSection?"
            element={<CoordinatorRoute />}
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
          <Route path="/create-a-event" element={<CreateAnEventRoute />} />
          <Route
            path="/unauthorized"
            element={
              <Navbar>
                <Unauthorized />
              </Navbar>
            }
          />
          <Route
            path="/dashboard/volunteer/:activeSection?"
            element={<VolunteerRoute />}
          />
          <Route
            path="/dashboard/organization/:activeSection?"
            element={<OrganizationRoute />}
          />
          <Route path="/profile" element={<ProfileWrapper />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
