import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';


const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
