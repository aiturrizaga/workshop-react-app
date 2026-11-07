import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/feedback/toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import type { Product } from '@/features/products/types';
import { ApiError } from '@/shared/api/apiError';
import { ProductSelector } from '../components/ProductSelector';
import { SaleSummary } from '../components/SaleSummary';
import { useCustomerOptions } from '../hooks/useCustomerOptions';
import { salesService } from '../services/salesService';
import type { CartItem } from '../types';

/**
 * Pantalla de registro de venta (estilo POS): dos columnas, buscador de
 * productos a la izquierda y resumen de la venta a la derecha.
 *
 * El carrito solo existe en el estado de este componente. Al confirmar,
 * el frontend envía ÚNICAMENTE { customerId, items: [{ productId, quantity }] }:
 * precio, stock y total los determina el backend dentro de una transacción.
 */
export function NewSalePage() {
  const navigate = useNavigate();
  const { customers, loading: loadingCustomers } = useCustomerOptions();

  const [customerId, setCustomerId] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleAddProduct(product: Product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, item.availableStock) }
            : item,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          unitPrice: product.price,
          availableStock: product.stock,
          quantity: 1,
        },
      ];
    });
  }

  function handleQuantityChange(productId: string, quantity: number) {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.availableStock)) }
          : item,
      ),
    );
  }

  function handleRemove(productId: string) {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }

  const total = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  async function handleConfirm() {
    setErrorMessage(null);
    setSubmitting(true);
    try {
      await salesService.create({
        customerId,
        items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      });
      toast.success('Venta registrada correctamente.');
      navigate('/sales');
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : 'No pudimos registrar la venta.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Nueva venta" description="Selecciona el cliente y agrega productos" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <ProductSelector onAdd={handleAddProduct} />
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex h-full flex-col">
            {loadingCustomers ? (
              <p className="text-sm text-slate-500">Cargando clientes...</p>
            ) : (
              <SaleSummary
                customers={customers}
                customerId={customerId}
                onCustomerChange={setCustomerId}
                items={cart}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
                total={total}
                submitting={submitting}
                errorMessage={errorMessage}
                onConfirm={handleConfirm}
              />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
