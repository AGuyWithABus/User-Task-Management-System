import React from 'react';
import Pagination from './Pagination';
import SearchAndFilter from './SearchAndFilter';

interface User {
  id?: number;
  name: string;
  email: string;
  created_at?: string;
}

interface Task {
  id?: number;
  user_id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at?: string;
}

interface TaskListProps {
  tasks: Task[];
  user: User | null;
  isLoading: boolean;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: string;
  onSortOrderChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  limit: number;
  currentUser: User | null;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  user,
  isLoading,
  total,
  page,
  totalPages,
  onPageChange,
  searchValue,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  statusFilter,
  onStatusFilterChange,
  limit,
  currentUser
}) => {
  const sortOptions = [
    { value: 'created_at', label: 'Date Created' },
    { value: 'title', label: 'Title' },
    { value: 'completed', label: 'Status' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' }
  ];
  if (!user) {
    return (
      <div className="card card-compact">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📋</span>
          <h3 className="font-semibold text-gray-900">Tasks</h3>
        </div>
        <div className="text-center py-4">
          <div className="text-2xl mb-2">👆</div>
          <p className="text-gray-600 text-sm">
            Select a user to view their tasks
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="card card-compact">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📋</span>
          <h3 className="font-semibold text-gray-900">Tasks for {user.name}</h3>
        </div>
        <div className="text-center py-4">
          <div className="spinner mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card card-compact">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📋</span>
        <h3 className="font-semibold text-gray-900">
          Tasks for {user.name} ({total})
        </h3>
      </div>

      <SearchAndFilter
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        sortBy={sortBy}
        onSortByChange={onSortByChange}
        sortOrder={sortOrder}
        onSortOrderChange={onSortOrderChange}
        sortOptions={sortOptions}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        statusOptions={statusOptions}
        placeholder="Search tasks by title or description..."
      />

      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📝</div>
          <p className="text-gray-600">
            {searchValue || statusFilter !== 'all' ? 'No tasks found matching your criteria.' : 'No tasks found. Add a new task below!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`task-card ${task.completed ? 'task-card-completed' : 'task-card-pending'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 flex-1">
                  {task.completed && (
                    <span className="badge badge-success">
                      ✓
                    </span>
                  )}
                  <h5 className="font-medium text-gray-900">{task.title}</h5>
                </div>
                <small className="text-xs text-gray-500">
                  {task.created_at ? new Date(task.created_at).toLocaleDateString() : ''}
                </small>
              </div>

              {task.description && (
                <p className="text-sm text-gray-600 mb-3">
                  {task.description}
                </p>
              )}

              <div className="flex justify-between items-center">
                <span className={`badge ${task.completed ? 'badge-success' : 'badge-warning'}`}>
                  {task.completed ? 'Completed' : 'Pending'}
                </span>


              </div>
            </div>
          ))}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            total={total}
            limit={limit}
          />
        </div>
      )}


    </div>
  );
};

export default TaskList;
