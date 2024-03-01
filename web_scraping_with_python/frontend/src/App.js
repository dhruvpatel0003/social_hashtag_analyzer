import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import UserProfile from "./components/UserProfile";
import SearchPage from "./components/SearchPage";
import ClickOnTheHashtag from "./components/ClickOnTheHashtag";
import Dashboard from "./components/Dashboard";
import Analysis from "./components/Analysis";
import ForgotPassword from "./components/ForgotPassword";
import ResetPasswordPage from "./components/ResetPasswordPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/user-profile",
    element: <UserProfile />,
  },
  {
    path: "/search",
    element: <SearchPage />,
  },
  {
    path: "/search-hashtag/:hashtag",
    element: <ClickOnTheHashtag />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/analysis",
    element: <Analysis />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path:'/reset-password',
    element:<ResetPasswordPage />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
