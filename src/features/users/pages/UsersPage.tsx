import { useState } from 'react';
import { Pencil, Plus, Trash2, UserCog } from 'lucide-react';
import { toast } from '@/components/feedback/toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { TBody, TD, TH, THead, TR, Table } from '@/components/ui/Table';
import { ROLE_LABELS } from '@/shared/constants/roles';
import { UserForm, type UserFormValues } from '../components/UserForm';
import { useUsers } from '../hooks/useUsers';
import type { User } from '../types';

const PAGE_SIZE = 10;

/** Solo accesible para ADMIN (ver ProtectedRoute allowedRoles en el router). */
export function UsersPage() {
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { users, meta, loading, error, createUser, updateUser, deleteUser } = useUsers({
    page,
    limit: PAGE_SIZE,
  });

  function openCreateForm() {
    setEditingUser(null);
    setFormOpen(true);
  }

  function openEditForm(user: User) {
    setEditingUser(user);
    setFormOpen(true);
  }

  async function handleSubmit(payload: UserFormValues) {
    if (editingUser) {
      await updateUser(editingUser.id, payload);
      toast.success('Usuario actualizado correctamente.');
    } else {
      await createUser(payload);
      toast.success('Usuario creado correctamente.');
    }
    setFormOpen(false);
  }

  async function handleConfirmDelete() {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await deleteUser(userToDelete.id);
      toast.success('Usuario desactivado correctamente.');
      setUserToDelete(null);
    } catch {
      toast.error('No pudimos desactivar el usuario.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuarios"
        description="Administra las cuentas de acceso al sistema"
        actions={
          <Button icon={<Plus className="size-4" aria-hidden />} onClick={openCreateForm}>
            Nuevo usuario
          </Button>
        }
      />

      <Card>
        {loading && <Spinner label="Cargando usuarios..." />}

        {!loading && error && (
          <div className="p-4">
            <Alert variant="danger">{error}</Alert>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <EmptyState icon={UserCog} title="No hay usuarios registrados." />
        )}

        {!loading && !error && users.length > 0 && (
          <>
            <Table>
              <THead>
                <tr>
                  <TH>Usuario</TH>
                  <TH>Email</TH>
                  <TH>Rol</TH>
                  <TH>Estado</TH>
                  <TH className="text-right">Acciones</TH>
                </tr>
              </THead>
              <TBody>
                {users.map((user) => (
                  <TR key={user.id}>
                    <TD className="font-medium text-slate-900">
                      {user.firstName} {user.lastName}
                    </TD>
                    <TD>{user.email}</TD>
                    <TD>
                      <Badge variant={user.role === 'ADMIN' ? 'brand' : 'neutral'}>
                        {ROLE_LABELS[user.role]}
                      </Badge>
                    </TD>
                    <TD>
                      <Badge variant={user.active ? 'success' : 'neutral'}>
                        {user.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TD>
                    <TD>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Editar ${user.firstName}`}
                          onClick={() => openEditForm(user)}
                        >
                          <Pencil className="size-4" aria-hidden />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Eliminar ${user.firstName}`}
                          onClick={() => setUserToDelete(user)}
                        >
                          <Trash2 className="size-4 text-red-500" aria-hidden />
                        </Button>
                      </div>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            {meta && <Pagination meta={meta} onPageChange={setPage} />}
          </>
        )}
      </Card>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingUser ? 'Editar usuario' : 'Nuevo usuario'}
      >
        <UserForm
          initialValues={editingUser ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={userToDelete !== null}
        title="¿Desactivar usuario?"
        description={`"${userToDelete?.firstName} ${userToDelete?.lastName}" no podrá iniciar sesión. No se puede deshacer.`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setUserToDelete(null)}
      />
    </div>
  );
}
