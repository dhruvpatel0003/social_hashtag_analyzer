import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import UserProfile from './components/UserProfile';
import SearchPage from './components/SearchPage';
import ClickOnTheHashtag from './components/ClickOnTheHashtag';


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
  {
    path: '/search',
    element: <SearchPage />,

  },
  {
    path: '/search-hashtag/:hashtag',
    element: <ClickOnTheHashtag />,
  }
  
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
