import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import type { User } from '../services/userService';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  
  const limit = 10;

  const fetchUsers = async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers(page, limit);
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await userService.deleteUser(id);
        // Refresh the current page after successful deletion
        fetchUsers(currentPage);
      } catch (err: any) {
        alert(err.message || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h1>User Management</h1>
        <Link to="/users/add" className="add-button">+ Add New User</Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Primary Mobile</th>
              <th>Aadhaar</th>
              <th>PAN</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="loading-state">Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">No users found. Click "Add New User" to get started.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.primaryMobile}</td>
                  <td>{user.aadhaar}</td>
                  <td>{user.pan}</td>
                  <td className="action-links">
                    <Link to={`/users/edit/${user.id}`} className="edit-link">Edit</Link>
                    <button onClick={() => handleDelete(user.id, user.name)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && users.length > 0 && (
        <div className="pagination-controls">
          <div className="page-info">
            Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalRecords)} of {totalRecords} users
          </div>
          <div className="pagination-buttons">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <button
              className="page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
