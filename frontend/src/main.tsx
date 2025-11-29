import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

// basic layout and landing page
import AppLayout from "./components/nav/AppLayout";
import Landing from "./landing";
import Login from "./pages/user/Login";

// status pages
import Loading from "./pages/status/Loading";
import CannotFindPage from "./pages/status/404";

// translation pages
import Camera from "./pages/translation/Camera";
import Processing from "./pages/translation/Processing";
import Result from "./pages/translation/Result";

// user pages
import UserHistory from "./pages/user/Userhistory";
import UserHistoryItem from "./pages/user/Userhistoryitem";
import Userinfo from "./pages/user/Userinfo";
import UserLearningInfo from "./pages/user/Userlearninginfo";

// signup flow
import SignUp from "./pages/signup/SignUp";
import { SignupProvider } from "./pages/signup/SignupContext";

// quick guide
import QuickGuide from "./pages/quickguide/QuickGuide";

// quiz pages
import DailyQuizDefault from "./pages/quiz/DailyQuizDefault";
import DailyQuizResult from "./pages/quiz/DailyQuizResult";
import FavWords from "./pages/quiz/FavWords";

// auth guard for protected routes
import AuthGuard from "./components/utils/AuthRoute";

// router configuration
const router = createBrowserRouter([
  // routes that use the bottom navigation and main app layout
  {
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      // default route 
      { index: true, element: <Landing /> },
      // fallback for unknown paths under this layout
      { path: "*", element: <Landing /> },

      // translation routes
      { path: "translation/camera", element: <Camera /> },
      { path: "translation/result", element: <Result /> },

      // user history routes
      { path: "user/userhistory", element: <UserHistory /> },
      { path: "user/userhistory/:history_id", element: <UserHistoryItem /> },

      // user profile / learning info
      { path: "user/userinfo", element: <Userinfo /> },
      { path: "user/userlearninginfo", element: <UserLearningInfo /> },

      // quiz routes
      { path: "quiz/start", element: <DailyQuizDefault /> },
      { path: "quiz/result", element: <DailyQuizResult /> },
      { path: "quiz/favwords", element: <FavWords /> },
    ],
  },

  // routes that do not use the bottom nav layout
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
  },
]);

// mount React app with router
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
