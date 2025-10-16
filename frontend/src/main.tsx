import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// CSS
import "./index.css";

// Layout
import AppLayout from "./layout/AppLayout";

// Routes 
// Basic
import Landing from "./landing";
import Login from "./login";
import RegisterPage from "./register";

// Translation
import Camera from "./translation/camera";
import Processing from "./translation/processing";
import Result from "./translation/result";

// User
import UserHistory from "./user/userhistory";
import Userinfo from "./user/userinfo";
import UserLearningInfo from "./user/userlearninginfo";

// Sign Up
import SignUpName from "./signup/name";
import SignUpGoal from "./signup/goal";
import SignUpTargetLan from "./signup/targetlan";
import SignUpDifficulty from "./signup/difficulty";
import SignUpAllSet from "./signup/allset";

const router = createBrowserRouter([
  // For Bottom Nav
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Landing /> },                       
      { path: "translation/camera", element: <Camera /> },
      { path: "translation/result", element: <Result /> },
      { path: "user/userhistory", element: <UserHistory /> },
      { path: "user/userinfo", element: <Userinfo /> },
      { path: "user/userlearninginfo", element: <UserLearningInfo /> },
      { path: "*", element: <Landing /> }, 
    ],
  },

  // Non-bottom nav
  { path: "/login", element: <Login /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/translation/processing", element: <Processing /> },
  { path: "/signup/name", element: <SignUpName /> },
  { path: "/signup/goal", element: <SignUpGoal /> },
  { path: "/signup/targetlan", element: <SignUpTargetLan /> },
  { path: "/signup/difficulty", element: <SignUpDifficulty /> },
  { path: "/signup/difficulty", element: <SignUpAllSet /> },
]);

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
);
