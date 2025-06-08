import React, { useState } from 'react';
import { apiService } from '../services/api';

interface UserFormProps {
  onUserCreated: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await apiService.createUser(formData);
      setFormData({ name: '', email: '' });
      onUserCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card card-form">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">👤</span>
        <h3 className="font-semibold text-gray-900">Create New User</h3>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="form-group-compact">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input-compact"
            placeholder="Enter full name"
          />
        </div>

        <div className="form-group-compact">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input-compact"
            placeholder="Enter email address"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full btn-sm"
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Creating...
            </>
          ) : (
            <>
              <span>✨</span>
              Create User
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
