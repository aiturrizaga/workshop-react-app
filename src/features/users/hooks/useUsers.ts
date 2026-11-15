import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/apiError';
import type { PaginationMeta } from '@/shared/types/api';
import { usersService } from '../services/usersService';
import type { CreateUserRequest, UpdateUserRequest, User } from '../types';

interface UseUsersParams {
  page: number;
  limit: number;
}

export function useUsers({ page, limit }: UseUsersParams) {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersService.list({ page, limit });
      setUsers(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No pudimos cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  async function createUser(payload: CreateUserRequest) {
    await usersService.create(payload);
    await fetchUsers();
  }

  async function updateUser(id: string, payload: UpdateUserRequest) {
    await usersService.update(id, payload);
    await fetchUsers();
  }

  async function deleteUser(id: string) {
    await usersService.remove(id);
    await fetchUsers();
  }

  return { users, meta, loading, error, createUser, updateUser, deleteUser };
}
