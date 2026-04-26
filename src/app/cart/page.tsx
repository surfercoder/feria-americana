import { getAllProducts } from '@/lib/products';
import CartContent from './CartContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrito | Feria Americana',
  description: 'Revisa los productos en tu carrito y finaliza tu compra.',
};

export default async function CartPage() {
  const products = await getAllProducts();
  return <CartContent products={products} />;
}
