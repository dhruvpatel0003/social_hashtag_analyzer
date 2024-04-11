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
import ViewReport from "./components/ViewReport";
import UploadFileToAnalysis from "./components/UploadFileToAnalysis";
import Payment from "./components/Payment";
import Success from "./components/Success";
import Cancel from "./components/Cancel";

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
    path: "/analysis/:hashtag",
    element: <Analysis />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    // path:'/reset-password/:token',
    path:'/reset-password/:email/:token',
    element:<ResetPasswordPage />
  },
  {
    path:'/view-reports',
    element:<ViewReport />
  },
  {
    path:'/success',
    element:<Success />
  },
  {
    path:'/cancel',
    element: <Cancel />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
