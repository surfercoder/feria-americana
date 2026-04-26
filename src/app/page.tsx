import { getAllProducts } from '@/lib/products';
import HomeContent from '../components/HomeContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Moda para mujer, hombre y niños',
  description: 'Explorá ropa y accesorios de segunda mano en Feria Americana. Moda para mujer, hombre y niños.',
};

export default async function Home() {
  const products = await getAllProducts();
  return <HomeContent products={products} />;
}
