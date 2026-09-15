import { useState } from 'react';
import { Package, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/shared/feedback/toast';
import { PageHeader } from '@/shared/layout/PageHeader';
import { Alert } from '@/shared/ui/Alert';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Modal } from '@/shared/ui/Modal';
import { Pagination } from '@/shared/ui/Pagination';
import { Spinner } from '@/shared/ui/Spinner';
import { TBody, TD, TH, THead, TR, Table } from '@/shared/ui/Table';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { ProductFilters } from '../components/ProductFilters';
import { ProductForm, type ProductFormValues } from '../components/ProductForm';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../types';

const PAGE_SIZE = 10;


export function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const debouncedSearch = useDebouncedValue(search);

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { products, meta, loading, error, createProduct, updateProduct, deleteProduct } =
    useProducts({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch,
      active: activeFilter === '' ? undefined : activeFilter === 'true',
    });

  function openCreateForm() {
    setEditingProduct(null);
    setFormOpen(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    setFormOpen(true);
  }

  async function handleSubmit(payload: ProductFormValues) {
    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
      toast.success('Producto actualizado correctamente.');
    } else {
      await createProduct(payload);
      toast.success('Producto creado correctamente.');
    }
    setFormOpen(false);
  }

  async function handleConfirmDelete() {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      toast.success('Producto eliminado correctamente.');
      setProductToDelete(null);
    } catch {
      toast.error('No pudimos eliminar el producto.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Productos"
        description="Gestiona el catálogo y stock de productos"
        actions={
          <Button icon={<Plus className="size-4" aria-hidden />} onClick={openCreateForm}>
            Nuevo producto
          </Button>
        }
      />

      <Card>
        <div className="border-b border-slate-200 p-4">
          <ProductFilters
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            active={activeFilter}
            onActiveChange={(value) => {
              setActiveFilter(value);
              setPage(1);
            }}
          />
        </div>

        {loading && <Spinner label="Cargando productos..." />}

        {!loading && error && (
          <div className="p-4">
            <Alert variant="danger">{error}</Alert>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <EmptyState
            icon={Package}
            title="No hay productos registrados."
            description={
              search ? 'Intenta con otra búsqueda.' : 'Crea el primer producto del catálogo.'
            }
          />
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <Table>
              <THead>
                <tr>
                  <TH>Producto</TH>
                  <TH>Precio</TH>
                  <TH>Stock</TH>
                  <TH>Estado</TH>
                  <TH className="text-right">Acciones</TH>
                </tr>
              </THead>
              <TBody>
                {products.map((product) => (
                  <TR key={product.id}>
                    <TD>
                      <p className="font-medium text-slate-900">{product.name}</p>
                      {product.description && (
                        <p className="max-w-xs truncate text-xs text-slate-500">
                          {product.description}
                        </p>
                      )}
                    </TD>
                    <TD>{formatCurrency(product.price)}</TD>
                    <TD>
                      {product.stock === 0 ? (
                        <Badge variant="danger">Agotado</Badge>
                      ) : (
                        product.stock
                      )}
                    </TD>
                    <TD>
                      <Badge variant={product.active ? 'success' : 'neutral'}>
                        {product.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TD>
                    <TD>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Editar ${product.name}`}
                          onClick={() => openEditForm(product)}
                        >
                          <Pencil className="size-4" aria-hidden />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Eliminar ${product.name}`}
                          onClick={() => setProductToDelete(product)}
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
        title={editingProduct ? 'Editar producto' : 'Nuevo producto'}
      >
        <ProductForm
          initialValues={editingProduct ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={productToDelete !== null}
        title="¿Eliminar producto?"
        description={`Esta acción desactivará "${productToDelete?.name}". No se puede deshacer.`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
}
