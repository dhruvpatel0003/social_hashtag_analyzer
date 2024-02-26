import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import UserProfile from './components/UserProfile';
import SearchPage from './components/SearchPage';
import ClickOnTheHashtag from './components/ClickOnTheHashtag';
import Dashboard from './components/Dashboard';
import Analysis from './components/Analysis';

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
    path: '/user-profile',
    element: <UserProfile />,
  },
  {
    path: '/search',
    element: <SearchPage />,

  },
  {
    path: '/search-hashtag/:hashtag',
    element: <ClickOnTheHashtag />,
  },
  {
    path:'/dashboard',
    element:<Dashboard />
  },
  {
    path:'/analysis',
    element:<Analysis />
  }
  
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
