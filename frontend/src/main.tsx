import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// CSS
import './index.css'

// Routes
import Landing from './landing.tsx'
import Login from './login.tsx'
import RegisterPage from "./register.tsx";
import Camera from './translation/camera.tsx'
// import Processing from './translation/processing.tsx'
import Result from './translation/result.tsx'
import Userinfo from './user/userinfo.tsx'
import UserLearningInfo from './user/userlearninginfo.tsx'

const router = createBrowserRouter([
  // Basic
  {path: "/", element: <Landing />},
  {path: "/login", element: <Login />},
  {path: "/register", element: <RegisterPage />},

  // Translation
  {path: "/translation/camera", element: <Camera />},
  // {path: "/translation/processing", element: <Processing />},
  {path: "/translation/result", element: <Result />},

  // Userinfo
  {path: "/user/userinfo", element: <Userinfo />},
  {path: "/user/userlearninginfo", element: <UserLearningInfo />},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
