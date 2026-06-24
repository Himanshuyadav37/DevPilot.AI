    import {
      BrowserRouter,
      Routes,
      Route,
      Navigate
    } from "react-router-dom";

    import { AuthProvider } from "./contexts/AuthContext";
    import ProtectedRoute from "./components/ProtectedRoute";

    import Dashboard from "./pages/Dashboard";
    import GenerateProject from "./pages/GenerateProject";
    import Projects from "./pages/Projects";
    import Executions from "./pages/Executions";
    import Settings from "./pages/Settings";
    import Login from "./pages/Login";
    import Signup from "./pages/Signup";

    import ProjectDetails from "./pages/ProjectDetails";

    function App() {

      return (

        <AuthProvider>

          <BrowserRouter>

            <Routes>

              <Route
                path="/"
                element={
                  <Navigate
                    to="/dashboard"
                  />
                }
              />

              <Route
                path="/login"
                element={<Login />}
              />

              <Route
                path="/signup"
                element={<Signup />}
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/generate"
                element={
                  <ProtectedRoute>
                    <GenerateProject />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/projects/:id"
                element={
                  <ProtectedRoute>
                    <ProjectDetails />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/executions"
                element={
                  <ProtectedRoute>
                    <Executions />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

            </Routes>

          </BrowserRouter>

        </AuthProvider>

      );
    }

    export default App;