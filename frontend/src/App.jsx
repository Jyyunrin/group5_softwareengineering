import { useState } from "react";
import "./App.css";
// import Camera from "./components/Camera/Camera.jsx";
// import AccountCreate from "./components/Auth/AccountCreate.jsx";
import Login from "./components/Auth/Login.jsx";
import Logout from "./components/Auth/Logout.jsx";

function App() {
  // return <Camera />;
  // return <AccountCreate />;
  return <Logout email="test@email.com" />;
}

export default App;
