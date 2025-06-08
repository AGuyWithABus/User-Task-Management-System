import React from 'react';
import Pagination from './Pagination';
import SearchAndFilter from './SearchAndFilter';

interface User {
  id?: number;
  name: string;
  email: string;
  created_at?: string;
}

interface UserListProps {
  users: User[];
  selectedUserId: number | null;
  onUserSelect: (userId: number) => void;
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
  limit: number;
}

const UserList: React.FC<UserListProps> = ({
  users,
  selectedUserId,
  onUserSelect,
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
  limit
}) => {
  const sortOptions = [
    { value: 'created_at', label: 'Date Created' },
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' }
  ];
  if (isLoading) {
    return (
      <div className="card card-compact">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">👥</span>
          <h3 className="font-semibold text-gray-900">Users</h3>
        </div>
        <div className="text-center py-4">
          <div className="spinner mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card card-compact">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">👥</span>
        <h3 className="font-semibold text-gray-900">
          Users ({total})
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
        placeholder="Search users by name or email..."
      />

      {users.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-gray-600">
            {searchValue ? 'No users found matching your search.' : 'No users found. Create your first user above!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => onUserSelect(user.id!)}
              className={`user-card ${selectedUserId === user.id ? 'user-card-selected' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium text-gray-900">{user.name}</h5>
                    {selectedUserId === user.id && (
                      <span className="badge badge-info">Selected</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <small className="text-xs text-gray-500">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : ''}
                </small>
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

export default UserList;
