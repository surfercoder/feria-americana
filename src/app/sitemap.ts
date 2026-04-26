import type { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();

  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `https://feriaamericana.com/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [
    {
      url: 'https://feriaamericana.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...productUrls,
  ];
}
