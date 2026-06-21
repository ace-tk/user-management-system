import { createBrowserRouter, Navigate } from 'react-router-dom';
import Users from '../pages/Users';
import AddUser from '../pages/AddUser';
import EditUser from '../pages/EditUser';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/users" replace />,
  },
  {
    path: '/users',
    element: <Users />,
  },
  {
    path: '/users/add',
    element: <AddUser />,
  },
  {
    path: '/users/edit/:id',
    element: <EditUser />,
  },
]);

export default router;
