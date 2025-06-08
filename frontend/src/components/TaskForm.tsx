import React, { useState } from 'react';
import { apiService } from '../services/api';

interface TaskFormProps {
  userId: number;
  onTaskCreated: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ userId, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      await apiService.createTask(userId, formData);
      setFormData({ title: '', description: '' });
      onTaskCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card card-form">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">➕</span>
        <h4 className="font-semibold text-gray-900">Add New Task</h4>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="form-group-compact">
          <label htmlFor="title" className="form-label">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-input-compact"
            placeholder="Enter task title"
          />
        </div>

        <div className="form-group-compact">
          <label htmlFor="description" className="form-label">
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Enter task description"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-success w-full btn-sm"
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Adding...
            </>
          ) : (
            <>
              <span>🚀</span>
              Add Task
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
