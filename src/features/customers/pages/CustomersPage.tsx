import { useState } from 'react';
import { Pencil, Plus, Search, Trash2, Users } from 'lucide-react';
import { toast } from '@/components/feedback/toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { TBody, TD, TH, THead, TR, Table } from '@/components/ui/Table';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { CustomerForm, type CustomerFormValues } from '../components/CustomerForm';
import { useCustomers } from '../hooks/useCustomers';
import type { Customer } from '../types';

const PAGE_SIZE = 10;

export function CustomersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { customers, meta, loading, error, createCustomer, updateCustomer, deleteCustomer } =
    useCustomers({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch,
    });

  function openCreateForm() {
    setEditingCustomer(null);
    setFormOpen(true);
  }

  function openEditForm(customer: Customer) {
    setEditingCustomer(customer);
    setFormOpen(true);
  }

  async function handleSubmit(payload: CustomerFormValues) {
    if (editingCustomer) {
      await updateCustomer(editingCustomer.id, payload);
      toast.success('Cliente actualizado correctamente.');
    } else {
      await createCustomer(payload);
      toast.success('Cliente creado correctamente.');
    }
    setFormOpen(false);
  }

  async function handleConfirmDelete() {
    if (!customerToDelete) return;
    setDeleting(true);
    try {
      await deleteCustomer(customerToDelete.id);
      toast.success('Cliente eliminado correctamente.');
      setCustomerToDelete(null);
    } catch {
      toast.error('No pudimos eliminar el cliente.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Gestiona la información de tus clientes"
        actions={
          <Button icon={<Plus className="size-4" aria-hidden />} onClick={openCreateForm}>
            Nuevo cliente
          </Button>
        }
      />

      <Card>
        <div className="border-b border-slate-200 p-4">
          <div className="relative sm:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <Input
              className="pl-9"
              placeholder="Buscar por nombre o documento..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              aria-label="Buscar clientes"
            />
          </div>
        </div>

        {loading && <Spinner label="Cargando clientes..." />}

        {!loading && error && (
          <div className="p-4">
            <Alert variant="danger">{error}</Alert>
          </div>
        )}

        {!loading && !error && customers.length === 0 && (
          <EmptyState
            icon={Users}
            title="No hay clientes registrados."
            description={search ? 'Intenta con otra búsqueda.' : 'Registra tu primer cliente.'}
          />
        )}

        {!loading && !error && customers.length > 0 && (
          <>
            <Table>
              <THead>
                <tr>
                  <TH>Cliente</TH>
                  <TH>Documento</TH>
                  <TH>Contacto</TH>
                  <TH>Estado</TH>
                  <TH className="text-right">Acciones</TH>
                </tr>
              </THead>
              <TBody>
                {customers.map((customer) => (
                  <TR key={customer.id}>
                    <TD className="font-medium text-slate-900">
                      {customer.firstName} {customer.lastName}
                    </TD>
                    <TD>{customer.documentNumber}</TD>
                    <TD>
                      <p>{customer.email ?? '—'}</p>
                      <p className="text-xs text-slate-500">{customer.phone ?? ''}</p>
                    </TD>
                    <TD>
                      <Badge variant={customer.active ? 'success' : 'neutral'}>
                        {customer.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TD>
                    <TD>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Editar ${customer.firstName}`}
                          onClick={() => openEditForm(customer)}
                        >
                          <Pencil className="size-4" aria-hidden />
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Eliminar ${customer.firstName}`}
                            onClick={() => setCustomerToDelete(customer)}
                          >
                            <Trash2 className="size-4 text-red-500" aria-hidden />
                          </Button>
                        )}
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
        title={editingCustomer ? 'Editar cliente' : 'Nuevo cliente'}
      >
        <CustomerForm
          initialValues={editingCustomer ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={customerToDelete !== null}
        title="¿Eliminar cliente?"
        description={`Esta acción desactivará a "${customerToDelete?.firstName} ${customerToDelete?.lastName}". No se puede deshacer.`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCustomerToDelete(null)}
      />
    </div>
  );
}
