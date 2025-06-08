import React, { useState, useEffect } from 'react';
import { apiService } from './services/api';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import MessageCenter from './components/MessageCenter';

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

function App() {
  // User state
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // User pagination and filtering
  const [userPage, setUserPage] = useState(1);
  const [userTotal, setUserTotal] = useState(0);
  const [userTotalPages, setUserTotalPages] = useState(0);
  const [userSearch, setUserSearch] = useState('');
  const [userSortBy, setUserSortBy] = useState('created_at');
  const [userSortOrder, setUserSortOrder] = useState('DESC');
  const userLimit = 5;

  // Task state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // Task pagination and filtering
  const [taskPage, setTaskPage] = useState(1);
  const [taskTotal, setTaskTotal] = useState(0);
  const [taskTotalPages, setTaskTotalPages] = useState(0);
  const [taskSearch, setTaskSearch] = useState('');
  const [taskSortBy, setTaskSortBy] = useState('created_at');
  const [taskSortOrder, setTaskSortOrder] = useState('DESC');
  const [taskStatusFilter, setTaskStatusFilter] = useState('all');
  const taskLimit = 10;

  // General state
  const [error, setError] = useState<string | null>(null);

  // Load users when filters change
  useEffect(() => {
    loadUsers();
  }, [userPage, userSearch, userSortBy, userSortOrder]);

  // Load tasks when user is selected or filters change
  useEffect(() => {
    if (selectedUserId) {
      loadTasks(selectedUserId);
      const user = users.find(u => u.id === selectedUserId);
      setSelectedUser(user ?? null);
    } else {
      setTasks([]);
      setSelectedUser(null);
      setTaskPage(1);
    }
  }, [selectedUserId, taskPage, taskSearch, taskSortBy, taskSortOrder, taskStatusFilter, users]);

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    setError(null);
    try {
      const result = await apiService.getUsers({
        page: userPage,
        limit: userLimit,
        sortBy: userSortBy,
        sortOrder: userSortOrder,
        search: userSearch
      });
      setUsers(result.users);
      setUserTotal(result.total);
      setUserTotalPages(result.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadTasks = async (userId: number) => {
    setIsLoadingTasks(true);
    setError(null);
    try {
      const result = await apiService.getUserTasks(userId, {
        page: taskPage,
        limit: taskLimit,
        sortBy: taskSortBy,
        sortOrder: taskSortOrder,
        search: taskSearch,
        status: taskStatusFilter
      });
      setTasks(result.tasks);
      setTaskTotal(result.total);
      setTaskTotalPages(result.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleUserCreated = () => {
    setUserPage(1);
    loadUsers();
  };

  const handleUserSelect = (userId: number) => {
    setSelectedUserId(userId);
    setTaskPage(1); // Reset task page when selecting new user
  };

  const handleTaskCreated = () => {
    if (selectedUserId) {
      setTaskPage(1);
      loadTasks(selectedUserId);
    }
  };

  // User pagination and filtering handlers
  const handleUserPageChange = (page: number) => {
    setUserPage(page);
  };

  const handleUserSearchChange = (search: string) => {
    setUserSearch(search);
    setUserPage(1); // Reset to first page when searching
  };

  const handleUserSortByChange = (sortBy: string) => {
    setUserSortBy(sortBy);
    setUserPage(1);
  };

  const handleUserSortOrderChange = (sortOrder: string) => {
    setUserSortOrder(sortOrder);
    setUserPage(1);
  };

  // Task pagination and filtering handlers
  const handleTaskPageChange = (page: number) => {
    setTaskPage(page);
  };

  const handleTaskSearchChange = (search: string) => {
    setTaskSearch(search);
    setTaskPage(1);
  };

  const handleTaskSortByChange = (sortBy: string) => {
    setTaskSortBy(sortBy);
    setTaskPage(1);
  };

  const handleTaskSortOrderChange = (sortOrder: string) => {
    setTaskSortOrder(sortOrder);
    setTaskPage(1);
  };

  const handleTaskStatusFilterChange = (status: string) => {
    setTaskStatusFilter(status);
    setTaskPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="glass-header">
        <div className="container py-4">
          <h1 className="text-xl font-bold text-center text-white">
            🚀 User & Task Management System
          </h1>
          <p className="text-center text-white/80 mt-1 text-sm">
            Manage users, tasks, and secure messaging all in one place
          </p>
        </div>
      </header>

      <main className="container py-6">
        {error && (
          <div className="alert alert-error mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="grid-cols-2-compact grid">
          {/* Left Column - User Management */}
          <div className="space-y-4">
            <UserForm onUserCreated={handleUserCreated} />
            <UserList
              users={users}
              selectedUserId={selectedUserId}
              onUserSelect={handleUserSelect}
              isLoading={isLoadingUsers}
              total={userTotal}
              page={userPage}
              totalPages={userTotalPages}
              onPageChange={handleUserPageChange}
              searchValue={userSearch}
              onSearchChange={handleUserSearchChange}
              sortBy={userSortBy}
              onSortByChange={handleUserSortByChange}
              sortOrder={userSortOrder}
              onSortOrderChange={handleUserSortOrderChange}
              limit={userLimit}
            />
          </div>

          {/* Right Column - Task Management */}
          <div className="space-y-4">
            <TaskList
              tasks={tasks}
              user={selectedUser}
              isLoading={isLoadingTasks}
              total={taskTotal}
              page={taskPage}
              totalPages={taskTotalPages}
              onPageChange={handleTaskPageChange}
              searchValue={taskSearch}
              onSearchChange={handleTaskSearchChange}
              sortBy={taskSortBy}
              onSortByChange={handleTaskSortByChange}
              sortOrder={taskSortOrder}
              onSortOrderChange={handleTaskSortOrderChange}
              statusFilter={taskStatusFilter}
              onStatusFilterChange={handleTaskStatusFilterChange}
              limit={taskLimit}
              currentUser={selectedUser}
            />
            {selectedUserId && (
              <TaskForm
                userId={selectedUserId}
                onTaskCreated={handleTaskCreated}
              />
            )}
          </div>
        </div>

        {/* Message Center */}
        {selectedUser && (
          <div className="mt-8">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                💬 Secure Messaging
              </h2>
              <p className="text-gray-600 text-sm">
                Communicate securely with other users and collaborate on tasks
              </p>
            </div>
            <MessageCenter
              currentUser={selectedUser}
              users={users}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
