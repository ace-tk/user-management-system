import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Users from '../pages/Users';
import AddUser from '../pages/AddUser';
import EditUser from '../pages/EditUser';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
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
