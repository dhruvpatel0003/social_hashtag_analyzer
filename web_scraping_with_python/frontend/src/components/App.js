import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import UserProfile from './UserProfile';


const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
{
  path: '/login',
  element: <LoginPage />,
},
{
  path: '/signup',
  element: <SignUpPage />,
},
{
  path: '/user-profile/:user_id',
  element: <UserProfile />,
},

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
