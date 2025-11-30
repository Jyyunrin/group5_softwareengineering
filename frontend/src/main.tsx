import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

// Basic Routes 
import AppLayout from "./components/nav/AppLayout";
import Landing from "./landing";
import Login from "./pages/user/Login";

// Status
import Loading from './pages/status/Loading';
import CannotFindPage from './pages/status/404';

// Translation
import Camera from "./pages/translation/Camera";
import Processing from "./pages/translation/Processing";
import Result from "./pages/translation/Result";

// User
import UserHistory from "./pages/user/Userhistory";
import UserHistoryItem from "./pages/user/Userhistoryitem"
import Userinfo from "./pages/user/Userinfo";
import UserLearningInfo from "./pages/user/Userlearninginfo";

// Sign Up
import SignUp from "./pages/signup/SignUp";
import { SignupProvider } from "./pages/signup/SignupContext";

// Quick Guide
import QuickGuide from "./pages/quickguide/QuickGuide";

// Quiz
import DailyQuizDefault from "./pages/quiz/DailyQuizDefault";
import DailyQuizResult from "./pages/quiz/DailyQuizResult"
import FavWords from "./pages/quiz/FavWords";

import AuthGuard from "./components/utils/AuthRoute"

const router = createBrowserRouter([
  // For Bottom Nav
  {
    element: <AuthGuard><AppLayout /></AuthGuard>,
    children: [
      { index: true, element: <Landing /> },      
      { path: "*", element: <Landing /> },                  
      { path: "translation/camera", element: <Camera /> },
      { path: "translation/result", element: <Result /> },
      { path: "user/userhistory", element: <UserHistory /> },
      { path: "user/userhistory/:history_id", element: <UserHistoryItem /> },
      { path: "user/userinfo", element: <Userinfo /> },
      { path: "user/userlearninginfo", element: <UserLearningInfo /> },
      { path: "quiz/start", element: <DailyQuizDefault /> },
      { path: "quiz/result", element: <DailyQuizResult /> },
      { path: "quiz/favwords", element: <FavWords /> },
    ],
  },

  // Non-bottom nav
  { path: "/login", element: <Login /> },
  { path: "/translation/processing", element: <Processing /> },
  { path: "/404", element: <CannotFindPage /> },
  { path: "/pageloading", element: <Loading /> },
  { path: "/quickguide", element: <QuickGuide /> },
  {
    path: "/signup",
      element: (
      <SignupProvider>
        <SignUp />
      </SignupProvider>
    ),
  }
]);

  ReactDOM.createRoot(document.getElementById("root")!).render(
    // <React.StrictMode>
      <RouterProvider router={router} />
    // </React.StrictMode>
);
