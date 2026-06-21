import { useNavigate, Link } from 'react-router-dom';
import { UserForm } from '../components/UserForm';

const AddUser = () => {
  const navigate = useNavigate();

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h1>Add New User</h1>
        <Link to="/users" className="add-button" style={{ backgroundColor: '#6b7280' }}>
          &larr; Back to Users
        </Link>
      </div>

      <UserForm onSuccess={() => navigate('/users')} />
    </div>
  );
};

export default AddUser;
