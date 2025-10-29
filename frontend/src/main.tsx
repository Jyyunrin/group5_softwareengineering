import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// CSS
import "./index.css";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Routes 
// Basic
import Landing from "./landing";
import Login from "./pages/user/Login";
import RegisterPage from "./pages/user/Register";

// Translation
import Camera from "./pages/translation/Camera";
import Processing from "./pages/translation/Processing";
import Result from "./pages/translation/Result";

// User
import UserHistory from "./pages/user/Userhistory";
import Userinfo from "./pages/user/Userinfo";
import UserLearningInfo from "./pages/user/Userlearninginfo";

// Sign Up
import SignUpName from "./pages/signup/Name";
import SignUpEmail from "./pages/signup/Email";
import SignUpPassword from "./pages/signup/Password";
import SignUpGoal from "./pages/signup/Goal";
import SignUpTargetLan from "./pages/signup/Targetlan";
import SignUpDifficulty from "./pages/signup/Difficulty";
import SignUpAllSet from "./pages/signup/Allset";

// Quick Guide

// Quiz
import DailyQuizDefault from "./pages/quiz/DailyQuizDefault";
import DailyQuizResult from "./pages/quiz/DailyQuizResult"
import FavWords from "./pages/quiz/FavWords";

const router = createBrowserRouter([
  // For Bottom Nav
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Landing /> },      
      { path: "*", element: <Landing /> },                  
      { path: "translation/camera", element: <Camera /> },
      { path: "translation/result", element: <Result /> },
      { path: "user/userhistory", element: <UserHistory /> },
      { path: "user/userinfo", element: <Userinfo /> },
      { path: "user/userlearninginfo", element: <UserLearningInfo /> },
      { path: "quiz/start", element: <DailyQuizDefault /> },
      { path: "quiz/result", element: <DailyQuizResult /> },
      { path: "quiz/favwords", element: <FavWords /> },
    ],
  },

  // Non-bottom nav
  { path: "/login", element: <Login /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/translation/processing", element: <Processing /> },
  { path: "/signup/name", element: <SignUpName /> },
  { path: "/signup/email", element: <SignUpEmail /> },
  { path: "/signup/password", element: <SignUpPassword /> },
  { path: "/signup/targetlan", element: <SignUpTargetLan /> },
  { path: "/signup/goal", element: <SignUpGoal /> },
  { path: "/signup/difficulty", element: <SignUpDifficulty /> },
  { path: "/signup/allset", element: <SignUpAllSet /> },
]);

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
);
