import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { UserForm } from '../components/UserForm';
import type { UserFormValues } from '../components/UserForm';
import { userService } from '../services/userService';

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<(UserFormValues & { id?: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      
      try {
        const user = await userService.getUserById(id);
        
        // Format date to YYYY-MM-DD for the date input
        const formattedDate = user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '';

        setInitialData({
          ...user,
          dateOfBirth: formattedDate as any, // Zod coercing handles it on submit
          secondaryMobile: user.secondaryMobile || '',
          placeOfBirth: user.placeOfBirth || '',
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading) {
    return (
      <div className="user-list-container">
        <div className="loading-state">Loading user details...</div>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="user-list-container">
        <div className="error-banner">{error || 'User not found'}</div>
        <Link to="/users" className="add-button" style={{ backgroundColor: '#6b7280' }}>
          &larr; Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h1>Edit User</h1>
        <Link to="/users" className="add-button" style={{ backgroundColor: '#6b7280' }}>
          &larr; Back to Users
        </Link>
      </div>

      <UserForm initialData={initialData} onSuccess={() => navigate('/users')} />
    </div>
  );
};

export default EditUser;
