/**
 * Basic layout for bottom navigation
 * 
 * TODO:       
 * Add hide_nav 
 */
import { Outlet, useLocation } from "react-router-dom";
import BottomRadialNav from "../../components/nav/BottomNav.tsx";

// Nav should not work when
// 1. camera is working
// 2. ...
const HIDE_NAV = new Set([
  "/login",
  "/register",
  "/translation/processing",
]);

export default function AppLayout() {
  const { pathname } = useLocation();
  const hideNav = HIDE_NAV.has(pathname);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[420px] px-5 pb-[120px]">
        <Outlet />
      </div>
      {!hideNav && <BottomRadialNav />}
    </div>
  );
}
